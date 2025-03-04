import { Component, ElementRef, OnInit , ViewChild} from '@angular/core';
import { AlertController, IonInput, ModalController } from '@ionic/angular';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { CookieManager } from "./../../services/cookie-manager";
import { NgForm } from '@angular/forms';
import { Router,NavigationEnd } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { PatientConnectResponse,PatientConnectBaaResponse, SubmitEmailConfirmResponse, SubmitEmailVerificationResponse, SubmitHcpVerificationConsentResponse, SubmitHcpElectronicVerificationResponse,SubmitUploadHcpResponse, SubmitPhoneLinkingResponse, AddCallerProfileResponse,UpdatePatientConnectStatusResponse,ResendVerificationCodeResponse,ValidatePhoneNumberResponse, SubmitCallerResponse, SubmitUploadHcpTestResponse } from './../../services/type';
import { TokenManager } from "./../../services/token-manager";
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { SignaturePad } from 'angular2-signaturepad';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { IonSlides } from '@ionic/angular';
import { docDefinition } from './../../services/baa-sign-content'
import { OverlayPopoverPage } from "../overlay-popover/overlay-popover.page";
import { EmailConnectAlertPopoverPage } from "../email-connect-alert-popover/email-connect-alert-popover.page";
import { IonContent } from '@ionic/angular';
import { PhoneConnectAlertPopoverPage } from "../phone-connect-alert-popover/phone-connect-alert-popover.page";
import { Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
// import { Geolocation } from '@capacitor/geolocation';
import { CreateRoomResponse } from './../../services/type';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Filesystem } from '@capacitor/filesystem';
import { DomSanitizer } from '@angular/platform-browser';
import { PhotoPlugin } from 'src/plugins/imagePicker';
//import * as JSZip from 'jszip';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-connect',
  templateUrl: './connect.page.html',
  styleUrls: ['./connect.page.scss'],
})
export class ConnectPage implements OnInit {
  appPlatform: string = Capacitor.getPlatform();
  public token: string;
  public userId: string;
  public providerHcpNpi: string;
  public providerId: string;
  public userProfileName: string;
  public hcpVerifiedStatus: string;
  public showCodeErr: boolean = false;
  public codeCountry: any;
  public slideOpts: Object = {
    // initialSlide: 0,
    // pagination: {
    //   el: ".swiper-pagination",
    //   type: "bullets",
    //   clickable: true
    // },
    slidesPerView: 1,
    spaceBetween: 1,
    static: true,
    centeredSlides: true,
    allowTouchMove: false,
   //autoHeight: true
  }
  twilioServerURL = environment.twilioServerURL;
  //settings
  overLayCss = '';
  showEditPhoneErr: boolean = false;
  showEditCountryError: boolean = true;
  showEditNumber: boolean = true;
  showEditNameErr: boolean = false;
  ShowEditErrMsgPhone: boolean = true;
  showAddNumber: boolean = true;
  showAddCountryError: boolean = true;
  connectNameWhiteSpaceCheck: boolean = false;
  otpRequiredErr: boolean = false;
  verifyHistoryMessage: boolean = true;
  tokenRequiredErr: boolean = true;
  tokenHistoryResendErr: boolean = true;
  editNameWhiteSpaceCheck: boolean = false;
  showRemove: boolean = false;
  callVerifyErr: boolean = true;
  callerVerifyErr: boolean = true;
  callerEditVerifyErr: boolean = true;
  //signpad
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild("emailConnectInput") emailConnectInput ;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('manualInputSelector') manualInputSelector: ElementRef;
  @ViewChild('workNumInput', {static: false}) workNumInputData: IonInput;

  public sign: string;
  showError:boolean = true ;
  signaturePadOptions: Object = {
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300,
    'Boarder':1,
  };
  userAgent: string;
  //connect
  public email: any;
  public mobilePhoneNumber: string;
  public workNumber: string;
  public addCountryCode: string;
  public userName: string;
  public emailCode: string;
  showEmailError:boolean = true ;
  verifyEmailErr: string;
  disableEmail: boolean = false;
  showVerifyEmail: boolean = false;
  hideErrorMsg: boolean;
  resendErrMsg: boolean = true;
  pageLoaderStatus = true;
  hcpStatus: boolean = false;
  consentErrMSg: boolean = true;
  showIdSelect: boolean = true;
  showIdproofUpload: boolean = false;
  selectWrapper;
  selectOptions;
  connectDataId: '';
  connectId: any;
  proofType: string;
  showUpload: boolean = true;
  idfileErrorStatus:boolean = false;
  myIdproofName = "";
  resumeFileType = [ "application/pdf", "image/jpeg", "image/jpg", "image/png"];
  uploadedFile = {};
  uploadImageFile = {};
  errorMsg = '';
  showButton: boolean = false;
  idSelectErrMsg: boolean = true;
  disableNumber: boolean = false;
  showVerifyNumber: boolean = false;
  showCallCountryError:boolean = true;
  showNumber: boolean = true;
  otpNumber: '';
  hideVerifyErrorMsg: any;
  verifyMessage:boolean = true;
  showWorkCountryError: boolean = true;
  showWorkNumber:boolean = true;
  callNameWhiteSpaceCheck: boolean = true;
  callErrName: boolean = true;
  ShowConnectErrPhone: boolean = true;
  activateCode = null;
  callerIds = [];
  hidePrevICon: boolean = false;
  setLoader: boolean = false;
  tabType = 'manual';
  showSlider: boolean = true;
  hideHcpButton: boolean = false;
  hideManual: boolean;
  showEmailVerified: boolean = true;
  showRename: boolean = true;
  fileSize: any;
  fileType: string;
  fileDate: string;
  public myUserDialerData: any[];
  public myUserConnectData: any;
  public hcpVerified : number;
  public baaSigned: number;
  public hcpConsentVerified: number;
  public phoneLinked: number;
  public emailVerified: number;
  public verificationType: string;
  public myUserEmail: string;
  public myUserPhone: string;
  file: any;
  date = new Date();
  hideImg: boolean = true;
  tabName;
  userIp = '';
  deviceType: string = '';
  geolocationPosition: string = '';
  userSelect = '';
  public userRoomData: string;
  hideElectronic : boolean = true;
  verifyExpireMessage : boolean = true;
  hideUploadButton: boolean = false;
  userFirstName;
  userLastName;
  public rejectReason: string;
  setSignUpConnectLoader: boolean = false;
  successEmailResendMsg: boolean = false;
  successPhoneResendMsg: boolean = false;
  disableResendBtn:boolean =  false;
  baaSuccessStatus:boolean =  false;
  emailSuccessStatus:boolean =  false;
  hcpSuccessStatus:boolean =  false;
  phoneSuccessStatus:boolean =  false;
  public countryCodeArray;
  privacyLink;
  constructor(public modalController: ModalController,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,
    private router: Router,
    private tokenManager: TokenManager,
    private http: HttpClient,
    private alertController: AlertController,
    public loadingController: LoadingController,
    private location:Location,
    private deviceService: DeviceDetectorService,
    public telemetry: TelemetryService,
    public loading: LoadingService,
    public domSanitizer: DomSanitizer,

    )
    {
     // this.tabName = this.location.getState();
      this._pocnService.getIpAddress();
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      this.userFirstName = this._pocnLocalStorageManager.getData("firstName");
      this.userLastName = this._pocnLocalStorageManager.getData("lastName");
      this.privacyLink = "https://www.pocn.com/privacy-policy/";
      router.events.subscribe(event => {
        if(event instanceof NavigationEnd) {
        this.tabName = this.location.getState();
      }
    })
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
   if(this.tabType == 'electronic'){
    this.hideHcpButton = true;
   }
   this.showLoading();
    if (this.token == "" || this.token == null) {
      this.router.navigate(["/"]);
    }
    ///this.startupClient();
    this.masterDocumentTypes();
    this.getUserProfile();
    this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();
    this.getUserContactDetail();
    this.getPatientContact();
    this.getTelephoneCountryCode();
    this.getDialerCaller();
    this.tokenManager.setRefreshTokenIntrvl();
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
  async showLoading() {
    this.setLoader = true;
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 3000,
      spinner: 'circles',
    });

