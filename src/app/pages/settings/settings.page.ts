import { Component, OnInit, Inject} from "@angular/core";
import { CookieManager } from "./../../services/cookie-manager";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT  } from '@angular/common';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
//import { Geolocation } from '@capacitor/geolocation';
import { NavController } from "@ionic/angular";
import { TelemetryService } from 'src/app/services/telemetry.service';
import { NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  logoutStatus = false;
  hidePatientConnectBtn: boolean = true;
  setLogoutLoader: boolean = false;
  public myUserDialerData: any[];
  public hcpVerified : number;
  public phoneLinked: number;
  public verificationType: string;
  public userIp : string;
  public deviceType : string;
  public userAgent : string;
  public geolocationPosition: string ='';
  constructor(private _pocnCookieManager: CookieManager,
    private router: Router,
    private _pocnLocalStorageManager: LocalStorageManager,
    private sanitizer: DomSanitizer,
    private _pocnService: GraphqlDataService,
    private httpClient: HttpClient,
    private deviceService: DeviceDetectorService,
    private navController: NavController,
    public telemetry: TelemetryService,
    @Inject(DOCUMENT) private document: Document) {
     }

  ngOnInit() {
    this.patientConnectStatusCalls();
    this.loadIp();
    //this.getPosition();
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') ;
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
    //load npi
    loadIp() {
      this.httpClient.get('https://jsonip.com').subscribe(
        (value: any) => {
          this.userIp = value.ip;
        },
        (error) => {
        }
      );

    }
  logoutBtnClick = () => {
    this.setLogoutLoader = true;
    this._pocnService.logout(
      this._pocnLocalStorageManager.getData("refreshToken"),
      this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
      this._pocnLocalStorageManager.getData("userId"),
      this._pocnLocalStorageManager.getData("ipv4"),
      this._pocnLocalStorageManager.getData("ipv6"),
      this.device.userAgent,
      this.deviceType,
      this.geolocationPosition
      ).subscribe(({ data }) => {
    this.logoutStatus = true;
    const spanName = "logout-submit-btn";
    let attributes = {
        userId: this._pocnLocalStorageManager.getData("userId"),
        firstName: this._pocnLocalStorageManager.getData("firstName"),
        lastName: this._pocnLocalStorageManager.getData("lastName"),
        userEmail:this._pocnLocalStorageManager.getData("userEmail")
    }
    const eventName = 'user logout';
    const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully logged out' }
    this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
        this.telemetry.parentTrace = result;
    })
    this._pocnLocalStorageManager.removeData("firstName");
    this._pocnLocalStorageManager.removeData("lastName");
    this._pocnLocalStorageManager.removeData("pocnApiAccessToken");
    this._pocnLocalStorageManager.removeData("userEmail");
    this._pocnLocalStorageManager.removeData("refreshToken");
    this._pocnLocalStorageManager.removeData("tabName");
    this._pocnLocalStorageManager.removeData("subTabName");
    this._pocnLocalStorageManager.removeData("connectionTabName");
    this._pocnLocalStorageManager.removeData("userId");
    this._pocnLocalStorageManager.removeData("otContext");
    this._pocnLocalStorageManager.removeData("imgExtension");
    //this._pocnLocalStorageManager.removeData("ipv4");
    //this._pocnLocalStorageManager.removeData("ipv6");
    this.setLogoutLoader = false;

    this.navController.navigateBack('/register');
    });
  }

  backBtnClick(){
    //this.router.navigate(["/tablinks/my-profile"]);
    // const navigationExtras: NavigationExtras = {
    //   queryParams: { timestamp: new Date().getTime() }
    // };
    // this.router.navigate(["/tablinks/my-profile"], navigationExtras);
    this.router.navigateByUrl('/tablinks/my-profile',{ state: {  msg: 'settingsRoute'} } );

  }
  reloadPage() {
    setTimeout(()=>{
      window.location.reload();
    }, 100);
  }

  preferenceBtnClick(){
    this.router.navigate(["/preference"]);
  }
  patientConnectStatusCalls(){
    this._pocnService.patientConnectStatusCalls(this._pocnLocalStorageManager.getData("userId")?.toUpperCase())?.subscribe(({ data }) => {
      if(data.patientConnectStatusCalls.nodes != ''){
        let setSuccess ;
        setSuccess = data.patientConnectStatusCalls.nodes[0];
        this.hcpVerified = setSuccess.hcpVerified;
        this.phoneLinked = setSuccess.phoneLinked;
        this.verificationType = setSuccess.verificationType;
        if(setSuccess.patientConnectRegistrationStatus == 1){
          this.hidePatientConnectBtn = false;
        }
      }
    })
  }
  patientConnectBtnClick(){
    this.router.navigate(["/patient-connect-settings"]);
  }
  privacyClick(){
    window.open("https://www.pocn.com/privacy-policy/", '_system')
  }
  contactUsClick(){
    this.router.navigate(["/contact-us"]);
  }
  faqClick(){
    this.router.navigate(["/faq"]);
  }
  deleteBtnClick(){
    this.router.navigate(["/delete-settings"]);
  }
}
