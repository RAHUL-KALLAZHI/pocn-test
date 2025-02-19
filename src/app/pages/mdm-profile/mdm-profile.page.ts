import { Component, OnInit, Input } from '@angular/core';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { TokenManager } from "./../../services/token-manager";
import { Router } from '@angular/router';
import {  ModalController } from '@ionic/angular';
import { MdmProfileMessagePage } from '../mdm-profile-message/mdm-profile-message.page';
import { NgForm } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { TelemetryService } from 'src/app/services/telemetry.service';

@Component({
  selector: 'app-mdm-profile',
  templateUrl: './mdm-profile.page.html',
  styleUrls: ['./mdm-profile.page.scss'],
})
export class MdmProfilePage implements OnInit {
  @Input() memberId: any;
  @Input() type:string;
  pageLoaderStatus: boolean = true;
  showEmailError: boolean = true;
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
  deviceType: string = '';
  public mdmUserAddressDetails = [];
  public mdmUserDegreeDetails = [];
  public mdmUserExpDetails = [];
  public mdmUserProfessionalProfileDetails = [];
  primarySpecialityDesc;
  constructor(    
    private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    private tokenManager: TokenManager,
    public loading: LoadingService, 
    public telemetry: TelemetryService,
    ) { 
     this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "mdm-profile-popover";
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
    if(this.token == "" || this.token == null){
      this.router.navigate(["/"]);
    }  
    this.tokenManager.setRefreshTokenIntrvl();
    this.loading.present();
    this.getMdmUserProfile();
    this.providerUserInfos();
  }
  sendMailInput = (f:NgForm) => {
    if (f.valid && f.value!='') {  
      this.recEmailId = f.value.emailInputInvite;
    }
    let regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // let searchfind = regex.test(this.person.email);
    // let regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z](?:[a-z-]*[a-z])?$/g;
    let searchfind = regex.test(f.value.emailInputInvite);

    if(searchfind === true){
      this.showEmailError = true;
      this.goToMessage(f.value.emailInputInvite);
    }
    else{
      this.showEmailError = false;
    }
  }
  async close() {
    await this.modalController.dismiss(this.type);
    // window.onload
  }

  providerUserInfos(){
    let providerTypeIdData;
    console.log(this.memberId['providerId']);
    if(this.type=='search'){
      providerTypeIdData = this.memberId['providerId'];
    }
    else{
      providerTypeIdData = Number(this.memberId['providerId']);
    }
    console.log(providerTypeIdData);
    this._pocnService.providerMdmUserInfos(providerTypeIdData).subscribe(({ data }) => {
    this.userData = data['providerInfos']['nodes'][0];
    })
  }
  async goToMessage(emailInput: string) {
    const popover = await this.modalController.create({
      component: MdmProfileMessagePage,
      cssClass: 'public-profile-modal',
      componentProps: {
        'memberDetails': this.memberId,
        'emailInput': emailInput,
        'mdmProfileBasicInfo': this.mdmUserDetails,
        'type': this.type,
      },
    })
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse.data === undefined) {
      }
      if (modalDataResponse.data == 'speciality') {
        this.onClick('speciality');
      }
      if (modalDataResponse.data == 'location') {
        this.onClick('location');
      }
      if (modalDataResponse.data == 'education') {
        this.onClick('education');
      }
      if (modalDataResponse.data == 'workHistory') {
        this.onClick('workHistory');
      }
      if (modalDataResponse.data == 'pocnUser') {
        this.onClick('pocnUser');
      }
      if (modalDataResponse.data == 'search') {
        this.onClick('search');
      }
    });
    await popover.present();
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
}