    loading.present();
  }
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
// clear sign
onClear() {
  this.signaturePad.clear()
}
selectSearch(){
  setTimeout(() => {
  var el = document.getElementById('i_s_searchInput');
    if (el != null) {
    } else {
      this.onSelectClick();
    }
  }, 500);
}
onSelectClick() {
  setTimeout(() => { this.initDirective(); }, 800);
}
initDirective() {
  this.selectWrapper = document.getElementsByClassName('alert-wrapper')[0];
  let selectBody = document.getElementsByClassName('alert-radio-group')[0];
  let inputElement = this.createInputElement();
  this.selectWrapper.insertBefore(inputElement, selectBody);
}
createInputElement() {
  let input = document.createElement('Input');
  input.setAttribute('placeholder', 'Type to search');
  input.id = "i_s_searchInput";
  input.style.padding = "0.5em 1em";
  input.style.border = "unset";
  input.onkeyup = this.onSearchChanged;
  return input;
}
getSelectOptions() {
  this.selectOptions = document.getElementsByClassName('select-interface-option');
}
onSearchChanged() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('i_s_searchInput');
  filter = input.value.toUpperCase();
  this.selectOptions = document.getElementsByClassName('select-interface-option');
  for (i = 0; i < this.selectOptions.length; i++) {
      txtValue = this.selectOptions.item(i).querySelector('.alert-button-inner').querySelector('.alert-radio-label').innerHTML;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          this.selectOptions.item(i).style.display = "";
      }
      else {
          this.selectOptions.item(i).style.display = "none";
      }
  }
}

