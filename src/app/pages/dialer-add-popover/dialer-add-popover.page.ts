import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TelemetryService } from 'src/app/services/telemetry.service';

@Component({
  selector: 'app-dialer-add-popover',
  templateUrl: './dialer-add-popover.page.html',
  styleUrls: ['./dialer-add-popover.page.scss'],
})
export class DialerAddPopoverPage implements OnInit {
  public myUserDialerData: any[];
  public token: string;
  public userName: string = '';
  public workNumber: string = '';
  public providerHcpNpi: string;
  public providerId: string;
  public userId: string;

  showAddNumber: boolean = true;
  showAddCountryError: boolean = false;
  showNumberErrorMsg:boolean = true;
  callerVerifyErr: boolean = true;
  showPhoneErr: boolean =false;
  showNameErr: boolean = false;
  connectNameWhiteSpaceCheck: boolean = false;
  ShowErrMsgPhone: boolean = false;
  twilioServerURL = environment.twilioServerURL;
  activateCode = null;
  callerIds = [];
  public countryCodeArray;
  constructor(private modalController: ModalController,
    public alertController: AlertController,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private http: HttpClient,
    private router: Router,
    public telemetry: TelemetryService,

    ) {
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') +'-'+ "add-dialer-popover";
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
    this.getUserProfile();
    this.getDialerCaller();
    this.getTelephoneCountryCode();
  }
  async close() {
    await this.modalController.dismiss();
  }
  getUserProfile() {
    this._pocnService.getUserBasicProfile(this.token)?.subscribe(({ data }) => {
    this.providerHcpNpi= data['getUserBasicProfile'].data['userBasicProfile']['npi'];
    this.providerId = data['getUserBasicProfile'].data['userBasicProfile']['providerId'];
    this.userId = data['getUserBasicProfile'].data['userBasicProfile']['userId'];
    },
      (error) => {
          this.router.navigate(['/'])
      });
  }
  getDialerCaller() {
    this._pocnService.getDialerCaller(this.token)?.subscribe(({ data }) => {
      this.myUserDialerData = data['getDialerCaller'].data;
    })
  }
  getTelephoneCountryCode(){
    this._pocnService.getTelephoneCountryCode(this.token)?.subscribe(({ data }) => {
      let connectCountryCode;
      connectCountryCode = JSON.parse(JSON.stringify(data));
      this.countryCodeArray = connectCountryCode.getTelephoneCountryCode.data.countryCode;
    })
  }
  async saveAddPopOver(f:NgForm){
    if((f.value['workPhoneNumber'] != null) ||(f.value['workPhoneNumber'] != undefined)){
      let userPhoneNumber = f.value['workPhoneNumber'].replaceAll('+', '');
      let countryCodes=this.countryCodeArray;
      let phone=userPhoneNumber;
     let  validNumber = countryCodes.some(elem => phone.match('^' + elem));
      if(!isNaN(f.value['workPhoneNumber'])){
        if(f.value['workPhoneNumber'].length < 10){
          this.showAddNumber=true;
          this.showAddCountryError = true;
          this.showNumberErrorMsg =true;
         this.callerVerifyErr = true;
        } else if(f.value['workPhoneNumber'].length > 10 && validNumber == false){
          this.showAddNumber=true;
          this.showAddCountryError = true;
          this.showNumberErrorMsg =true;
          this.callerVerifyErr = true;
        }else {
          this.showAddCountryError = false;
          this.callerVerifyErr = true;
        }
        // if(f.value['workPhoneNumber'].length < 11 || validNumber == false){
        //   this.showAddNumber=true;
        //   this.showAddCountryError = false;
        //   this.showNumberErrorMsg =true;
        //   this.callerVerifyErr = true;
        // }
        // else{
        //   this.showAddCountryError = true;
        //   this.callerVerifyErr = true;
        // }
      }
      else{
        this.showNumberErrorMsg =true;
        this.showAddCountryError = false;
        this.showAddNumber = false;
      }
    }

    if(f.value['workPhoneNumber'] == null ||f.value['workPhoneNumber'] == '' || f.value['workPhoneNumber'] == undefined){
      this.showAddCountryError = false;
      this.showAddNumber = true;
      this.showPhoneErr =true;
    }
    else{
      this.showPhoneErr =false;
    }
    if(f.value['userName'] == null || f.value['userName'] == '' || f.value['userName'] == undefined){
      this.showNameErr = true;
      //this.showAddCountryError = false;
      this.connectNameWhiteSpaceCheck = false;
    }
    else{
      this.showNameErr = false;
    }
    //name space validation
   if(f.value['userName']){
      if (!f.value['userName'].replace(/\s/g, '').length) {
        this.connectNameWhiteSpaceCheck = true;
        this.showAddCountryError = false;
        this.showNameErr = false;
      }
      else {
        this.connectNameWhiteSpaceCheck = false;
      }
    }
    //add caller settings
    if(f.value['workPhoneNumber'] && f.value['userName'] && !isNaN(f.value['workPhoneNumber']) && (f.value['workPhoneNumber'].length >= 10) &&  this.connectNameWhiteSpaceCheck == false && this.showAddCountryError == false ){
      this.showAddCountryError = false;
      this.showAddNumber = true;
      this.ShowErrMsgPhone = false;
      this.callerVerifyErr = true;
      let countryCodes=this.countryCodeArray;
      let phone = f.value['workPhoneNumber'].replaceAll('+', '');
      let validNumber = countryCodes.some(elem => phone.match('^' + elem));
      let mobilePhoneNumber;
      if(validNumber == true){
        mobilePhoneNumber = phone;
      }
      else{
        mobilePhoneNumber = countryCodes + phone;
      }
      let callerData = {
        accessToken: this.token,
        name:f.value['userName'],
        phoneNumber: mobilePhoneNumber,
        npi:this.providerHcpNpi,
        providerId:parseInt(this.providerId),
        userId:this.userId,
      }
      // caller id verification removed from client approval
      this._pocnService.updateCallerProfileDetails(callerData).subscribe(
        (response: any) => {
          if (response.data.addCallerProfile.userProfileUpdateResponse.status === 'Success') {
            this.close();
            this.getDialerCaller();
            this.ShowErrMsgPhone = false;
            const spanName = "dialer-caller-add-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail")
          }
          const eventName = 'dialer caller data';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully added caller data' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
          } else {
              if(response.data.addCallerProfile.userProfileUpdateResponse.error === 'Phone number already exists'){
                this.ShowErrMsgPhone = true;
                this.connectNameWhiteSpaceCheck = false;
              }
          }
        });
    }
  }
}
