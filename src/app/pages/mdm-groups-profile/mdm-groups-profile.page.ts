import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { TokenManager } from "./../../services/token-manager";
import { Router } from '@angular/router';
import {  ModalController, AlertController } from '@ionic/angular';
import { MdmProfileMessagePage } from '../mdm-profile-message/mdm-profile-message.page';
import { NgForm } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { IonContent } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-mdm-groups-profile',
  templateUrl: './mdm-groups-profile.page.html',
  styleUrls: ['./mdm-groups-profile.page.scss'],
})
export class MdmGroupsProfilePage implements OnInit {
  @Input() memberId: any;
  @Input() type:string;
  @Input() groupId: string;
  @ViewChild(IonContent) content: IonContent;
  pageLoaderStatus: boolean = true;
  showEmailError: boolean = true;
  inviteGrps: boolean = false;
  disableInvite: boolean = false;
  public recEmailId;
  public emailInputInvite;
  public token: string;
  userData;
  userId;
  public onClick = (contact) => {}
  providerHcpNpi;
  userName;
  // public mdmUserDetails : any[];
  mdmUserDetails = {
    aboutMe: "",
    connectedPatients: 0,
    connections: 0,
    dob: "",
    email: "",
    facebook: "",
    firstName: "",
    followers: 0,
    gender: null,
    globalOptOut: 0,
    lastName: "",
    linkedin: "",
    middleName: "",
    name: "",
    npi: "",
    primarySpecialityCode: "",
    primarySpecialityDesc: "",
    primarySpecialityGroup: "",
    primarySpecialityGroupCode: "",
    profileTagLine: "",
    providerId: "",
    twitter: "",
    website: "",
    userId: "",
    degreeGroupCode: ""
  }
  userIp = '';
  userAgent: string;
  deviceType;
  public mdmUserAddressDetails = [];
  public mdmUserDegreeDetails = [];
  public mdmUserExpDetails = [];
  public mdmUserProfessionalProfileDetails = [];
  primarySpecialityDesc;
  constructor( private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    private tokenManager: TokenManager,
    public alertController: AlertController,
    public loading: LoadingService,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    public telemetry: TelemetryService,
    ) {
     this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "mdm-group-profile-popover";
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
    console.log(this.type);
    if(this.token == "" || this.token == null){
      this.router.navigate(["/"]);
    }
    this.tokenManager.setRefreshTokenIntrvl();
    this.loading.present();
    this.getMdmUserProfile();
    this.providerUserInfos();
    if (this.isMobile == true) {
      this.deviceType = "Mobile"
    }
    else if (this.isTablet == true) {
      this.deviceType = "Tablet"
    }
    else if (this.isDesktop == true) {
      this.deviceType = "Desktop"
    }
    else {
      this.deviceType = "Unknown"
    }
    this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();
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
  get isMobile(): boolean {
    return this.deviceService.isMobile();
    }

    get isTablet(): boolean {
    return this.deviceService.isTablet();
    }

    get isDesktop(): boolean {
    return this.deviceService.isDesktop();
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
  sendMailInput = (f:NgForm) => {
    if (f.valid && f.value!='') {
      this.recEmailId = f.value.emailInputInvite;
      console.log(this.recEmailId);
    }
    let regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // let searchfind = regex.test(this.person.email);
    // let regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z](?:[a-z-]*[a-z])?$/g;
    let searchfind = regex.test(f.value.emailInputInvite);

    if(searchfind === true){
      this.showEmailError = true;
      //this.goToMessage(f.value.emailInputInvite);
      this.inviteUserGroup(this.recEmailId);
    }
    else{
      this.showEmailError = false;
     
    }
  }
  async close() {
    await this.modalController.dismiss();
    // window.onload
  }

  providerUserInfos(){
    let providerTypeIdData;
    if(this.type=='search'){
      providerTypeIdData = this.memberId['providerId'];
    }
    else{
      providerTypeIdData = Number(this.memberId['providerId']);
    }
    this._pocnService.providerMdmUserInfos(providerTypeIdData).subscribe(({ data }) => {
    this.userData = data['providerInfos']['nodes'][0];
    })
  }
  getMdmUserProfile() {
    let providerTypeIdData;
    if(this.type=='search'){
      providerTypeIdData = String(this.memberId['providerId'])
    }
    else{
      providerTypeIdData = this.memberId['providerId'];
    }
    this._pocnService.getMdmUserProfile(this.token,providerTypeIdData)?.subscribe(({ data }) => {
      this.pageLoaderStatus = false;
      this.mdmUserDetails = data['getMdmUserProfile']['data']['userBasicProfile'];
      console.log( this.mdmUserDetails );
      this.primarySpecialityDesc =  this.mdmUserDetails['primarySpecialityDesc'].replace('(i.e., a specialty other than those appearing above)', '');

      this.mdmUserAddressDetails = data['getMdmUserProfile']['data']['userAddressProfile'];
      this.mdmUserDegreeDetails = data['getMdmUserProfile']['data']['userDegreeProfile'];
      this.mdmUserExpDetails = data['getMdmUserProfile']['data']['userExperienceProfile'];
      this.mdmUserProfessionalProfileDetails = data['getMdmUserProfile']['data']['userProfessionalProfile'];
      if(this.loading.isLoading){
        this.loading.dismiss();
      }
    },
      (error) => {
        // if(this.loading.isLoading){
        //   this.loading.dismiss();
        // }
        // this._pocnLocalStorageManager.removeData("firstName");
        // this._pocnLocalStorageManager.removeData("lastName");
        // this._pocnLocalStorageManager.removeData("pocnApiAccessToken");
        // this._pocnLocalStorageManager.removeData("userEmail");
        // this._pocnLocalStorageManager.removeData("refreshToken");
        // this._pocnLocalStorageManager.removeData("tabName");
        // this._pocnLocalStorageManager.removeData("subTabName");
        // this._pocnLocalStorageManager.removeData("userId");
        // this.router.navigate(["/register"]);
      });
  }

  inviteUserGroup(email){
    console.log(this.memberId);
    console.log(this.groupId);
    console.log(email);
    this.disableInvite = true;
   let inviteData = {
      accessToken: this.token,
      groupId: this.groupId,
      userId: this.memberId['npi'],
      npi: this.memberId['npi'],
      userFirstName:  this.memberId['firstName'],
      userLastName: this.memberId['lastName'],
      userSpecialtyCode: this.memberId['primarySpecialtyCode'],
      userSpecialtyDesc: this.memberId['primarySpecialtyDesc'],
      userDegreeGroupCode: this.memberId['primarySpecialtyGroupCode'],
      userCity:this.memberId['city'],
      userState: this.memberId['state'],
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.userAgent,
      inviteUserClass: '',
      geoLocation:'',
      userEmail: email,
      userMessage: "test"
  }
  console.log(inviteData);
  
    this._pocnService.inviteUserGroup(inviteData).subscribe(
      (response: any) => {
        console.log(response);
        if (response.data.inviteUserGroup.groupStatusResponse.status === 'success') {
            this.inviteGrps= true;
            this.content.scrollToTop(3000);
            setTimeout(function () {
              this.inviteGrps= false;
            }.bind(this), 3000);
            this.modalController.dismiss(this.type); 
        }
        else{
          this.disableInvite = false;
        }
      });
  }
  showGroupCreationAlert(message) {
    this.alertController.create({
      header: '               ',
      subHeader: message,
      message: '                ',
      buttons: ['OK']
    }).then(res => {
      res.present();
    });
    // this.getUserGroups();
  }
}