getPatientContact() {
  this._pocnService.getPatientContact(this.token)?.subscribe(({ data }) => {
    if(data['getPatientContact']['data'] != null){
      if(data['getPatientContact']['data'].email != ''){
        this.email = data['getPatientContact']['data'].email;
      }
      if(data['getPatientContact']['data'].phone){
        this.mobilePhoneNumber = data['getPatientContact']['data'].phone.replace('+', '');
        this.workNumber = data['getPatientContact']['data'].phone.replace('+', '');
      }
    }
  })
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
        this.mobilePhoneNumber =data['getPatientContactConfirmed']['data'].phone.replace('+', '');
        this.workNumber =data['getPatientContactConfirmed']['data'].phone.replace('+', '');
      }
    }
  })
}
masterDocumentTypes = () => {
  this._pocnService.masterDocumentTypes().subscribe(({ data }) => {
    this.connectId = data.masterDocumentTypes.nodes;
  });
}
getUserProfile() {
  this._pocnService.getUserBasicProfile(this.token)?.subscribe(({ data }) => {
  this.userId = data['getUserBasicProfile'].data['userBasicProfile']['userId'];
  this.providerHcpNpi= data['getUserBasicProfile'].data['userBasicProfile']['npi'];
  this.userProfileName = data['getUserBasicProfile'].data['userBasicProfile']['name'];
  this.providerId = data['getUserBasicProfile'].data['userBasicProfile']['providerId'];
  this.patientConnectStatusCalls(this.userId.toUpperCase( ));
  },
    (error) => {
        this.router.navigate(['/'])
    });
}
getDialerCaller() {
  this._pocnService.getDialerCaller(this.token)?.subscribe(({ data }) => {
    this.myUserDialerData = data['getDialerCaller'].data;
    console.log("myUserDialerData",this.myUserDialerData)
  })
}
patientConnectStatusCalls(userId:String){
  this._pocnService.patientConnectStatusCalls(userId).subscribe(({ data }) => {
    if(data.patientConnectStatusCalls.nodes != ''){
      let setSuccess ;
      setSuccess = data.patientConnectStatusCalls.nodes[0];
      this.baaSigned = setSuccess.baaSigned;
      this.hcpConsentVerified = setSuccess.hcpConsentVerified;
      this.hcpVerified = setSuccess.hcpVerified;
      this.phoneLinked = setSuccess.phoneLinked;
      this.emailVerified = setSuccess.emailVerified;
      this.myUserConnectData  = setSuccess.patientConnectRegistrationStatus;
      this.hcpVerifiedStatus = setSuccess.hcpVerifiedStatus;
      this.verificationType = setSuccess.verificationType;
      this.rejectReason = setSuccess.rejectReason;
      if(this.hcpVerifiedStatus == "In progress"){
       this.hideUploadButton =true;
      // this.slides.slideTo(11, 50);
      }
      else{
        this.hideUploadButton = false;
      }
      if(setSuccess.patientConnectRegistrationStatus == 1){
        this.setLoader = false;
       this.router.navigate(['/dialer'])
      }
      else if(this.hcpVerifiedStatus == "Approved"){
        this.slides.slideTo(11, 50);
      } else if(this.hcpVerifiedStatus == "Denied"){
        this.setLoader = false;
      }
      else if(this.hcpVerifiedStatus == "In progress"){
        this.setLoader = false;
        this.slides.slideTo(9, 50);
      }else{
          // if(setSuccess.hcpVerified == 0 && setSuccess.phoneLinked == 1 && this.myUserDialerData.length > 0 ){
          //   this.setLoader = false;
          //   this.router.navigate(['/dialer'])
          //   this.presentLoading();
          // } else{
              this.setLoader = false;
         // }
      }
    }
  })
}
//condition for common navigation
//start steps
  stepNavigation() {
    console.log("stepNavigation",this.myUserDialerData.length)
  this.hidePrevICon= true;
    let slide = 0;
    this._pocnService.patientConnectStatusCalls(this._pocnLocalStorageManager.getData("userId").toUpperCase()).subscribe(({ data }) => {
      let patientStatus = data.patientConnectStatusCalls.nodes[0];
      this.rejectReason = patientStatus.rejectReason;
        if(patientStatus.baaSigned !== 1){
          slide = 1;
        } else if(patientStatus.emailVerified !== 1){
          slide = 4;
        } else if(patientStatus.hcpConsentVerified !== 1){
          slide = 6;
        } else if(patientStatus.hcpVerified == 0  && patientStatus.hcpVerifiedStatus == 'In progress'){
          slide = 8;
        } else if(patientStatus.hcpVerified !== 1  && patientStatus.hcpVerifiedStatus == ''){
          slide = 6;
        } else if(patientStatus.hcpVerifiedStatus == "Denied" || patientStatus.hcpVerifiedStatus == "Need More Info" || patientStatus.hcpVerifiedStatus == "Cancelled" ){
          slide=15
        }  //patientStatus.setLoader = false;  }
        else if(patientStatus.phoneLinked !== 1){
          slide = 11;
        }else if(this.myUserDialerData.length == 0){
          slide = 13;
      }
       this.setLoader = false;
       this.slides.slideTo(slide, 50);
    })
  // this.patientConnectStatusCalls(this._pocnLocalStorageManager.getData("userId").toUpperCase());
  // if(this.baaSigned !== 1){
  //   slide = 1;
  // } else if(this.emailVerified !== 1){
  //   slide = 4;
  // } else if(this.hcpConsentVerified !== 1){
  //   slide = 6;
  // } else if(this.hcpVerified == 0  && this.hcpVerifiedStatus == 'In progress'){
  //   slide = 8;
  // } else if(this.hcpVerified !== 1  && this.hcpVerifiedStatus == ''){
  //   slide = 6;
  // } else if(this.hcpVerifiedStatus == "Denied" || this.hcpVerifiedStatus == "Need More Info" || this.hcpVerifiedStatus == "Cancelled" ){
  //   slide=14
  // }  //this.setLoader = false;  }
  //  else if(this.phoneLinked !== 1){
  //   slide = 10;
  // }else if(this.myUserDialerData.length == 0){
  //   slide = 12;
  // }
  // this.setLoader = false;
  // this.slides.slideTo(slide, 50);
}
//save sign
saveSignBaa(f:NgForm) {
  this.hidePrevICon= true;
  this.sign = this.signaturePad.toDataURL();
    if(this.signaturePad.isEmpty()){
      this.showError = false;
    }
    else{
      this.showError = true;
      this.submitBaaSign(this.sign);
    }
}
//sign pdf
submitBaaSign(sign) {
  this.setSignUpConnectLoader= true;
  docDefinition.content[63].image=sign;
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getBase64((data) => {
  let pdfData = data;
  if(pdfData !== null && pdfData !== 0) {
    let startBaa: any;
    startBaa = {
      accessToken: this.token,
      baaStarted: false,
      channel: this.device.userAgent,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      geoLocation:'',
      signatureContent: pdfData
    }
    if(pdfData != ''){
      this._pocnService.submitBaaSign(startBaa).subscribe(
        (response: PatientConnectResponse) => {
          if (response.data.submitBaaSign.updateConnectionResponse.status === 'success') {
            this.content.scrollToTop(2500);
            this.baaSigned = 1;
            this.slides.slideTo(3, 500);
            this.baaSuccessStatus = true;
            setTimeout(
              function () {
                this.baaSuccessStatus = false;
              }.bind(this),
              3000,
            )
            const spanName = "connect-sign-btn";
            let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail")
            }
            const eventName = 'connect sign baa';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully signed' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
            this.setSignUpConnectLoader= false;
            this._pocnService.sendBaaEmail(startBaa).subscribe(
              (response: PatientConnectBaaResponse) => {
                if (response.data.sendBaaEmail.updateConnectionResponse.status === 'success') {
                }
            });
          } else if (response.data.submitBaaSign.updateConnectionResponse.status === 'error' && response.data.submitBaaSign.updateConnectionResponse.error === 'Already Signed') {
            if(this.loading.isLoading){
              this.setSignUpConnectLoader= false;
            }
            this.slides.slideTo(3, 500);
            this.baaSigned = 1;
          } else{
            if(this.loading.isLoading){
              this.setSignUpConnectLoader= false;
            }
            this.slides.slidePrev();
          }
        },
        (error) => {
          if(this.token == ''){
            this.router.navigate(['/']);
          } else{
            this.router.navigate(['/connect']);
          }
        });
    }
  }
 });
}
//for email
sendVerifyEmail(f:NgForm){
  this.successEmailResendMsg = false;
  this.hidePrevICon= true;
  if(f.value['email']){
    let regex = /^[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*@((?!gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|aol\.com|zoho\.com|protonmail\.com|mail\.com|gmx\.com)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z](?:[a-z-]*[a-z])?$/i;
    let lowVal = f.value['email'].toLowerCase();
    let searchfind = regex.test(lowVal);
    if(f.value['email'] != '' && searchfind === true){
      this.setSignUpConnectLoader= true;
      this.emailCode ="";
      this.showEmailError = true;
      let workEmailId: any;
      workEmailId = {
        accessToken: this.token,
        workEmailId: f.value['email'].toLowerCase(),
        channel: this.device.userAgent,
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        geoLocation:''
      }
      this._pocnService.submitEmailConfirm(workEmailId).subscribe(
        (response: SubmitEmailConfirmResponse) => {
          if (response.data.submitEmailConfirm.updateConnectionResponse.status === 'success') {
              this.slides.slideTo(4, 500);
              this.showVerifyEmail = true;
              this.disableEmail = true;
              const spanName = "connect-email-verify-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'connect email verify';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully verified email' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.setSignUpConnectLoader= false;
          } else if(response.data.submitEmailConfirm.updateConnectionResponse.error === 'Email already exists' && response.data.submitEmailConfirm.updateConnectionResponse.status === 'error'){
            this.setSignUpConnectLoader= false;
            this.showEmailAlertPopOver();
              this.slides.slideTo(4, 500);
          } else {
            this.setSignUpConnectLoader= false;
              this.slides.slideTo(4, 500);
              this.email = '';
              this.showVerifyEmail = false;
              this.disableEmail = false;
          }
      });
    } else {
      this.setSignUpConnectLoader= false;
        this.showEmailError = false;
        this.slides.slideTo(4, 500);
    }
  } else {
    this.setSignUpConnectLoader= false;
      this.slides.slideTo(4, 500);
    }
}
//email verification code
verifyEmailToken(f:NgForm){
  if(f.value['emailCode']){
    if(f.value['emailCode'].length > 6 || f.value['emailCode'].length < 6){
      this.resendErrMsg = false;
    }
    if(f.value['emailCode'] != '' && f.value['emailCode'].length == 6){
      this.setSignUpConnectLoader= true;
      this.resendErrMsg = true;
      let verifyEmailToken: any;
      verifyEmailToken = {
        accessToken: this.token,
        channel: this.device.userAgent,
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        geoLocation:'',
        emailToken: f.value['emailCode'],
      }
      this._pocnService.submitEmailVerification(verifyEmailToken).subscribe(
        (response: SubmitEmailVerificationResponse) => {
          if (response.data.submitEmailVerification.updateConnectionResponse.status === 'success') {
              this.emailVerified = 1;
              this.slides.slideNext();
              this.emailSuccessStatus = true;
              setTimeout(
                function () {
                  this.emailSuccessStatus = false;
                }.bind(this),
                3000,
              )
              const spanName = "connect-email-verify-token-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'connect email verify token';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully verified token' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.setSignUpConnectLoader= false;
          } else if(response.data.submitEmailVerification.updateConnectionResponse.status === 'error' && response.data.submitEmailVerification.updateConnectionResponse.message === 'Invalid token'){
            this.setSignUpConnectLoader= false;
            this.resendErrMsg = false;
            this.slides.slideTo(4, 500);
          } else {
            this.setSignUpConnectLoader= false;
            this.emailCode = '';
            this.slides.slideTo(4, 500);
          }
        });
    }
  } else {
    this.setSignUpConnectLoader= false;
    this.slides.slideTo(4, 500);
  }
}
// email resend token
sendEmailResendToken(f:NgForm){
 // this.setSignUpConnectLoader= true;
 this.disableResendBtn = true;

  this.emailCode = '';
  let resenCodeData: any;
  resenCodeData = {
    accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
    emailId:'',
    channel: this.device.userAgent,
    ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
    device: this.deviceType,
    geoLocation:''
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
        const spanName = "connect-email-resend-token-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'connect email resend token';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully sent token' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.setSignUpConnectLoader= false;
      }
    });
}
//hcp agree consent
hcpAgreeConsent(){
  this.hidePrevICon= true;
  //hcp consent
  if(this.hcpStatus === true){
    this.slides.slideNext();
    // let verifyHcp;
    // verifyHcp = {
    //   accessToken: this.token,
    //   channel: this.userAgent,
    //   ipAddress: this.userIp,
    //   device: this.deviceType,
    //   geoLocation:this.geolocationPosition
    // }
    // this._pocnService.submitHcpVerificationConsent(verifyHcp).subscribe(
    //   (response: SubmitHcpVerificationConsentResponse) => {
    //     if (response.data.submitHcpVerificationConsent.updateConnectionResponse.status === 'success') {
    //       this.hcpConsentVerified = 1;
    //       this.slides.slideNext();
    //     } else if(response.data.submitHcpVerificationConsent.updateConnectionResponse.error === 'HCP Consent Already Approved'){
    //       this.slides.slideNext();
    //     } else {
    //       this.slides.slideTo(6, 500);
    //     }
    //   });
  } else {
   this.consentErrMSg = false;
    this.slides.slideTo(6, 500);
  }
}
//consent verification status
approveConsentVerification(){
  let verifyHcp;
    verifyHcp = {
      accessToken: this.token,
      channel: this.device.userAgent,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      geoLocation:''
    }
    this._pocnService.submitHcpVerificationConsent(verifyHcp).subscribe(
      (response: SubmitHcpVerificationConsentResponse) => {
        if(response.data.submitHcpVerificationConsent.updateConnectionResponse.status === 'success') {
          const spanName = "connect-hcp-consent-verify-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'connect hcp verification';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully verified' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
          this.hcpConsentVerified = 1;
          if(this.hcpVerifiedStatus == "In progress"){
           this.hideManual = false;
            this.slides.slideTo(8, 500);
            this.hideUploadButton =true;
          }else if(this.hcpVerifiedStatus == "Verified"){
            this.hideElectronic = false;
          } else{
            this.hideUploadButton = false;
          }
           this.hcpSuccessStatus = true;
           setTimeout(
            function () {
              this.hcpSuccessStatus = false;
            }.bind(this),
            3000,
          )
        }  else {
          this.slides.slideTo(6, 500);
        }
      });
}
//verify electronic
verifyElectronic(){
  this.hideHcpButton = true;
  this.hidePrevICon= true;
  this.hideManual = true;
  this.showIdSelect = false;
  let verifyElectronicHcp: any;
  verifyElectronicHcp = {
    accessToken: this.token,
    channel: this.device.userAgent,
    ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
    device: this.deviceType,
    geoLocation:''
  }
  this.setSignUpConnectLoader= true;
  this._pocnService.submitHcpElectronicVerification(verifyElectronicHcp).subscribe(
    (response: SubmitHcpElectronicVerificationResponse) => {
      if (response.data.submitHcpElectronicVerification.updateConnectionResponse.status === 'success') {
        const spanName = "connect-electronic-verify-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'connect electronic verification';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully verified' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.setSignUpConnectLoader= false;
        this.hcpVerifiedStatus = "Verified";
        this.hcpVerified = 1;
        this.approveConsentVerification();
        this.hideElectronic = false;
        this.slides.slideTo(8, 500);
      } else{
        this.setSignUpConnectLoader= false;
        this.slides.slideTo(7, 500);
      }
    });
}

