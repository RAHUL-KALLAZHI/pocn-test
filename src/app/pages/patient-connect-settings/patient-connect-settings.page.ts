import { Component, OnInit } from '@angular/core';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import {ValidatePhoneNumberResponse, SubmitPhoneLinkingResponse, SubmitEmailConfirmResponse, SubmitEmailVerificationResponse, ResendVerificationCodeResponse, ValidateEmailResponse } from './../../services/type';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PhoneConnectAlertPopoverPage } from "../phone-connect-alert-popover/phone-connect-alert-popover.page";
import { ModalController } from '@ionic/angular';
import { EmailConnectAlertPopoverPage} from "../email-connect-alert-popover/email-connect-alert-popover.page";
import { NgForm } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
//import { Geolocation } from '@capacitor/geolocation';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-connect-settings',
  templateUrl: './patient-connect-settings.page.html',
  styleUrls: ['./patient-connect-settings.page.scss'],
})
export class PatientConnectSettingsPage implements OnInit {
  showDisablerNumber: boolean = true;
  showSendButton: boolean = false;
  showSendNumberButton: boolean = false;
  showEditButton: boolean = false;
  public myUserPhone: any;
  email:string;
  public token: string;
  showVerifyNumber: boolean = false;
  showCallCountryError:boolean = true;
  showNumber: boolean = true;
  otpNumber: '';
  twilioServerURL = environment.twilioServerURL;
  verifyMessage:boolean = true;
  hideErrorMsg: boolean;
  userAgent: string;
  showEmailEditButton: boolean = false;
  showSendEmailButton: boolean = true;
  showDisableEmail: boolean = true;
  showEmailError:boolean = true ;
  public emailCode: string;
  showVerifyEmail: boolean = false;
  showEmailButton:boolean = false;
  resendErrMsg: boolean = true;
  updateEmailId: string;
  userIp = '';
  deviceType: string = '';
  geolocationPosition: string = '';
  public countryCodeArray;
  disableResendBtn:boolean =  false;
  successEmailResendMsg: boolean = false;
  constructor(private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    private http: HttpClient,
    private router: Router,
    private deviceService: DeviceDetectorService,
    public telemetry: TelemetryService,
    ) {this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken"); }

  ngOnInit() {
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
   this.getUserContactDetail();
   this.getTelephoneCountryCode();
   this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();
   this.loadIp();
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
      //this.getPosition();
  }

  //device details
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
  //load ipaddress
  loadIp() {
    this.http.get('https://jsonip.com').subscribe(
      (value: any) => {
        this.userIp = value.ip;
      },
      (error) => {
      }
    );

  }
  //get location
  // getCurrentPosition = async () => {
  //   const coordinates = await Geolocation.getCurrentPosition();
  //   this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
  // };
  // getPosition(): any {
  //   Geolocation.getCurrentPosition().then(coordinates => {
  //     this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
  //   }).catch((error) => {
  //     this.geolocationPosition = "";
  //     console.log('Error getting location', error);
  //   });
  // }
   //fetching browser details
 detectBrowserName() {
  const agent = window.navigator.userAgent.toLowerCase()
  switch (true) {
    case agent.indexOf('edge') > -1:
      return 'edge';
    case agent.indexOf('opr') > -1 && !!(<any>window).opr:
      return 'opera';
    case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
      return 'chrome';
    case agent.indexOf('trident') > -1:
      return 'ie';
    case agent.indexOf('firefox') > -1:
      return 'firefox';
    case agent.indexOf('safari') > -1:
      return 'safari';
    default:
      return 'other';
  }
}
detectBrowserVersion(){
  let userAgent = navigator.userAgent, tem,
  matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

  if(/trident/i.test(matchTest[1])){
      tem =  /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE '+(tem[1] || '');
  }
  if(matchTest[1]=== 'Chrome'){
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
  }
  matchTest= matchTest[2]? [matchTest[1], matchTest[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem= userAgent.match(/version\/(\d+)/i))!= null) matchTest.splice(1, 1, tem[1]);
  return matchTest.join(' ');
}
getTelephoneCountryCode(){
  this._pocnService.getTelephoneCountryCode(this.token)?.subscribe(({ data }) => {
    let connectCountryCode;
    connectCountryCode = JSON.parse(JSON.stringify(data));
    this.countryCodeArray = connectCountryCode.getTelephoneCountryCode.data.countryCode;
  })
}
  getUserContactDetail() {
    this._pocnService.getPatientContactDetailConfirmed(this.token)?.subscribe(({ data }) => {
      if(data['getPatientContactConfirmed']['data'] != null){
        if(data['getPatientContactConfirmed']['data'].email != ''){
          this.email = data['getPatientContactConfirmed']['data'].email;
        }
        if(data['getPatientContactConfirmed']['data'].phone){
          this.myUserPhone = '+' + data['getPatientContactConfirmed']['data'].phone.replace('-', '');
        }
      }
    })
  }
  //hide edit icon
  editSettingsContact(f:NgForm){
    this.showDisablerNumber = false;
    this.showSendButton = true;
    this.showEditButton = true;
    this.showSendNumberButton = true;
    this.myUserPhone =  this.myUserPhone.replaceAll('+', '');
  }
  //verficiation
  clickVerifyNumber(f:NgForm){

    if((f.value['mobilePhoneNumber'] != null) ||(f.value['mobilePhoneNumber'] != undefined)){
      let mobilePhoneNumber = f.value['mobilePhoneNumber'].replace('+', '');
      let countryCodes = this.countryCodeArray;
      let phone=mobilePhoneNumber;
      let  validNumber = countryCodes.some(elem => phone.match('^' + elem));
      if(!isNaN(f.value['mobilePhoneNumber'])){
         if(f.value['mobilePhoneNumber'].length < 10){
          this.showNumber=true;
          this.showCallCountryError = false;
        }else if(f.value['mobilePhoneNumber'].length > 10 && validNumber == false){
          this.showNumber=true;
          this.showCallCountryError = false;
        }else {
          this.showCallCountryError = true;
        }
      } else {
        this.showCallCountryError = true;
        this.showNumber = false;
      }
    }
    if(f.value['mobilePhoneNumber'] != '' && !isNaN(f.value['mobilePhoneNumber']) && f.value['mobilePhoneNumber'].length >= 10  && this.showCallCountryError == true){
      this.showCallCountryError = true;
      let countryCodes = this.countryCodeArray;
      let phone= f.value['mobilePhoneNumber'];
      let  validNumber = countryCodes.some(elem => phone.match('^' + elem));
      let mobilePhoneNumber;
      if(validNumber == true){
        mobilePhoneNumber = f.value['mobilePhoneNumber'];
        console.log(validNumber);
        console.log(mobilePhoneNumber)
      }
      else{
        mobilePhoneNumber = countryCodes + f.value['mobilePhoneNumber'];
      }
      let validatePhoneNumber: any;
      validatePhoneNumber = {
            accessToken: this.token,
            phoneNumber: mobilePhoneNumber,
          }
      this._pocnService.validatePhoneNumber(validatePhoneNumber).subscribe(
        (response: ValidatePhoneNumberResponse) => {
          if(response.data.validatePhoneNumber.updateConnectionResponse.status === 'success') {
            this.showSendNumberButton = false;
            this.showSendButton = true;
             this.sendOtp(f);
                const spanName = "connect-settings-phone-validate-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            }
          console.log(attributes);
          const eventName = 'connect settings phone validate';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'phone number validated successfully' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
          } else if(response.data.validatePhoneNumber.updateConnectionResponse.status === 'error' && response.data.validatePhoneNumber.updateConnectionResponse.error === 'This phone number already exists'){
              this.numberAlertPopOver();
              this.otpNumber = '';
              this.showDisablerNumber = false;
              this.showVerifyNumber = false;
          } else {
              this.showVerifyNumber = true;
              this.showDisablerNumber = true;
              this.verifyMessage = true;
          }
        });
      console.log("=========sendOtp");
    } else {
    }
  }
// phone number resend code
sendNumberResendCode(f:NgForm){
  this.disableResendBtn = true;
  this.successEmailResendMsg = true;
  setTimeout(
    function () {
      this.successEmailResendMsg = false;
    }.bind(this),
    3000,
  )
  this.otpNumber = '';
  this.sendOtp(f);
}
//otp generation section
  async sendOtp(f:NgForm) {
    //call step4 verification
    if(this.myUserPhone){
      let countryCodes = this.countryCodeArray;
      let phone= this.myUserPhone;
      let  validNumber = countryCodes.some(elem => phone.match('^' + elem));
      let mobilePhoneNumber;
      if(validNumber == true){
        mobilePhoneNumber = this.myUserPhone;
        console.log(mobilePhoneNumber)
      }
      else{
        mobilePhoneNumber = countryCodes + this.myUserPhone;
        console.log(mobilePhoneNumber)
      }
      const bodyData = { "phoneNumber": `${mobilePhoneNumber}`, "channel": 'sms' }
      this.http.post(`${this.twilioServerURL}/login`, bodyData).subscribe((data) => {
        if (data['status'] === 'pending'){
          console.log(4)
          this.showVerifyNumber = true;
          this.showDisablerNumber = true;
          this.disableResendBtn = false;
        } else {
          this.showVerifyNumber = false;
          this.showDisablerNumber = false;
          this.disableResendBtn = false;
        }
      })
    }
  }
  async numberAlertPopOver() {
    const popover = await this.modalController.create({
      component: PhoneConnectAlertPopoverPage,
      cssClass: 'phonealert-modal',
    });
    popover.onDidDismiss().then((modalDataResponse) => {
    });
    await popover.present();
  }
  //verify otp
  clickVerifyOtp(f:NgForm){
      if(f.value['otpNumber'] != '' && f.value['otpNumber'] != undefined ){
        this.verifyOtp(f);
      } else {
        this.showVerifyNumber = true;
        this.showDisablerNumber = true;
      }
  }
  //otp verification
  async verifyOtp(f:NgForm) {
    if(this.myUserPhone){
      let mobileNumber = this.myUserPhone.replace('+', '');
      let countryCodes = this.countryCodeArray;
      let phone= this.myUserPhone;
      let  validNumber = countryCodes.some(elem => phone.match('^' + elem));
      let mobilePhoneNumber;
      if(validNumber == true){
        mobileNumber = mobileNumber;
        console.log(mobilePhoneNumber)
      }
      else{
        mobileNumber = countryCodes + mobileNumber;
        console.log(mobilePhoneNumber)
      }
      const bodyData = { "phoneNumber": `${mobileNumber}`, "code": this.otpNumber }
      this.http.post(`${this.twilioServerURL}/verify`, bodyData).subscribe((data) => {
        if (data['status'] === 'approved') {
          let verifyPhoneNumber: any;
          verifyPhoneNumber = {
            accessToken: this.token,
            phoneNumber: mobileNumber,
            countryCode: '',
            channel: this.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation:'',
          }
          console.log(verifyPhoneNumber)
          if(verifyPhoneNumber){
              this._pocnService.updateCallerContactPhone(verifyPhoneNumber).subscribe(
                (response: any) => {
                  if (response.data.updateCallerContactPhone.updateConnectionResponse.status === 'success') {
                    this.verifyMessage = true;
                    this.showDisablerNumber = true;
                    this.showVerifyNumber= false;
                    this.showSendButton= false;
                    const spanName = "connect-settings-otp-verify-btn";
                    let attributes = {
                      userId: this._pocnLocalStorageManager.getData("userId"),
                      firstName: this._pocnLocalStorageManager.getData("firstName"),
                      lastName: this._pocnLocalStorageManager.getData("lastName"),
                      userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                    }
                  console.log(attributes);
                  const eventName = 'connect settings otp verification';
                  const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'otp verified successfully' }
                  this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                      this.telemetry.parentTrace = result;
                  })
                  }
                  else{
                    this.showVerifyNumber = true;
                    this.showDisablerNumber = true;
                    this.verifyMessage = true;
                  }
                });
          }
        } else {
            this.verifyMessage = false
            this.showVerifyNumber = true;
            this.showDisablerNumber = true;
        }
      })
    }
  }
  //hide email icons
  editSettingsEmail(f:NgForm){
    this.showEmailEditButton =true;
    this.showSendEmailButton = false;
    this.showDisableEmail = false;
    this.showEmailButton = true;
  }
  //for email
