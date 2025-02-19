import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute,Params} from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { NgForm } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
//import { Geolocation } from '@capacitor/geolocation';
import { TelemetryService } from 'src/app/services/telemetry.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
public tokenFromEmail: string;
public person = {
  password:'',
  confirmPassword: ''
}
passwordsMatching: boolean = true;
passwordType: string = 'password';
passwordIcon: string = 'eye-off';
regPasswordType: string = 'password';
regPasswordIcon: string = 'eye-off';
confirmPasswordType: string = 'password';
confirmPasswordIcon: string = 'eye-off';
showPattern: boolean = true;
showInvalidTokenMesg: boolean = false;
showFailedUpdateMsg: boolean = false;
setLoader: boolean = false;
showDiv: boolean = true;
public userIp : string;
public deviceType : string;
public userAgent : string;
public geolocationPosition: string='';
 showErrorMsg: boolean = false;
  errorMessage: any;
  constructor(private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,
    private httpClient: HttpClient,
    private deviceService: DeviceDetectorService,
    public telemetry: TelemetryService,
    ) {
    const routeState = this.router.getCurrentNavigation()?.extras.state;
    if (Capacitor.getPlatform() === 'web') {
      this.route.queryParams
        .subscribe(params => {
          this.tokenFromEmail = params.token;
        }
      );    
    }
    else{
      this.tokenFromEmail = routeState.token;
    }
  }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-');
    let attributes = {
        userId: this._pocnLocalStorageManager.getData("userId"),
        firstName: this._pocnLocalStorageManager.getData("firstName"),
        lastName: this._pocnLocalStorageManager.getData("lastName"),
        userEmail:this._pocnLocalStorageManager.getData("userEmail"),
        url:this.router.url
    }
    const eventName = 'page view';
    const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'viewed page' }
    this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
        this.telemetry.parentTrace = result;
    })
    this.verifyToken();
  }
  showValue() {
    this.showPattern = true;
  }
  hideShowRegisterPassword() {
    this.regPasswordType = this.regPasswordType === 'text' ? 'password' : 'text';
    this.regPasswordIcon = this.regPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  hideShowConfirmPassword() {
    this.confirmPasswordType = this.confirmPasswordType === 'text' ? 'password' : 'text';
    this.confirmPasswordIcon = this.confirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }


  verifyToken(){
    this._pocnService.getResetPassword(this.tokenFromEmail).subscribe(
      (response: any) => {
        if (response.data.getResetPassword.getResetPasswordResult.status !='Success') {
          // invalid token case
          this.showInvalidTokenMesg = true;
        }
    }); 
  }
  loadIp() {
    this.httpClient.get('https://jsonip.com').subscribe(
      (value: any) => {
        this.userIp = value.ip;
      },
      (error) => {
      }
    );

  }
  get device(): any {
    return this.deviceService.getDeviceInfo();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get isTablet(): boolean {
    return this.deviceService.isTablet();
  }

  get isDesktop(): boolean {
    return this.deviceService.isDesktop();
  }

  resetPassword(f:NgForm){
    let regexPattern = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/);
    let searchPattern = regexPattern.test(this.person.confirmPassword);
    if (this.person.password === this.person.confirmPassword && this.person.password != '' && this.person.confirmPassword != '') {
      this.passwordsMatching = true;
      this.showPattern = true;
    } else {
      if (this.person.password != '' && this.person.confirmPassword != '') {
        this.passwordsMatching = false;
        this.showPattern = false;
      }
    }
    if ( this.person.password!='' && this.person.confirmPassword!='' && this.person.password == this.person.confirmPassword  && this.passwordsMatching === true && searchPattern === true) {
      this.setLoader = true;
      this._pocnService.updatePassword(
        this.tokenFromEmail,this.person['password'],
        this._pocnLocalStorageManager.getData("ipv4"),
        this._pocnLocalStorageManager.getData("ipv6"),
        this.device.userAgent,
        this.deviceType,
        this.geolocationPosition
        ).subscribe((response: any) => {
          if (response.data.updatePassword.updatePasswordResult.status =='Success') {
            this.router.navigate(["/reset-password-success"]);
            const spanName = "reset-password-btn";
            let attributes = {
             // userEmail:f.value['username'],
            }
            const eventName = 'reset password';
            const event =  { 'status': 'success', 'message': 'successfully updated password' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }
          else{
            //error
            this.showFailedUpdateMsg = true;
            this.errorMessage = response.data.updatePassword.updatePasswordResult.message;
            const spanName = "reset-password-btn";
            let attributes = {
              reason: response.data.updatePassword.updatePasswordResult.message,
              status:'Failed'            
            }
            const eventName = 'reset password';
            const event =  { 'status': 'failed', 'message': 'failed to update password' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
            
          }
          this.setLoader = false;
      });
    }
    // else {
    //   this.passwordsMatching = false;
    //  // this.showPattern = false;
    // }
  }
  ionViewDidEnter() {
    this.loadIp();
    //this.getPosition();
    if(this.isMobile == true){
      this.deviceType = "Mobile"
    }
    else if(this.isTablet == true){
      this.deviceType = "Tablet"
    }
    else if(this.isDesktop == true){
      this.deviceType = "Desktop"
    }
    else{
      this.deviceType = "Unknown"
    }
  }
}