//verify Manual
verifyManual(){
  this.hideHcpButton = false;
  this.hidePrevICon= true;
  this.showIdSelect = true;
}
/*--- Id Proof Upload S --- */
triggerEvent(event) {
  this.proofType = event.value.id;
//  this.proofType = event.target.value;
  this.showUpload =false;
  this.showButton = true;
  this.idSelectErrMsg = true;
  this.showIdproofUpload = true;
  this.showUpload = true;
}
//file upload
async selectFile(){
 let permissions: any;
 let listPermission: any ;
 let image: any ;
    switch (this.appPlatform ) {
      case 'web':
        this.manualInputSelector.nativeElement.click()
        break;
      case 'android':
        try {
          permissions = await Camera.requestPermissions();
        } catch (error) {
          console.log(error)
        }
        listPermission = await Camera.checkPermissions()
        if ( listPermission.camera === 'granted' || listPermission.photos === 'granted'  ) {
          let isCamera: boolean = listPermission.camera === 'granted'
          let isPhotos: boolean = listPermission.photos === 'granted'
        try{
          image = await Camera.getPhoto({
            quality: 50,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            saveToGallery: true,
            correctOrientation: false,
            source : isCamera && isPhotos ? CameraSource.Prompt : (isCamera && CameraSource.Camera || isPhotos && CameraSource.Photos)
          });
          console.log("image stored")
        } catch (error) {
          console.log(error)
        }
          if (image?.path) {
            console.log("have base64", image)
            let base64: any ;
            let idImageName: string ;
            let imgSrc: any;
            idImageName = image?.path.split('/').pop()
            imgSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(image.webPath);
            try {
              base64 = await Filesystem.readFile({
                path: image?.path
              })
            } catch (error) {
              console.log(error)
              if(this.loading.isLoading) this.loading.dismiss()
            }
            const fileExtension = image.format
            this.getVerificationFileContentFromCamera(base64?.data, fileExtension, idImageName, imgSrc)
          } else {
            console.log("error", image)
          }
        }else{
          this.presentAlert()
        }
        break;
      case 'ios':
        try {
          permissions = await Camera.requestPermissions();
        } catch (error) {
          console.log(error)
        }
        listPermission = await Camera.checkPermissions()
        if ( permissions.photos === 'granted') {
          try {
            image = await Camera.getPhoto({
              quality: 80,
              allowEditing: false,
              resultType: CameraResultType.Base64,
              saveToGallery: true,
              correctOrientation: true,
              source: CameraSource.Photos
            });
          } catch (error) {
            console.log(error)
          }
          if (image) {
            const fileExtension = "jpeg"
            let fileName = new Date().toLocaleString()
            const idImageName = `${fileName.replace(' ', '')}.${fileExtension}`;
            const imgSrc = image.base64String
            this.getVerificationFileContentFromCamera(image.base64String, fileExtension, idImageName, imgSrc)
          }
        }
        else if(permissions.photos === 'limited'){
          try {
            image = await PhotoPlugin.getPhoto({ message: 'SINGLE' });
            if (image) {
              const fileExtension = "jpeg"
              let fileName = new Date().toLocaleString()
              const idImageName = `${fileName.replace(' ', '')}.${fileExtension}`;
              const imgSrc = image.dataImage
              this.getVerificationFileContentFromCamera(image.dataImage, fileExtension, idImageName, imgSrc)
            }
          } catch (error) {
            console.log(error);
            return;
          }
        }else {
          this.presentAlert()
        }
        break;
    }
}

