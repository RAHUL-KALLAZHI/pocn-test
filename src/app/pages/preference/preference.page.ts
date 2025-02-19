import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { TopicNode, TherapeuticAreaNode, GeneralTopicNode } from './../../services/type';
import { TokenManager } from "./../../services/token-manager";
import { IonContent,Platform } from '@ionic/angular';
import { Router,NavigationExtras } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertController, ModalController } from '@ionic/angular';
import { DeletePreferenceAreasPage } from '../delete-preference-areas/delete-preference-areas.page';
import { PreferenceSmsModalPage } from '../preference-sms-modal/preference-sms-modal.page';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { PreferenceAlertPopoverPage } from '../preference-alert-popover/preference-alert-popover.page';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.page.html',
  styleUrls: ['./preference.page.scss'],
})

export class PreferencePage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('target') target: any;
  showEmailInput: boolean = false;
  showSmsInput: boolean = false;
  showUpdateMessage: boolean = false;
  showUpdateErrorMessage: boolean = false;
  updateStatus: boolean = false;
  userId: string;
  token: string;
  profileMobileNumber: string;
  updateMessage = "Preferences updated Successfully";
  backButtonSubscription;
  emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z](?:[a-zA-Z-]*[a-zA-Z])?$/;
  therapeuticAreaType: TherapeuticAreaNode[] = [];
  topicType: TopicNode[] = [];
  generalTopicType: GeneralTopicNode[] = [];
  selectedAreaInterest = [];
  selectedTopicInterest = [];
  topicAreaInterest = [];
  channelSelected = [];
  selectedArea = [];
  areaDetails: any = [];
  areaDetailsTemp: any = [];
  interestedAreasPreferences = [];
  public masterOpportunities;
  topicAreaList = [];
  topicAreaListTemp = [];
  userPrivilege = [];
  userPrivilegeData = [];
  selectWrapper;
  selectOptions;
  areaPrimary = [];
  interestPrimary: boolean;
  interestSelectionLimit: boolean = false;
  interestSelectionAddButton: boolean = true;
  areaInterestProrityList;
  public areaOfInterestList = [];
  selectedValueCode;
  interestedAreaList = [];
  topicsOfInterestList = [];
  getNpi;
  interestedAreaListTemp = [];
  titleType;
  showPhoneDiv:boolean = false ;
  emailErrorStatus:boolean = false ;

  public opportunityList: any[] = [{
    opportunityValue: '',
    opportunityId: '',
    isChecked: false,
  }];

  public specialityType: any[] = [{
    isEnabled: false,
  }];
  specialityTypeEnabled:boolean[] = [];
  public masterOpportunitiesData1;
  public masterOpportunitiesData2;
  public masterOpportunitiesData3;
  public masterOpportunitiesData4;
  public masterOpportunitiesData5;
  public masterOpportunitiesData6;
  public masterOpportunitiesData7;
  public masterOpportunitiesData8;
  areaInterestSelectedRadioValue: boolean = false;
  areaInterestSelectedRadioValue2: boolean = false;
  areaInterestSelectedRadioValue3: boolean = false;
  public profileBasic = {
    npi: '',
    providerId: 0,
    userId: ''
  }
  // liveOpps = [
  //   { isChecked: false, name: 'Local', value: '', id: 1, oppId: 1 },
  //   { isChecked: false, name: 'Regional', value: '', id: 2, oppId: 1 },
  //   { isChecked: false, name: 'National', value: '', id: 3, oppId: 1 },
  // ]
  // webinarOpps = [
  //   { isChecked: false, name: 'Webinar(Live Event)', value: '', id: 1, oppId: 2 },
  //   { isChecked: false, name: 'Webcast(Recorded Event)', value: '', id: 2, oppId: 2 },
  // ]
  // emailOpps = [
  //   { isChecked: false, name: 'Promotional', value: '', id: 1, oppId: 3 },
  //   { isChecked: false, name: 'Non-Promotional', value: '', id: 2, oppId: 3 },
  // ]
  // marketOpps = [
  //   { isChecked: false, name: 'Interviews', value: '', id: 1, oppId: 4 },
  //   { isChecked: false, name: 'Surveys', value: '', id: 2, oppId: 4 },
  //   { isChecked: false, name: 'Advisory Boards', value: '', id: 3, oppId: 4 },
  // ]
  // eduOpps = [
  //   { isChecked: false, name: 'Short(3-5 minutes)', value: '', id: 1, oppId: 5 },
  //   { isChecked: false, name: 'Long(20-30 minutes)', value: '', id: 2, oppId: 5 },
  // ]
  // authoringOpps = [
  //   { isChecked: false, name: 'Promotional', value: '', id: 1, oppId: 6 },
  //   { isChecked: false, name: 'Non-Promotional', value: '', id: 2, oppId: 6 },
  // ]
  // socialOpps = [
  //   { isChecked: false, name: 'Facebook', value: '', id: 1, oppId: 7 },
  //   { isChecked: false, name: 'Twitter', value: '', id: 2, oppId: 7 },
  //   { isChecked: false, name: 'Instagram', value: '', id: 3, oppId: 7 },
  // ]
  // clinicalOpps = [
  //   { isChecked: false, name: 'Investigator', value: '', id: 1, oppId: 8 },
  //   { isChecked: false, name: 'Identifying/Enrolling Patients', value: '', id: 2, oppId: 8 },
  // ]
  channels = [
    { isChecked: false, name: 'SMS', value: '', id: 1, text: 'Phone No.' },
    { isChecked: false, name: 'Email', value: '', id: 2, text: 'Email' },
   // { isChecked: false, name: 'Newsletters', value: '', id: 3, text: 'Newsletters' },
   // { isChecked: false, name: 'Socialmedia', value: '', id: 4, text: 'Socialmedia' },
  ]
  priority = [
    { isChecked: false, name: 'Primary', value: '', id: 1, text: 'Primary' },
    { isChecked: false, name: 'Secondary', value: '', id: 2, text: 'Secondary' },
    { isChecked: false, name: 'Tertiary', value: '', id: 3, text: 'Tertiary' },
  ]

  constructor(
    private dataService: DataService,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,
    public alertController: AlertController,
    private tokenManager: TokenManager,
    private router: Router,
    public loading: LoadingService,
    public telemetry: TelemetryService,
    private platform: Platform,
    private modalController: ModalController,
  ) {
    this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this.userId = this._pocnLocalStorageManager.getData("userId");
  }
  ngOnInit() {
    if (this.token == "" || this.token == null) {
      this.router.navigate(["/"]);
    }
    this.getUserPrivilegeSections();
    this.getNpiDetails();
    this.getGeneralTopicType();

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
  }

  backBtnClick(){
    const navigationExtras: NavigationExtras = {
      queryParams: { timestamp: new Date().getTime() }
    };
    this.router.navigate(["/tablinks/my-profile"], navigationExtras);
  }
  getUserFullPreferences() {
    this.loading.present();
    let channelPreferences = [];
    let interestedTopicPreferences = [];
    let filter = [];
    let preferences = [];
    let filterPrimary = [];
    let PriorityCheck = false;
    this._pocnService.getUserFullPreferences(this.token).subscribe(({ data }) => {
      channelPreferences = data['getUserFullPreferences']['data']['userChannelPreferences'];
      this.interestedAreasPreferences = data['getUserFullPreferences']['data']['userInterestedAreasPreferences'];
      interestedTopicPreferences = data['getUserFullPreferences']['data']['userInterestedTopicsPreferences'];
      if(data['getUserFullPreferences'].data['userChannelPreferences'] != null) {
        this.profileBasic.npi = data['getUserFullPreferences'].data['userChannelPreferences'][0].npi;
        this.profileBasic.providerId = data['getUserFullPreferences'].data['userChannelPreferences'][0].providerId;
      }
      this.profileBasic.userId = this.userId;
      if(channelPreferences != null) {
        this.channels.forEach((val, i) => {
          filter = channelPreferences.filter(x => x.channel === val.name);
          if (filter.length > 0 && filter[0].value !== '') {
            let newValue;
            if(val.name == 'SMS') {
              //newValue = '+'+filter[0].value;
              //newValue = filter[0].value;
              newValue = this.profileMobileNumber;
              // if(this.profileMobileNumber!=''){
              // }
            } else {
              newValue = filter[0].value;
            }
            preferences.push({ isChecked: true, name: filter[0].channel, value: newValue, id: val.id, text: val.text })
          } else {
            preferences.push(val);
          }
        })
        this.channels = preferences;
      }
      if (this.interestedAreasPreferences != null) {
        this.interestedAreasPreferences.forEach((field, index) => {
          let specialitySelected = this.specialityType.filter((obj) => {
            return obj.specialtyCode === field.specialtyCode;
          });
          let specialityPriority = this.priority.filter((obj) => {
            return obj.id === field.isPrimary;
          });
          if (specialityPriority.length > 0) {
            PriorityCheck = true;
          } else {
            PriorityCheck = false;
          }
          this.areaPrimary[index] = field.isPrimary;
          let selectedTherapeutics = [];
          let therapeuticSelectItems = [];
          this._pocnService.getTherapeuticArea(this.token, field.specialtyCode).subscribe(({ data }) => {
            if (data['getTherapeuticAreasSpecCode']['data']) {
              data['getTherapeuticAreasSpecCode']['data'].forEach((thField, item) => {
                this.topicsOfInterestList.push({ title: thField.therapeuticAreas })                
              })
            }
            let selectedValues = [];
            selectedTherapeutics.forEach((selectField, index) => {
              selectedValues.push(selectField.id);
            });
            this.areaDetails.push({
              isChecked: (field.isPrimary == 0)? false : PriorityCheck,
              isPrimary: field.isPrimary,
              name: "",
              value: "",
              specialtyName: specialitySelected[0]['specialtyName'],
              specialtyCode: specialitySelected[0]['specialtyCode'],
              specialtyGroupName: specialitySelected[0]['specialtyGroupName'],
              specialtyGroupCode: specialitySelected[0]['specialtyGroupCode'],
              therapeuticArea: therapeuticSelectItems,
            });
          });
        });
      }
      setTimeout(() => {
        if (interestedTopicPreferences != null) {
          interestedTopicPreferences.forEach((field, index) => {
            if (field.topic != '') {
              this.topicAreaListTemp.push({ title: field.topic });
            } else {
              this.topicAreaListTemp.push({ });
            }
          });
        }
        const result = this.topicsOfInterestList.filter((a) => this.topicAreaListTemp.some((b) => a.title === b.title));
        this.topicAreaListTemp = result;
        this.areaDetails = this.areaDetails.sort((a, b) => b.isChecked - a.isChecked || a.isPrimary - b.isPrimary   );
      }, 1500);
     
      if(this.loading.isLoading){
        this.loading.dismiss();
      }
    },
      (error) => {
        if(this.loading.isLoading){
          this.loading.dismiss();
        }
        this.router.navigate(['/'])
      });
  }
  showLimitAlert() {
    this.alertController.create({
      header: '               ',
      subHeader: 'Choose maximum of 3 Areas of Interest',
      message: '                ',
      buttons: ['OK']
    }).then(res => {
      res.present();
    });
  }
  showAlert() {
    this.alertController.create({
      header: '               ',
      subHeader: 'Choose maximum of 10 Topics of Interest',
      message: '                ',
      buttons: ['OK']
    }).then(res => {
      res.present();
    });
  }
  showAreaAlert() {
    this.alertController.create({
      header: '               ',
      subHeader: 'Please set any of your primary area of interest',
      message: '                ',
      buttons: ['OK']
    }).then(res => {
      res.present();
    });
  }

  addAreaOfInterest(selectedValue: any) {
    if(this.areaDetails.length < 3) {
      let specialitySelected = this.specialityType.filter((obj, i) => {
        return obj.specialtyCode === this.selectedValueCode;
      });
      let alreadySelectedAreaIndex = this.areaDetails.findIndex((item) => item.specialtyCode === this.selectedValueCode);
      if(specialitySelected.length > 0 && alreadySelectedAreaIndex == -1){
        this.getTherapeuticArea(this.selectedValueCode);
        let selectedAreaIndex = this.specialityType.findIndex((item) => item.specialtyCode === this.selectedValueCode);
        this.specialityTypeEnabled[selectedAreaIndex] = true;
          this.areaDetails.push({
            isChecked: (this.areaDetails.length < 1)? true : false,
            isPrimary: (this.areaDetails.length < 1)? 1 : 0,
            name: "",
            value: "",
            specialtyName: (specialitySelected[0]['specialtyName']),
            specialtyCode: specialitySelected[0]['specialtyCode'],
            specialtyGroupName: specialitySelected[0]['specialtyGroupName'],
            specialtyGroupCode: specialitySelected[0]['specialtyGroupCode'],
          });
          this.interestSelectionAddButton = true;
      }
    }
  }

  getNpiDetails() {
    this._pocnService.getUserProfile(this.token)?.subscribe(({ data }) => {
      this.getNpi = data['getUserFullProfile'].data['userBasicProfile']['npi'];
    });
  }
  onSelectChange(selectedValue: any) { 
    if(this.areaDetails.length > 2) {
      //this.showLimitAlert();
      this.primarySpecilaityAlertPopOver('Choose maximum of 3 Areas of Interest');
    }   
    this.selectedValueCode = selectedValue.value.specialtyCode;

    this.interestSelectionAddButton = false;
  }
  selected_values = [];
  onSelectMultiple(selectedValue: any) {
    if (selectedValue.value.length > 10) {
      //this.showAlert();
      this.primarySpecilaityAlertPopOver('Choose maximum of 10 Topics of Interest');
    }
    else {
     
    }
  }

  getSpecialityType = () => {
    this._pocnService.getSpecialityType().subscribe(({ data }) => {
      this.specialityType = data.masterSpecialties.nodes;
      let filter = [];
      this.specialityType.forEach((val, i) => {
        filter = this.areaDetails.filter(x => x.specialtyName === val.specialtyName);
        if (filter.length > 0) {
          this.specialityTypeEnabled[i] = true;
        } else {
          this.specialityTypeEnabled[i] = false;
        }
      })
      this.getUserFullPreferences();
      this.getUserMobileNumber();
    });
  }
  getTherapeuticArea(selectedValueCode) {
    this._pocnService.getTherapeuticArea(this.token, selectedValueCode).subscribe(({ data }) => {
      if (data['getTherapeuticAreasSpecCode']['data'] != null) {
        data['getTherapeuticAreasSpecCode']['data'].forEach((field, item) => {
          let index = this.topicsOfInterestList.findIndex(x => x.title === field.therapeuticAreas);
          if(index === -1) {
            this.topicsOfInterestList.push({title: field.therapeuticAreas })
          }
        })
      }
    });
  }
  getGeneralTopicType = () => {
    this._pocnService.getGeneralTopicType().subscribe(({ data }) => {
      data.masterTopicsGenerals.nodes.forEach((tgField, item) => { 
        this.topicsOfInterestList.push({ title: tgField.title })        
      })
    });
  }
  toggleProfileSettings(toggleSelection: any, i: number) {
    setTimeout(() => {
      if (this.userPrivilegeData[2].status == false) {
        this.userPrivilegeData[3].status = false;
        this.userPrivilegeData[4].status = false;
        this.userPrivilegeData[5].status = false;
        this.userPrivilegeData[6].status = false;
      }
    }, 0);
    this.userPrivilegeData[i].status = toggleSelection.detail.checked;
    let privilegeDetails = [];
    this.userPrivilegeData.forEach((privilege, index) => {
      privilegeDetails.push({
        active: (privilege.status == true) ? 1 : 0,
        sectionId: privilege.id,
        userId: this.userId,
      });
    });
    this._pocnService.updateUserPrivilegeConfigSingle(privilegeDetails, this.token).subscribe(
      (response: any) => {
        if (response.data) {
          if (response.data.updateUserPrivilegeConfigSingle.userProfileUpdateResponse.status === 'Success') {
            const spanName = "preference-privilege-update-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            }
            const eventName = 'preference privilege update';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated privilege preferences' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }
          else {
            const spanName = "preference-privilege-update-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            }
            const eventName = 'preference privilege update';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update privilege preferences' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }
        }
    });
  }
  getUserPrivilegeSections() {
    this._pocnService.getUserPrivilegeSections(this.userId).subscribe(({ data }) => {
      this.userPrivilege = data['userPrivilegeSections'].nodes;
      if (this.userPrivilege.length > 0) {
        this.userPrivilege.forEach((val, i) => {
          if(val.sectionId == 3 || val.sectionId == 8 || val.sectionId == 17 ) {
            this.titleType = 'main';
          } else {
            this.titleType = 'sub';
          }
          this.userPrivilegeData.push({
            status: (val.active == 1) ? true : false,
            title: val.title,
            id: val.sectionId,
            titleType: this.titleType
          });
        });
      }
      else {
        this.userPrivilegeData = [
          { status: true, title: 'Profile Details', id: 2, userId: this.userId, titleType: 'sub' },
          { status: true, title: 'Contact', id: 1, userId: this.userId, titleType: 'sub' },
          { status: true, title: 'Experience', id: 3, userId: this.userId, titleType: 'main' },
          { status: true, title: 'Education', id: 4, userId: this.userId, titleType: 'sub' },
          { status: true, title: 'Licenses/Certification', id: 5, userId: this.userId, titleType: 'sub' },
          { status: true, title: 'Work History', id: 6, userId: this.userId, titleType: 'sub' },
          { status: true, title: 'Resume', id: 7, userId: this.userId, titleType: 'sub' },
          { status: true, title: 'Badges', id: 8, userId: this.userId, titleType: 'main' },
          { status: true, title: 'Awards', id: 17, userId: this.userId, titleType: 'main' }
         // { status: true, title: 'Posts', id: 18, userId: this.userId, titleType: 'main' }
        ]
      }
    })
  }
  updateChannelPreferences(){
    let channelDetails = [];
    this.channels.forEach((channel, index) => {
      if(channel.name == 'Newsletters') {
        channel.value = 'Newsletters';
      }
      if(channel.name == 'Socialmedia') {
        channel.value = 'Socialmedia';
      }
      if (channel.isChecked === true && channel.value != '') {
        channelDetails.push({
          channel: channel['name'],
          value: channel['value'],
          npi: this.getNpi,
          providerId: this.profileBasic.providerId,
          userId: this.userId,
        });
      }
    });
    if(this.emailErrorStatus == false && this.showPhoneDiv== false ){ 
      this._pocnService.updateChannelPreferences(channelDetails, this.token).subscribe(
        (response: any) => {
          if (response.data.updateChannelPreferences.userProfileUpdateResponse.status === 'Success') {
            this.showUpdateMessage =true;
            setTimeout(function () {
              this.showUpdateMessage = false;
            }.bind(this), 3000);
            this.updateMessage = "Channel preferences updated successfully."
            const spanName = "preference-channel-update-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            }
            const eventName = 'preference channel update';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated channel preferences' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }
          else {
            this.showUpdateErrorMessage =true;
            //this.updateMessage = "Failed to update channel preferences."
            const spanName = "preference-channel-update-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            }
            const eventName = 'preference channel update';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update channel preferences' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }
          //this.content.scrollToTop(1000);
        });
    }
  }
  updateAreaInterestPreferences(){
    let areaOfInterestDetails = [];
    let filter = [];
    filter = this.areaDetails.filter(x => x.isPrimary == 1);
    if(filter.length > 0){
      this.areaDetails.forEach((areaOfInterest, index) => {
        areaOfInterestDetails.push({
          isPrimary: parseInt(areaOfInterest.isPrimary),
          npi: this.getNpi,
          providerId: this.profileBasic.providerId,
          specialtyCode: areaOfInterest.specialtyCode,
          specialtyDesc: areaOfInterest.specialtyName,
          specialtyGroup: areaOfInterest.specialtyGroupName,
          specialtyGroupCode: areaOfInterest.specialtyGroupCode,
          therapeuticArea: (areaOfInterest.therapeutic) ? areaOfInterest.therapeutic : '',
          userId: this.userId,
        });
      });
      if (areaOfInterestDetails.length == 0) {
        areaOfInterestDetails = [];
      }
      this._pocnService.updateInterestedAreasPreferences(areaOfInterestDetails, this.token).subscribe(
        (response: any) => {
          if (response.data) {
            if (response.data.updateInterestedAreasPreferences.userProfileUpdateResponse.status === 'Success') {
              this.showUpdateMessage =true;
              setTimeout(function () {
                this.showUpdateMessage = false;
              }.bind(this), 3000);
              this.updateMessage = "Area preferences updated successfully."  
              const spanName = "preference-area-of-interest-update-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              }
              const eventName = 'preference area of interest update';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated area of interest preferences' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })        
            }
            else {
              this.showUpdateErrorMessage =true;
              //this.updateMessage = "Failed to update area preferences."    
              const spanName = "preference-area-of-interest-update-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              }
              const eventName = 'preference area of interest update';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update area of interest preferences' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })            
            }
            this.content.scrollToTop(2000);
          }
      });
    }
    else{
     // this.showAreaAlert();
      this.primarySpecilaityAlertPopOver('Please set your primary area of interest');
    }
  }
  updateTopicPreferences(){
    if(this.topicAreaListTemp.length < 11){
      let topicDetails = [];
      this.topicAreaListTemp.forEach((topicOfInterest, index) => {
        if(topicOfInterest.title == undefined || topicOfInterest == '') {
          topicOfInterest= ''
        } else {
          topicOfInterest.title.toString()
        }
        topicDetails.push({
          topic: topicOfInterest.title,
          npi: this.getNpi,
          providerId: this.profileBasic.providerId,
          userId: this.profileBasic.userId,
        });
      });
      this._pocnService.updateInterestedTopicsPreferences(topicDetails, this.token).subscribe((response: any) => {
        if (response.data) {
          if (response.data.updateInterestedTopicsPreferences.userProfileUpdateResponse.status === 'Success') {
            this.showUpdateMessage =true;
            setTimeout(function () {
              this.showUpdateMessage = false;
            }.bind(this), 3000);            
            this.updateMessage = "Topic preferences updated successfully." 
            const spanName = "preference-topic-of-interest-update-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            }
            const eventName = 'preference topic of interest update';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated topic of interest preferences' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })              
          }
          else {
            this.showUpdateErrorMessage =true;
            //this.updateMessage = "Failed to update topic preferences."    
            const spanName = "preference-topic-of-interest-update-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            }
            const eventName = 'preference topic of interest update';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update topic of interest preferences' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })        
          }
          this.content.scrollToTop(2000);
        }
      });
    }
    
  }  
  updatePreference() {
    // let areaOfInterestDetails = [];
    // let topicDetails = [];
    // const accessToken = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    // let opportunity = [];
    //const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    
    /*this.liveOpps.forEach((item, index) => {
      if (item.isChecked === true && item.name != '') {
        opportunity.push({
          opportunityId: item['oppId'],
          opportunityValue: item['name'],
          npi: this.profileBasic.npi,
          providerId: this.profileBasic.providerId,
          userId: this.userId,
        });
      }
    });
    this.webinarOpps.forEach((item, index) => {
      if (item.isChecked === true && item.name != '') {
        opportunity.push({
          opportunityId: item['oppId'],
          opportunityValue: item['name'],
          npi: this.profileBasic.npi,
          providerId: this.profileBasic.providerId,
          userId: this.profileBasic.userId,
        });
      }
    });
    this.emailOpps.forEach((item, index) => {
      if (item.isChecked === true && item.name != '') {
        opportunity.push({
          opportunityId: item['oppId'],
          opportunityValue: item['name'],
          npi: this.profileBasic.npi,
          providerId: this.profileBasic.providerId,
          userId: this.profileBasic.userId,
        });
      }
    });
    this.marketOpps.forEach((item, index) => {
      if (item.isChecked === true && item.name != '') {
        opportunity.push({
          opportunityId: item['oppId'],
          opportunityValue: item['name'],
          npi: this.profileBasic.npi,
          providerId: this.profileBasic.providerId,
          userId: this.profileBasic.userId,
        });
      }
    });
    this.authoringOpps.forEach((item, index) => {
      if (item.isChecked === true && item.name != '') {
        opportunity.push({
          opportunityId: item['oppId'],
          opportunityValue: item['name'],
          npi: this.profileBasic.npi,
          providerId: this.profileBasic.providerId,
          userId: this.profileBasic.userId,
        });
      }
    });
    this.eduOpps.forEach((item, index) => {
      if (item.isChecked === true && item.name != '') {
        opportunity.push({
          opportunityId: item['oppId'],
          opportunityValue: item['name'],
          npi: this.profileBasic.npi,
          providerId: this.profileBasic.providerId,
          userId: this.profileBasic.userId,
        });
      }
    });
    this.socialOpps.forEach((item, index) => {
      if (item.isChecked === true && item.name != '') {
        opportunity.push({
          opportunityId: item['oppId'],
          opportunityValue: item['name'],
          npi: this.profileBasic.npi,
          providerId: this.profileBasic.providerId,
          userId: this.profileBasic.userId,
        });
      }
    });
    this.clinicalOpps.forEach((item, index) => {
      if (item.isChecked === true && item.name != '') {
        opportunity.push({
          opportunityId: item['oppId'],
          opportunityValue: item['name'],
          npi: this.profileBasic.npi,
          providerId: this.profileBasic.providerId,
          userId: this.profileBasic.userId,
        });
      }
    });
    this._pocnService.updateUserOpportunity(opportunity, this.token).subscribe(
      (response: any) => {
        if (response.data) {
          if (response.data.updateUserOpportunity.userProfileUpdateResponse.status === 'Success') {
            this.updateStatus = true;
          }
          else {
            this.updateStatus = false;
          }
        }
      });
  */
    // this.channels.forEach((channel, index) => {
    

    // if(channel.name == 'Newsletters') {
    //   channel.value = 'Newsletters';
    // }
    // if(channel.name == 'Socialmedia') {
    //   channel.value = 'Socialmedia';
    // }

    //   if (channel.isChecked === true && channel.value != '') {
    //     channelDetails.push({
    //       channel: channel['name'],
    //       value: channel['value'],
    //       npi: this.getNpi,
    //       providerId: this.profileBasic.providerId,
    //       userId: this.profileBasic.userId,
    //     });
    //   }
    // });

    // if(this.emailErrorStatus == false && this.showPhoneDiv== false ){ //call update only if valid data is given
    //   this._pocnService.updateChannelPreferences(channelDetails, this.token).subscribe(
    //     (response: any) => {
    //       if (response.data.updateChannelPreferences.userProfileUpdateResponse.status === 'Success') {
    //         this.updateStatus = true;
    //       }
    //       else {
    //         this.updateStatus = false;
    //       }
    //     });
    // }


    // this.areaDetails.forEach((areaOfInterest, index) => {
    //   areaOfInterestDetails.push({
    //     isPrimary: parseInt(areaOfInterest.isPrimary),
    //     npi: this.getNpi,
    //     providerId: this.profileBasic.providerId,
    //     specialtyCode: areaOfInterest.specialtyCode,
    //     specialtyDesc: areaOfInterest.specialtyName,
    //     specialtyGroup: areaOfInterest.specialtyGroupName,
    //     specialtyGroupCode: areaOfInterest.specialtyGroupCode,
    //     therapeuticArea: (areaOfInterest.therapeutic) ? areaOfInterest.therapeutic : '',
    //     userId: userId,
    //   });
    // });

    // if (areaOfInterestDetails.length == 0) {
    //   areaOfInterestDetails = [];
    // }
    // this._pocnService.updateInterestedAreasPreferences(areaOfInterestDetails, this.token).subscribe(
    //   (response: any) => {
    //     if (response.data) {
    //       if (response.data.updateInterestedAreasPreferences.userProfileUpdateResponse.status === 'Success') {
    //         this.updateStatus = true;
    //       }
    //       else {
    //         this.updateStatus = false;
    //       }
    //     }
    //   });
    // this.topicAreaListTemp.forEach((topicOfInterest, index) => {
    //   if(topicOfInterest.title == undefined || topicOfInterest == '') {
    //   topicOfInterest= ''
    //   } else {
    //   topicOfInterest.title.toString()
    //   }

    //   topicDetails.push({
    //     topic: topicOfInterest.title,
    //     npi: this.getNpi,
    //     providerId: this.profileBasic.providerId,
    //     userId: this.profileBasic.userId,
    //   });
    // });
    // this._pocnService.updateInterestedTopicsPreferences(topicDetails, this.token).subscribe(
    //   (response: any) => {
    //     if (response.data) {
    //       if (response.data.updateInterestedTopicsPreferences.userProfileUpdateResponse.status === 'Success') {
    //         this.updateStatus = true;
    //       }
    //       else {
    //         this.updateStatus = false;
    //       }
    //     }
    //   });
    // let privilegeDetails = [];
    // this.userPrivilegeData.forEach((privilege, index) => {
    //   privilegeDetails.push({
    //     active: (privilege.status == true) ? 1 : 0,
    //     sectionId: privilege.id,
    //     userId: this.userId,
    //   });
    // });
    // // this._pocnService.updateUserPrivilegeConfig(privilegeDetails, this.token).subscribe(
    // //   (response: any) => {
    // //     if (response.data) {
    // //       if (response.data.updateUserPrivilegeConfig.userProfileUpdateResponse.status === 'Success') {
    // //         this.updateStatus = true;
    // //       }
    // //       else {
    // //         this.updateStatus = false;
    // //       }
    // //     }
    // // });
    // this._pocnService.updateUserPrivilegeConfigSingle(privilegeDetails, this.token).subscribe(
    //   (response: any) => {
    //     if (response.data) {
    //       if (response.data.updateUserPrivilegeConfigSingle.userProfileUpdateResponse.status === 'Success') {
    //         this.updateStatus = true;
    //       }
    //       else {
    //         this.updateStatus = false;
    //       }
    //     }
    // });
    // setTimeout(() => {
    //   if(this.showPhoneDiv == true || this.emailErrorStatus == true) {
    //     this.updateStatus = false;
    //   }
    //   if (this.updateStatus == true) {
    //     this.showUpdateMessage = true;
    //     setTimeout(function () {
    //       this.showUpdateMessage = false;
    //     }.bind(this), 5000);
    //     this.showUpdateErrorMessage = false;
    //     const spanName = "preference-update-btn";
    //     let attributes = {
    //       userId: this._pocnLocalStorageManager.getData("userId"),
    //       firstName: this._pocnLocalStorageManager.getData("firstName"),
    //       lastName: this._pocnLocalStorageManager.getData("lastName"),
    //       userEmail:this._pocnLocalStorageManager.getData("userEmail"),
    //     }
    //     const eventName = 'preference update';
    //     const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated preferences' }
    //     this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
    //         this.telemetry.parentTrace = result;
    //     })

    //   }
    //   else {
    //     this.showUpdateErrorMessage = true;
    //     this.showUpdateMessage = false;
    //     setTimeout(function () {
    //       this.showUpdateErrorMessage = false;
    //     }.bind(this), 5000);
    //     const spanName = "preference-update-btn";
    //     let attributes = {
    //       userId: this._pocnLocalStorageManager.getData("userId"),
    //       firstName: this._pocnLocalStorageManager.getData("firstName"),
    //       lastName: this._pocnLocalStorageManager.getData("lastName"),
    //       userEmail:this._pocnLocalStorageManager.getData("userEmail"),
    //     }
    //     const eventName = 'preference update';
    //     const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'Failed', 'message': 'failed to update preferences' }
    //     this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
    //         this.telemetry.parentTrace = result;
    //     })
    //   }
    // }, 3500);
    // this.content.scrollToTop(3000);
  }

  removeAreaInterestConfirmed(e: any) {
    const index: number = this.areaDetails.indexOf(e);
    if (index !== -1) {
      let filter;
      filter = this.specialityType.filter(x => x.specialtyName === e.specialtyName);
      let filterIndex = this.specialityType.findIndex(x => x.specialtyName === e.specialtyName);

      if (filter.length > 0) {
        this.specialityTypeEnabled[filterIndex] = false;
      }
      this.areaDetails.splice(index, 1);
      this.areaPrimary.splice(index, 1);
      this.topicsOfInterestList = []; // empty the topics select list
      this.getGeneralTopicType();
      this.areaDetails.forEach(field => {
        this._pocnService.getTherapeuticArea(this.token, field.specialtyCode).subscribe(({ data }) => {
          if (data['getTherapeuticAreasSpecCode']['data'] != null) {
            data['getTherapeuticAreasSpecCode']['data'].forEach((field, item) => {
              let index = this.topicsOfInterestList.findIndex(x => x.title === field.therapeuticAreas);
              if(index === -1) {
                this.topicsOfInterestList.push({title: field.therapeuticAreas })
              }
            })
          }
        })
      });
      //update the topics list and ui display
      setTimeout(() => {
        if (this.topicsOfInterestList != null) {
          this.topicsOfInterestList.forEach((field, index) => {
            if (field.topic != '') {
              this.topicAreaListTemp.push({ title: field.topic });
            } else {
              this.topicAreaListTemp.push({ });
            }
          });
        }
        const result = this.topicsOfInterestList.filter((a) => this.topicAreaListTemp.some((b) => a.title === b.title));
          this.topicAreaListTemp = result;
        }, 1500);
    }
    if (this.areaDetails.length < 3) {
      this.interestSelectionLimit = false;
      this.interestSelectionAddButton = true;
    }
  }
  getMasterOpportunities() {
    let oppertunity = [];
    this._pocnService.getMasterOpportunities().subscribe(({ data }) => {
      this.masterOpportunities = data['masterOpportunities'].edges;
      this.masterOpportunities.forEach((masterOpportunities, index) => {
        oppertunity.push({
          id: masterOpportunities.node.id,
          title: masterOpportunities.node.title,
        });
      });

      this.masterOpportunitiesData1 = oppertunity[0].title;
      this.masterOpportunitiesData2 = oppertunity[1].title;
      this.masterOpportunitiesData3 = oppertunity[2].title;
      this.masterOpportunitiesData4 = oppertunity[3].title;
      this.masterOpportunitiesData5 = oppertunity[4].title;
      this.masterOpportunitiesData6 = oppertunity[5].title;
      this.masterOpportunitiesData7 = oppertunity[6].title;
      this.masterOpportunitiesData8 = oppertunity[7].title;
    })
  }
  removeTopicConfirmed(e: string) {
    const index: number = this.topicAreaListTemp.indexOf(e);
    if (index !== -1) {
      this.topicAreaListTemp.splice(index, 1);
    }
  }
  getUserOpportunity() {
    this._pocnService.getUserOpportunity(this.token).subscribe(({ data }) => {
      let opportunityData = [];
      opportunityData = data['getUserOpportunity'].data;
      let oppLiveList = [];
      let webinarOppsList = [];
      let emailOppsList = [];
      let marketOppsList = [];
      let eduOppsList = [];
      let authoringOppsList = [];
      let socialOppsList = [];
      let clinicalOppsList = [];
      let filter = [];
      /* this.liveOpps.forEach((val, i) => {
        filter = opportunityData.filter(x => x.opportunityValue === val.name);
        if (filter.length > 0 && filter[0].opportunityValue !== '') {
          oppLiveList.push({ isChecked: true, name: val.name, value: filter[0].opportunityValue, id: val.id, oppId: val.oppId })
        } else {
          oppLiveList.push(val);
        }
      })
      this.liveOpps = oppLiveList; */

      /* this.webinarOpps.forEach((val, i) => {
        filter = opportunityData.filter(x => x.opportunityValue === val.name);
        if (filter.length > 0 && filter[0].opportunityValue !== '') {
          webinarOppsList.push({ isChecked: true, name: val.name, value: filter[0].opportunityValue, id: val.id, oppId: val.oppId })
        } else {
          webinarOppsList.push(val);
        }
      })
      this.webinarOpps = webinarOppsList; */

      /* this.emailOpps.forEach((val, i) => {
        filter = opportunityData.filter(x => x.opportunityValue === val.name);
        if (filter.length > 0 && filter[0].opportunityValue !== '') {
          emailOppsList.push({ isChecked: true, name: val.name, value: filter[0].opportunityValue, id: val.id, oppId: val.oppId })
        } else {
          emailOppsList.push(val);
        }
      })
      this.emailOpps = emailOppsList; */

      /* this.marketOpps.forEach((val, i) => {
        filter = opportunityData.filter(x => x.opportunityValue === val.name);
        if (filter.length > 0 && filter[0].opportunityValue !== '') {
          marketOppsList.push({ isChecked: true, name: val.name, value: filter[0].opportunityValue, id: val.id, oppId: val.oppId })
        } else {
          marketOppsList.push(val);
        }
      })
      this.marketOpps = marketOppsList; */

      /* this.eduOpps.forEach((val, i) => {
        filter = opportunityData.filter(x => x.opportunityValue === val.name);
        if (filter.length > 0 && filter[0].opportunityValue !== '') {
          eduOppsList.push({ isChecked: true, name: val.name, value: filter[0].opportunityValue, id: val.id, oppId: val.oppId })
        } else {
          eduOppsList.push(val);
        }
      })
      this.eduOpps = eduOppsList; */

      /* this.authoringOpps.forEach((val, i) => {
        filter = opportunityData.filter(x => x.opportunityValue === val.name);
        if (filter.length > 0 && filter[0].opportunityValue !== '') {
          authoringOppsList.push({ isChecked: true, name: val.name, value: filter[0].opportunityValue, id: val.id, oppId: val.oppId })
        } else {
          authoringOppsList.push(val);
        }
      })
      this.authoringOpps = authoringOppsList; */

      /* this.socialOpps.forEach((val, i) => {
        filter = opportunityData.filter(x => x.opportunityValue === val.name);
        if (filter.length > 0 && filter[0].opportunityValue !== '') {
          socialOppsList.push({ isChecked: true, name: val.name, value: filter[0].opportunityValue, id: val.id, oppId: val.oppId })
        } else {
          socialOppsList.push(val);
        }
      })
      this.socialOpps = socialOppsList; */

      /* this.clinicalOpps.forEach((val, i) => {
        filter = opportunityData.filter(x => x.opportunityValue === val.name);
        if (filter.length > 0 && filter[0].opportunityValue !== '') {
          clinicalOppsList.push({ isChecked: true, name: val.name, value: filter[0].opportunityValue, id: val.id, oppId: val.oppId })
        } else {
          clinicalOppsList.push(val);
        }
      })
      this.clinicalOpps = clinicalOppsList; */
    })
  }

  updatePrimaryAreaNew(i: any, e: any) {
    setTimeout(() => {
      this.areaDetails.forEach((val,index) => {
        if(this.areaDetails.includes(e.detail.value)) {
        } else {
            this.areaDetails[i].isPrimary = e.detail.value;
            this.areaDetails[i].isChecked = true;
        }
        if(val.isPrimary == e.detail.value && i != index){
          this.areaDetails[index].isPrimary = 0;
          this.areaDetails[index].isChecked = false;
          this.areaDetails[i].isPrimary = e.detail.value;
          this.areaDetails[i].isChecked = true;
        }
      })
    }, 0);
  }


  ionViewDidEnter() {
    this.getSpecialityType();
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
    });
  }
  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }
  async removeAreaInterest(e:any) {
    const popover = await this.modalController.create({
      component: DeletePreferenceAreasPage,
      cssClass: 'reject-modal',
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if(modalDataResponse.data == 'confirm-delete'){
        this.removeAreaInterestConfirmed(e);
      }
    });
    await popover.present();
  }

  async removeTopic(e:any) {
    const popover = await this.modalController.create({
      component: DeletePreferenceAreasPage,
      cssClass: 'reject-modal',
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if(modalDataResponse.data != '' && modalDataResponse.data != undefined){
        this.removeTopicConfirmed(e);
      }
    });
    await popover.present();
  }
  async close(){
    await this.modalController.dismiss();
  }
  channelClicked(e:any,channel:string){
    let filter = this.channels.filter(x => x.name === channel);
    if(channel == 'SMS' && this.channels[0].isChecked == false){
      setTimeout(() => {
        this.smsInput();
      }, 1500);
    }
    if(channel == 'Email'){
      let filterEmail = this.channels.filter(x => x.name === "Email");
      filter[0].value = this._pocnLocalStorageManager.getData("userEmail");;
    }
  }

  async smsInput() {
    if(this.profileMobileNumber == '' || this.profileMobileNumber == null){
      const popover = await this.modalController.create({
        component: PreferenceSmsModalPage,
        cssClass: 'preference-sms-modal',
      });
      popover.onDidDismiss().then((modalDataResponse:any) => {
        if(modalDataResponse.data !=undefined){
          if(modalDataResponse.data.mobileEntered != '' && modalDataResponse.data.validMobileCheck == "1"){  // and number inputted is valid one, then set it ready to pass in mutation
            let filter = this.channels.filter(x => x.name === "SMS");
            filter[0].value = modalDataResponse.data.mobileEntered;
            this.updateChannelPreferences();
          }
          else{
            let filter = this.channels.filter(x => x.name === "SMS");
            filter[0].isChecked = false;
          }
        }
        else{
          let filter = this.channels.filter(x => x.name === "SMS");
          filter[0].isChecked = false;
        }
      });
      await popover.present();
    }
  }
  getUserMobileNumber(){
    this._pocnService.getUserMobileNumber(this.token).subscribe(({ data }) => {
      this.profileMobileNumber = data['getUserMobileNumber'].data;
      let filter = this.channels.filter(x => x.name === "SMS");
      filter[0].value = this.profileMobileNumber;
    });
  }
  async primarySpecilaityAlertPopOver(message:string) {
    const popover = await this.modalController.create({
      component: PreferenceAlertPopoverPage,
      cssClass: 'phonealert-modal',
      componentProps: {message: message }
    });
    popover.onDidDismiss().then((modalDataResponse) => {
    });
    await popover.present();
  }
}