sendVerifyEmail(f:NgForm){
  this.successEmailResendMsg = false;
  if(f.value['email']){
    let regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z](?:[a-z-]*[a-z])?$/g;
    let lowVal = f.value['email'].toLowerCase();
    let searchfind = regex.test(lowVal);
    if(f.value['email'] != '' && searchfind === true){
      this.emailCode ="";
      this.showEmailError = true;
      let validateEmail: any;
      validateEmail = {
      accessToken: this.token,
      workEmail: f.value['email'],
      }
      this.updateEmailId = f.value['email'].toLowerCase();
      this._pocnService.validateWorkEmail(validateEmail).subscribe(
        (response: ValidateEmailResponse) => {
          if(response.data.validateWorkEmail.updateConnectionResponse.status === 'success') {
            const spanName = "connect-settings-email-validate-btn";
                    let attributes = {
                      userId: this._pocnLocalStorageManager.getData("userId"),
                      firstName: this._pocnLocalStorageManager.getData("firstName"),
                      lastName: this._pocnLocalStorageManager.getData("lastName"),
                      userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                    }
                  console.log(attributes);
                  const eventName = 'connect settings email validate';
                  const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'email validated successfully' }
                  this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                      this.telemetry.parentTrace = result;
                  })
             this.sendEmailToken(f);
          } else {
            if(response.data.validateWorkEmail.updateConnectionResponse.status === 'error' && response.data.validateWorkEmail.updateConnectionResponse.error === 'This email id already exists'){
              this.showEmailAlertPopOver();
            }
          }
        });

    } else {
        this.showEmailError = false;
    }
  } else {
     this.showEmailError = false;
    }
}
//email token
sendEmailToken(f:NgForm){
  let workEmailId: any;
  workEmailId = {
    accessToken: this.token,
    emailId: this.updateEmailId,
    channel: this.userAgent,
    ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
    device: this.deviceType,
    geoLocation:'',
  }
  this._pocnService.resendVerificationCode(workEmailId).subscribe(
    (response: ResendVerificationCodeResponse) => {
      if (response.data.resendVerificationCode.updateConnectionResponse.status === 'success') {
      const spanName = "connect-settings-email-token-btn";
        let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
        }
      console.log(attributes);
      const eventName = 'connect settings email token';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'email token sent successfully' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
        this.showVerifyEmail = true;
        this.showDisableEmail = true;
        this.showEmailButton = false;
      }else{
        this.email = '';
        this.showVerifyEmail = false;
        this.showDisableEmail = false;
      }
   });
}
//email verification code
verifyEmailToken(f:NgForm){
  console.log(f.value['emailCode'])
  if(f.value['emailCode']){
    if(f.value['emailCode'].length > 6 || f.value['emailCode'].length < 6){
      this.resendErrMsg = false;
    }
    if(f.value['emailCode'] != '' && f.value['emailCode'].length == 6){
      this.resendErrMsg = true;
      let verifyEmailToken: any;
      verifyEmailToken = {
        accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
        emailToken: f.value['emailCode'],
        emailId:this.updateEmailId,
        channel: this.userAgent,
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        geoLocation:'',
      }
      this._pocnService.updateCallerContactEmail(verifyEmailToken).subscribe(
        (response: any) => {
          if (response.data.updateCallerContactEmail.updateConnectionResponse.status === 'success') {
            this.showEmailEditButton =false;
            this.showDisableEmail = true;
            this.showEmailButton = false;
            this.showVerifyEmail = false;
            const spanName = "connect-settings-email-token-btn";
        let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
        }
      console.log(attributes);
      const eventName = 'connect settings email token';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'email token verified successfully' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
          } else{
            if(response.data.updateCallerContactEmail.updateConnectionResponse.message === 'Invalid token'){
              this.resendErrMsg = false;
           }
          }
        });
    }
  } else {
  }
}
// email resend token
sendEmailResendToken(f:NgForm){
  this.disableResendBtn = true;
  this.emailCode = '';
  let resenCodeData: any;
  resenCodeData = {
    accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
    emailId:'',
    channel: this.userAgent,
    ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
    ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
    device: this.deviceType,
    geoLocation:'',
  }
  this._pocnService.resendVerificationCode(resenCodeData).subscribe(
    (response: ResendVerificationCodeResponse) => {
      if (response.data.resendVerificationCode.updateConnectionResponse.status === 'success') {
        this.disableResendBtn = false;
        this.successEmailResendMsg = true;
        setTimeout(
          function () {
            this.successEmailResendMsg = false;
          }.bind(this),
          3000,
        )
        const spanName = "connect-settings-email-resend-btn";
        let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
        }
      console.log(attributes);
      const eventName = 'connect settings email resend';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'email token sent successfully' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
      }
    });
}
async showEmailAlertPopOver() {
  const popover = await this.modalController.create({
    component: EmailConnectAlertPopoverPage,
    cssClass: 'emailalert-modal',
  });
  popover.onDidDismiss().then((modalDataResponse) => {
  });
  await popover.present();
}
prevNavigation(){
  this.getUserContactDetail();
}
}