async presentAlert() {
  let alert = await this.alertController.create({
    header: 'Permission Denied',
    message: 'If you would like to add an image, please provide POCN access in your settings.',
    buttons: ['Cancel', {
      text: 'Go to Settings',
      handler: () => {
        if(this.appPlatform === 'ios'){
          NativeSettings.openIOS({
            option: IOSSettings.App,
          });
        }else if(this.appPlatform === 'android'){
          NativeSettings.openAndroid({
            option: AndroidSettings.ApplicationDetails,
          });
        }
      }
      }]
  });
  await alert.present();
}

getVerificationFileContentFromCamera(base64: any, fileExtension: string, idImageName: string, imgSrc: any){
  const image = `data:image/${fileExtension};base64,${base64}`
  this.showButton = false;
  this.showUpload = true;
  this.idfileErrorStatus  = false;
  this.myIdproofName = idImageName;
  const buffer = image.substring(image.indexOf(',') + 1);
  const size = Math.ceil(((buffer.length * 6) / 8)/ 1000 );
  this.fileSize = size  + " KB";
  this.fileType = fileExtension;
  this.fileDate= '';
  if(this.resumeFileType.includes(`image/${this.fileType}`)){
    if((size/1000000) <= 5){
        this.showRename = false;
        if(this.fileType == 'jpg' || this.fileType == 'jpeg' || this.fileType == 'png'){
          this.uploadImageFile  = image;
          this.hideImg = false;
        }
        else{
          this.hideImg = true;
        }
        this.uploadedFile  = image;
    } else {
      this.idfileErrorStatus = true;
      this.errorMsg = "Upload failed. Maximum file upload size is restricted to 5 MB.";
      this.showUpload = true;
    }
  } else {
    this.idfileErrorStatus = true;
    this.errorMsg = "Upload failed. Please select a valid file format (pdf, Jpg, png, jpeg).";
    this.showUpload =true;
  }
  if(this.idfileErrorStatus == true){
    this.showButton = true;
  } else {
    this.showButton = false;
  }
}

getVerificationFileContent(event){
  this.showButton = false;
  this.showUpload =true;
  this.idfileErrorStatus  = false;
  this.file  = (event.target as HTMLInputElement).files[0];
  this.myIdproofName = this.file.name;
  this.fileSize = Math.round(this.file.size / 1024) + " KB";
  this.fileType= this.file.type.split("/").pop();
  this.fileDate= '';
  if(this.resumeFileType.includes(this.file.type)){

    // const fileInput = this.file;

    // fileInput.addEventListener('change', (event) => {

    //   // Create a new instance of JSZip
    //   const zip = new JSZip();

    //   // Add the file to the zip
    //   zip.file(this.file.name, this.file);

    //   // Generate the compressed file
    //   zip.generateAsync({ type: 'blob' }).then((compressedFile: Blob) => {
    //     // Create a new instance of FileReader
    //     const reader = new FileReader();

    //     // Add an event listener to the reader's onload event
    //     reader.onload = (event: any) => {
    //       const base64String = event.target.result;
    //       // Do something with the base64 string, e.g. send it to a server
    //     };

    //     // Read the compressed file as a base64 encoded string
    //     reader.readAsDataURL(compressedFile);
    //     console.log(reader)
    //     console.log(compressedFile)

    //   });
    // });

    if((this.file.size/1000000) <= 5){
      this.convertToBase64(event.target.files[0]).subscribe(base64 => {
        this.showRename = false;
        if(this.fileType == 'jpg' || this.fileType == 'jpeg' || this.fileType == 'png'){
          this.uploadImageFile  = base64;
          this.hideImg = false;
        }
        else{
          this.hideImg = true;
        }
        this.uploadedFile  = base64;
      });
    } else {
      this.idfileErrorStatus = true;
      this.errorMsg = "Upload failed. Maximum file upload size is restricted to 5 MB.";
      this.showUpload =true;
    }
  } else {
    this.idfileErrorStatus = true;
    this.errorMsg = "Upload failed. Please select a valid file format (pdf, Jpg, png, jpeg).";
    this.showUpload =true;
  }
  if(this.idfileErrorStatus == true){
    this.showButton = true;
  } else {
    this.showButton = false;
  }
}
convertToBase64(file : File) : Observable<string> {
  const result  = new ReplaySubject<any>(1);
  let reader  = new FileReader();
  const realFileReader = (reader as any)._realReader;
  if (realFileReader) {
    reader = realFileReader;
  }
  reader.readAsDataURL(file);
  reader.onloadend =  function() {
  result.next(reader.result);
  };
  return result;
}
manualUploadVerification(f){
  // if(this.connectDataId.idData && this.myIdproofName!= ''){
    if(this.proofType && this.myIdproofName!= '' && this.showButton == false){
    this.setSignUpConnectLoader= true;
    this.idSelectErrMsg = true;
    let verifyManualHcp: any;
    let proofId : string;
    proofId = this.proofType ;
     verifyManualHcp = {
         accessToken: this.token,
         fileContent: this.uploadedFile,
         fileName: this.myIdproofName,
         fileType:this.fileType,
         fileSize:this.fileSize,
         type: String(proofId),
         channel: this.device.userAgent,
         ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
          ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
         device: this.deviceType,
         geoLocation:''
       }
       this._pocnService.submitUploadHcp(verifyManualHcp).subscribe(
         (response: SubmitUploadHcpResponse) => {
           if(response.data.submitUploadHcp.updateConnectionResponse.status === 'success') {
            const spanName = "connect-submit-hcp-upload-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'connect submit hcp upload';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully uploaded' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.setSignUpConnectLoader= false;
            this.content.scrollToTop(2500);
            this.hcpVerified = 0;
            this.hcpVerifiedStatus = "In progress";
            this.approveConsentVerification();
            // this.hcpVerifiedStatus = "Verified";
            // this.hcpVerified = 1;
            // this.slides.slideTo(8, 500);
            if(this.hcpVerifiedStatus == "In progress"){
              this.hideUploadButton =true;
            }
            this._pocnService.sendManualUploadVerificationEmail(verifyManualHcp).subscribe(
              (response: SubmitUploadHcpTestResponse) => {
                if(response.data.sendManualUploadVerificationEmail.updateConnectionResponse.status === 'success') {
                }
              });
           } else if(response.data.submitUploadHcp.updateConnectionResponse.status === 'error' && (response.data.submitUploadHcp.updateConnectionResponse.error === 'Document Already uploaded' || response.data.submitUploadHcp.updateConnectionResponse.error === 'HCP Already Verified')) {
            this.setSignUpConnectLoader= false;
            this.approveConsentVerification();
            this.slides.slideTo(8, 500);
           } else {
            this.setSignUpConnectLoader= false;
            this.slides.slideTo(7, 500);
         }
         }
       );
  } else {
    this.setSignUpConnectLoader= false;
    this.showUpload = false;
    this.slides.slideTo(7, 500);
    this.idSelectErrMsg = false;
  }
}
/*--- Id Proof Upload End --- */
//register phone number
clickVerifyNumber(f:NgForm){
  this.successPhoneResendMsg = false;
  this.hidePrevICon= true;
    if((f.value['mobilePhoneNumber'] != null) ||(f.value['mobilePhoneNumber'] != undefined)){
      let mobilePhoneNumber = f.value['mobilePhoneNumber'].replace('+', '');
      //['91', '1'] country code validation
      let countryCodes= this.countryCodeArray ;
      let phone=mobilePhoneNumber;
      let  validNumber = countryCodes.some(elem => phone.match('^' + elem));
      if(!isNaN(f.value['mobilePhoneNumber'])){
        if(f.value['mobilePhoneNumber'].length < 10){
          this.showNumber=true;
          this.showCallCountryError = false;
        } else if(f.value['mobilePhoneNumber'].length > 10 && validNumber == false){
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
      this.setSignUpConnectLoader= true;
      this.showCallCountryError = true;
      let countryCodes = this.countryCodeArray;
      let phone= f.value['mobilePhoneNumber'].replace('+', '');
      let  validNumber = countryCodes.some(elem => phone.match('^' + elem));
      let mobilePhoneNumber;
      let startsWithCountryCode = countryCodes.some(code => phone.startsWith(code));
      if (startsWithCountryCode) {
        this.showCallCountryError = false;
        this.setSignUpConnectLoader= false;
        console.error('Please do not include country codes.');
        return;
      } else {
        this.showCallCountryError = true;
        mobilePhoneNumber = countryCodes[1] + phone;
        // Proceed with the rest of your logic using mobilePhoneNumber
        // Add any further logic here
      }
      // if(validNumber == true){
      //   mobilePhoneNumber = phone;
      // }
      // else{
      //   mobilePhoneNumber = 
      // }
      console.log(mobilePhoneNumber,validNumber,countryCodes,"mobilePhoneNumbermobilePhoneNumber")
      let validatePhoneNumber: any;
      validatePhoneNumber = {
            accessToken: this.token,
            phoneNumber: mobilePhoneNumber,
          }
      this._pocnService.validatePhoneNumber(validatePhoneNumber).subscribe(
        (response: ValidatePhoneNumberResponse) => {
          if(response.data.validatePhoneNumber.updateConnectionResponse.status === 'success') {
            const spanName = "connect-phone-validate-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'connect phone validation';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully validated phone number' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.setSignUpConnectLoader= false;
             this.sendOtp(f);
          } else if(response.data.validatePhoneNumber.updateConnectionResponse.status === 'error' && response.data.validatePhoneNumber.updateConnectionResponse.error === 'This phone number already exists'){
              this.numberAlertPopOver();
              this.otpNumber = '';
              this.disableNumber = false;
              this.showVerifyNumber = false;
              this.slides.slideTo(11, 500);
              this.setSignUpConnectLoader= false;
          } else {
              this.slides.slideTo(11, 500);
              this.showVerifyNumber = true;
              this.disableNumber = true;
              this.verifyMessage = true;
              this.setSignUpConnectLoader= false;
          }
        });
    } else {
      this.slides.slideTo(11, 500);
    }
  }
  // phone number resend code
sendNumberResendCode(f:NgForm){
  this.disableResendBtn = true;
  this.otpNumber = '';
  this.pageLoaderStatus = false;
  this.successPhoneResendMsg = true;
  setTimeout(
    function () {
      this.successPhoneResendMsg = false;
    }.bind(this),
    3000,
  )
  this.sendOtp(f);
}
//otp generation section
  async sendOtp(f:NgForm) {
    //call step4 verification
    if(this.mobilePhoneNumber){
      let countryCodes = this.countryCodeArray;
      let phone= this.mobilePhoneNumber.replace('+', '');
      let  validNumber = countryCodes.some(elem => phone.match('^' + elem));
      let mobilePhoneNumber;
      if(validNumber == true){
        phone = phone.replace(new RegExp(`^(${this.countryCodeArray.join('|')})`), '');
        mobilePhoneNumber = countryCodes[1] + phone;
      }
      else{
        mobilePhoneNumber = countryCodes[1] + phone;
      }
      const bodyData = { "phoneNumber": `${mobilePhoneNumber}`, "channel": 'sms' }
      this.http.post(`${this.twilioServerURL}/login`, bodyData).subscribe((data) => {
        if (data['status'] === 'pending'){
          this.slides.slideTo(11, 500);
          this.showVerifyNumber = true;
          this.disableNumber = true;
          this.disableResendBtn = false;
        } else {
          this.slides.slideTo(11, 500);
          this.showVerifyNumber = false;
          this.disableNumber = false;
          this.disableResendBtn = false;
        }
      })
    }
  }
  //verify otp
  clickVerifyOtp(f:NgForm){
    this.setSignUpConnectLoader= true;

    this.hidePrevICon= true;
      if(f.value['otpNumber'] != '' && f.value['otpNumber'] != undefined ){
        this.verifyOtp(f);
      } else {
        this.slides.slideTo(11, 500);
        this.showVerifyNumber = true;
        this.disableNumber = true;
      }
     this.hideVerifyErrorMsg = false;
  }
  //otp verification
  async verifyOtp(f:NgForm) {
    if(this.mobilePhoneNumber){
      let mobileNumber = this.mobilePhoneNumber.replace('+', '');
      let countryCodes = this.countryCodeArray;
      let phone=mobileNumber;
      let  validNumber = countryCodes.some(elem => phone.match('^' + elem));
      if(validNumber == true){
        mobileNumber = mobileNumber.replace(new RegExp(`^(${this.countryCodeArray.join('|')})`), '');
        mobileNumber = countryCodes[1] + mobileNumber;

      }
      else{
        mobileNumber = countryCodes[1] + mobileNumber;
      }
      const bodyData = { "phoneNumber": `${mobileNumber}`, "code": this.otpNumber }
      this.http.post(`${this.twilioServerURL}/verify`, bodyData).subscribe((data) => {
        if (data['status'] === 'approved') {
          let verifyPhoneNumber: any;
          verifyPhoneNumber = {
            accessToken: this.token,
            phoneNumber: mobileNumber,
            countryCode: '',
            channel: this.device.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
            ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation:''
          }
          if(verifyPhoneNumber){
            this._pocnService.submitPhoneLinking(verifyPhoneNumber).subscribe(
              (response: SubmitPhoneLinkingResponse) => {
                if (response.data.submitPhoneLinking.updateConnectionResponse.status === 'success') {
                  this.phoneLinked = 1;
                  this.verifyMessage = true
                  this.slides.slideNext();
                  this.phoneSuccessStatus = true;
                  setTimeout(
                    function () {
                      this.phoneSuccessStatus = false;
                    }.bind(this),
                    3000,
                  )
                  const spanName = "connect-phone-otp-verify-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'connect phone otp verification';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully verified otp' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.setSignUpConnectLoader= false;
                }else {
                    this.slides.slideTo(11, 500);
                    this.showVerifyNumber = true;
                    this.disableNumber = true;
                    this.verifyMessage = true;
                    this.setSignUpConnectLoader= false;
                }
              });
          }
        }else if((data['status'] === '404')) {
          this.verifyExpireMessage = false
          this.slides.slideTo(11, 500);
          this.showVerifyNumber = true;
          this.disableNumber = true;
          this.setSignUpConnectLoader= false;
        } else {
            this.verifyMessage = false
            this.slides.slideTo(11, 500);
            this.showVerifyNumber = true;
            this.disableNumber = true;
            this.setSignUpConnectLoader= false;
        }
      })
    }
  }
  //caller id connect step 5
  clickCallerConfirm(f:NgForm){
    this.hidePrevICon= true;
    if((f.value['workPhoneNumber'] != null) ||(f.value['workPhoneNumber'] != undefined)){
      let workPhoneNumber = f.value['workPhoneNumber'].replace('+', '');
      let countryCodes=this.countryCodeArray;
      let phone=workPhoneNumber;
      let  validNumber = countryCodes.some(elem => phone.match('^' + elem));
      if(!isNaN(f.value['workPhoneNumber'])){
        if(f.value['workPhoneNumber'].length < 10){
          this.showWorkNumber=true;
          this.showWorkCountryError = false;
        } else if(f.value['workPhoneNumber'].length > 10 && validNumber == false){
          this.showWorkNumber=true;
          this.showWorkCountryError = false;
        }else {
          this.showWorkCountryError = true;
        }
      } else{
          this.showWorkCountryError = true;
          this.showWorkNumber = false;
      }
    }
    //white space validation
    if(!f.value['userName'].replace(/\s/g, '').length) {
        this.callNameWhiteSpaceCheck = false;
       // this.showWorkCountryError = true;
        this.callErrName = true;
    } else {
        this.callNameWhiteSpaceCheck = true;
    }
    if(f.value['userName'] == '' || f.value['userName'] == null && f.value['userName'] == undefined){
      this.callErrName = false;
      this.callNameWhiteSpaceCheck = true;
    // this.showWorkCountryError = true;
      this.ShowConnectErrPhone = true;
    } else {
        this.callErrName = true;
    }
    if(f.value['userName']!= '' &&  f.value['workPhoneNumber'] != '' && !isNaN(f.value['workPhoneNumber']) && (f.value['workPhoneNumber'].length >= 10) && this.callNameWhiteSpaceCheck == true && this.showWorkCountryError == true){
      this.setSignUpConnectLoader= true;
      let countryCodes = this.countryCodeArray;
      let phone= f.value['workPhoneNumber'].replace('+', '');
      let validNumber = countryCodes.some(elem => phone.match('^' + elem));
      let mobilePhoneNumber;
      // if(validNumber == true){
      //   mobilePhoneNumber = phone;
      // }
      // else{
      //   mobilePhoneNumber = countryCodes + phone;
      // }
      let startsWithCountryCode = countryCodes.some(code => phone.startsWith(code));
      console.log(startsWithCountryCode,"startsWithCountryCode")
      if (startsWithCountryCode) {
        this.showWorkCountryError = false;
        this.setSignUpConnectLoader= false;
        console.error('Please do not include country codes.');
        return;
      } else {
        this.showCallCountryError = true;
        mobilePhoneNumber = countryCodes[0] + phone;
        this.setSignUpConnectLoader= false;
        // Proceed with the rest of your logic using mobilePhoneNumber
        // Add any further logic here
      }
      let callerVerifyData;
      callerVerifyData = {
        accessToken: this.token,
        name: f.value['userName'],
        phoneNumber:mobilePhoneNumber ,
        npi:this.providerHcpNpi,
        providerId:parseInt(this.providerId),
        userId:this.userId,
      }
      let callUpdateStatus;
      callUpdateStatus ={
        accessToken: this.token,
        channel: this.device.userAgent,
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        geoLocation:''
      }
     // caller id verification removed from client approval
      this._pocnService.updateCallerProfileDetails(callerVerifyData).subscribe(
        (response: AddCallerProfileResponse) => {
          if(response.data.addCallerProfile.userProfileUpdateResponse.status === 'Success') {
            const spanName = "connect-caller-entry-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'connect caller id verification';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully added caller ids' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
            this._pocnService.submitCallerId(callUpdateStatus).subscribe(
              (response: SubmitCallerResponse) => {
                if(response.data.submitCallerId.updateConnectionResponse.status === 'success') {
                  if(this.hcpVerifiedStatus == "Verified"){
                    this._pocnService.updatePatientConnectStatus(callUpdateStatus).subscribe(
                    (response: UpdatePatientConnectStatusResponse) => {
                      if(response.data.updatePatientConnectStatus.updateConnectionResponse.status === 'success') {
                        const spanName = "connect-update-connect-status-btn";
                        let attributes = {
                            userId: this._pocnLocalStorageManager.getData("userId"),
                            firstName: this._pocnLocalStorageManager.getData("firstName"),
                            lastName: this._pocnLocalStorageManager.getData("lastName"),
                            userEmail:this._pocnLocalStorageManager.getData("userEmail")
                        }
                        const eventName = 'update register connect status';
                        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated connect status' }
                        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                            this.telemetry.parentTrace = result;
                        })
                        this.myUserConnectData = 1;
                        this.slides.slideTo(14, 500);
                        this.ShowConnectErrPhone = true;
                        this.setSignUpConnectLoader= false;
                      }
                    });
                  }
                  // else {
                  //   if(this.hcpVerifiedStatus == "In progress"){
                  //     this.slides.slideTo(13, 500);
                  //   }
                  // }
                }else{
                  if(response.data.submitCallerId.updateConnectionResponse.status === 'error' && response.data.submitCallerId.updateConnectionResponse.error === 'Caller Id already verified'){
                    this.setSignUpConnectLoader= true;
                    if(this.hcpVerifiedStatus == "Verified"){
                      this._pocnService.updatePatientConnectStatus(callUpdateStatus).subscribe(
                      (response: UpdatePatientConnectStatusResponse) => {
                        if(response.data.updatePatientConnectStatus.updateConnectionResponse.status === 'success') {
                          this.myUserConnectData = 1;
                          this.slides.slideTo(14, 500);
                          this.ShowConnectErrPhone = true;
                          const spanName = "connect-update-connect-status-btn";
                          let attributes = {
                              userId: this._pocnLocalStorageManager.getData("userId"),
                              firstName: this._pocnLocalStorageManager.getData("firstName"),
                              lastName: this._pocnLocalStorageManager.getData("lastName"),
                              userEmail:this._pocnLocalStorageManager.getData("userEmail")
                          }
                          const eventName = 'update register connect status';
                          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated connect status' }
                          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                              this.telemetry.parentTrace = result;
                          })
                          this.setSignUpConnectLoader= false;
                        }
                      });
                    }
                    //  else {
                    //   if(this.hcpVerifiedStatus == "In progress"){
                    //     this.slides.slideNext();
                    //   }
                    // }
                  }
                }
              });

          } else if(response.data.addCallerProfile.userProfileUpdateResponse.error === 'Phone number already exists' && response.data.addCallerProfile.userProfileUpdateResponse.status === 'error'){
            this.setSignUpConnectLoader= true;
            if(this.hcpVerifiedStatus == "Verified"){
              this._pocnService.updatePatientConnectStatus(callUpdateStatus).subscribe(
              (response: UpdatePatientConnectStatusResponse) => {
                if(response.data.updatePatientConnectStatus.updateConnectionResponse.status === 'success') {
                  this.myUserConnectData = 1;
                  this.slides.slideNext();
                  this.ShowConnectErrPhone = true;
                  const spanName = "connect-update-connect-status-btn";
                  let attributes = {
                      userId: this._pocnLocalStorageManager.getData("userId"),
                      firstName: this._pocnLocalStorageManager.getData("firstName"),
                      lastName: this._pocnLocalStorageManager.getData("lastName"),
                      userEmail:this._pocnLocalStorageManager.getData("userEmail")
                  }
                  const eventName = 'update register connect status';
                  const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated connect status' }
                  this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                      this.telemetry.parentTrace = result;
                  })
                  this.setSignUpConnectLoader= false;
                }
              });
            } else {
              this.setSignUpConnectLoader= false;
              if(this.hcpVerifiedStatus == "In progress"){
                this.slides.slideNext();
              }
            }
          } else {
            this.setSignUpConnectLoader= false;
            this.slides.slideTo(13, 500);
          }
        });
      this.showWorkCountryError = true;
      this.callNameWhiteSpaceCheck = true;
      this.callErrName = true;
    } else {
      this.setSignUpConnectLoader= false;
        this.slides.slideTo(13, 500);
    }
  }
  //navigate to dialer screen
  async presentLoading() {
    const popover = await this.modalController.create({
      component: OverlayPopoverPage,
      cssClass: 'overlay-modal',
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      this.router.navigate(['/tablinks/my-profile'])
    });
    await popover.present();
  }
  clickDialerScreen(){
    if(this.myUserConnectData == 1){
      this.tabName = this.location.getState();
      if(localStorage.getItem('typeConnect') == 'audio'){
        this.router.navigate(['/dialer'])
      }
      else{
        this.goToVideoCall();
      }
    }
    else {
        if(this.hcpVerified == 0 && this.phoneLinked == 1){
          this.router.navigate(['/dialer'])
          this.presentLoading();
        }
    }
  }
  goToVideoCall() {
    let createRoom: any;
    createRoom = {
      accessToken: this.token,
      channel: this.device.userAgent,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      geoLocation: '',
    }
    this._pocnService.createRoom(createRoom).subscribe(
      (response: CreateRoomResponse) => {
        if (response.data.createRoom.updateConnectionResponse.status === 'success') {
          this.userRoomData = response.data.createRoom.updateConnectionResponse.data;
          const spanName = "connect-call-create-room-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail")
          }
          const eventName = 'connect video call create room';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully room created in video call' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
        }
        this.router.navigateByUrl('/dialer2', { state: { userDataId: response.data.createRoom.updateConnectionResponse.data } });
      });
  }
  dismiss(){
    this.tabName = this.location.getState();
    if(this.tabName.tabName == 'connection'){
      this.router.navigate(['/tablinks/connection'])
      // .then(() => {
      //     window.location.reload();
      //   });
    }
    else if(this.tabName.tabName == 'groups'){
      this.router.navigate(['/tablinks/groups'])
    }
    else if(this.tabName.tabName == 'post'){
      this.router.navigate(['/tablinks/post'])
    }
    else if(this.tabName.tabName == 'my-profile'){
      this.router.navigate(['/tablinks/my-profile'])
    }
    else{
        this.router.navigate(['/tablinks/my-profile'])
    }
  }
  async showEmailAlertPopOver() {
    const popover = await this.modalController.create({
      component: EmailConnectAlertPopoverPage,
      cssClass: 'emailalert-modal',
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      this.emailConnectInput.setFocus();
    });
    await popover.present();
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
  removeFile(){
    this.myIdproofName = '';
    this.showRename = true;
  }
  async close(){
    await this.modalController.dismiss();
  }
  faqNavigation(value){
    this.router.navigateByUrl('/faq', { state: { connectMsg: value } });

    //this.router.navigate(['/faq'])
  }
  setFocusWorkNumInput() {
    console.log(this.workNumInputData, "workNumInputData");
    if (this.workNumInputData) {
      this.workNumInputData.setFocus();
    }
  }
  slidePrev(){
  this.patientConnectStatusCalls(this.userId.toUpperCase( ));
    this.slides.slideTo(0, 50);
    this.setLoader = false;
  }
  submitForm(form: NgForm, event: Event) {
    event.preventDefault(); // Stop form submission
    event.stopPropagation(); // Prevent event bubbling
    
    if (form.valid) {
      this.clickCallerConfirm(form);
    }
  }
 
}
