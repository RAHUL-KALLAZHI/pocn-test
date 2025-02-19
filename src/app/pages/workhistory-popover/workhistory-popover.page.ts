import { Component, OnInit, Input,ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { Source,EmploymentNode, UserProfileImage, UserResume, AddressNode, ContactNode, DegreeNode, SpecialityNode, StateNode, educationNode} from './../../services/type';
import { Observable, Subscriber, ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenManager } from "./../../services/token-manager";
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { PopoverController } from "@ionic/angular";
import { ActionSheetController } from '@ionic/angular';
import { IonSlides, Platform } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-workhistory-popover',
  templateUrl: './workhistory-popover.page.html',
  styleUrls: ['./workhistory-popover.page.scss'],
})
export class WorkhistoryPopoverPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @Input() userAgent: string;
  @Input() deviceType: string;
  @Input() key1: string;
  @Input() states: [];
  @Input() hcoList: any;
  public token;
  // hcoDetails = [];
  hcoDetails = {
    hcoCountry: "",
    hcoDmcid: "",
    hcoLocality: "",
    hcoLocation: "",
    hcoLocationGlid: "",
    hcoLocationLat: "",
    hcoLocationLong: "",
    hcoPostCode: "",
    hcoStateProvince: "",
    hcoName: "",
    hcoType: ""
  }
  noSpacesRegex = /.*\S.*/;
  statusMessage = false;
  selectedItem : number;
  paRadio;
  npRadio;
  @ViewChild(IonSlides) mySlider: IonSlides;
  public person;
  searchData = [];
  workYearCheck: boolean = false; 
  showOptionForCustomAdd: boolean = false; 
  showOptionForCustomAddInput: boolean = false; 
  showCustomValidationError: boolean = false; 
  showCustomAddBtn: boolean = false; 
  selectEmployerMsg: boolean = false; 
  //public hcoList;
  customHealthOrganization;
  NextSlide = 'Next';
  yearDiff: any;
  yearLabel: any;
  monthLabel: any;  selectWrapper;
  selectOptions;
  eduList: educationNode[] = [];
  degreeType: DegreeNode[] = [];
  yearHistory: number[] = [];
  monthHistory: Source[] = [];
  employmentType: EmploymentNode[] = [];
  stateList: StateNode[] = [];
  tempEndYear = [{id:'', val:''}];
  tempStartYear = [{id:'', val:''}];
  tempEndMonth = [{id:'', name:''}];
  tempStartMonth = [{id:'', name:''}];
  public yearHistoryTemp: any[] = [];
  firstSlide:boolean = true;
  lastSlide:boolean = false;
  public workHistoryList: any[] = [{
    description: '',
        endYear: '',
        experienceTitle: '',
        hcoCountry: '',
        hcoDmcid: '',
        hcoLocality: '',
        hcoName: '',
        hcoPostcode: '',
        hcoStateProvince: '',
        npi: '',
        providerId: '',
        startYear: '',
        userId: '',
        tags: '',
        employmentType: '',
        startMonth: '',
        endMonth: '',
        healthOrganization: '',
  }];
  public slideOpts = {
    slidesPerView: 1,
    spaceBetween: 1,
    static: true,
    centeredSlides: true,
    allowTouchMove: false,
    autoHeight: true,
  };
  disablePrevBtn = true;
  constructor(
    private popover: PopoverController,
    private actionSheetCtrl: ActionSheetController,    
    private dataService: DataService,
    private modalController: ModalController,
    private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,
    private _sanitizer: DomSanitizer,
    private tokenManager: TokenManager,
    public alertController: AlertController,
    public telemetry: TelemetryService,
    ) { 
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-' + "add-workhistory-popover";
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
    this.getEducationList();
    this.getDegreeType();
    this.getYearHistory();
    this.getMonthHistory();
    this.getUserProfile();
    this.getEmploymentType();
    this.stateList = this.states
  }
  ScrollToTop(){
   // this.content.scrollToTop(1500);
  }
  getEmploymentType = () => {
    this._pocnService.getEmploymentType().subscribe(({ data }) => {
    this.employmentType = data.employmentTypes.nodes;
    });
  }
  getEducationList = () => {
    this._pocnService.getEducationList().subscribe(({ data }) => {
      this.eduList = data.educationMasters.nodes;
    });
  }
  getDegreeType = () => {
    this._pocnService.getDegreeType().subscribe(({ data }) => {
    this.degreeType = data.masterDegrees.nodes;
    });
  }
  getYearHistory = () => {
    let range = (start: number, end: number) => Array.from(Array(end - start + 1).keys()).map(x => x + start);
    this.yearHistory = range(1950, (new Date()).getFullYear()-1);
    this.yearHistory.forEach((val, i) => {
      this.yearHistoryTemp.push({
       id: i,
       val: val,
       });
     });
  }
  getMonthHistory = () => {
    this.monthHistory = [
      { id: '1', name: 'Jan' },
      { id: '2', name: 'Feb' },
      { id: "3", name: 'Mar' },
      { id: "4", name: 'Apr' },
      { id: "5", name: 'May' },
      { id: "6", name: 'Jun' },
      { id: "7", name: 'Jul' },
      { id: '8', name: 'Aug' },
      { id: '9', name: 'Sep' },
      { id: "10", name: 'Oct' },
      { id: "11", name: 'Nov' },
      { id: "12", name: 'Dec' }
    ]
  }
  async close() {
    await this.modalController.dismiss();
  }
  getUserProfile() {
    let workHistoryDetails = [];
    let workHistoryData = [];
    this._pocnService.getUserProfile(this.token)?.subscribe(({ data }) => {
     workHistoryDetails = data['getUserFullProfile'].data['userExperienceProfile'];
      this.person = data['getUserFullProfile'].data;
      workHistoryDetails.forEach((field, index) => {
        workHistoryData = field;
        let dateToString = new Date("01/"+workHistoryData['endMonth']+"/"+workHistoryData['endYear']);
        let dateFromString = new Date("01/"+workHistoryData['startMonth']+"/"+workHistoryData['startYear']);
        let yearsnew = Math.floor(this.calculateDiff(dateToString, dateFromString) / 365);
        let monthsnew = Math.floor(this.calculateDiff(dateToString, dateFromString) % 365 / 30);
        if (yearsnew>1){
          this.yearLabel = yearsnew + " Years "
        }
        else if(yearsnew == 1){
          this.yearLabel = yearsnew +" Year "
        }
        else{
          this.yearLabel = '';
        }
  
        if (monthsnew>1){
          this.monthLabel = monthsnew + " Months "
        }
        else if(monthsnew == 1){
          this.monthLabel = monthsnew +" Month "
        }
        else{
          this.monthLabel = '';
        }
        this.yearDiff = this.yearLabel + this.monthLabel;
        let yearStartObj = {
          id: workHistoryData['startYear'],
          val: workHistoryData['startYear']
        };
        this.tempStartYear.push(yearStartObj);

        let yearEndObj = {
          id: workHistoryData['endYear'],
          val: workHistoryData['endYear']
        };
        this.tempEndYear.push(yearEndObj);

        let monthStartObj = {
          id: workHistoryData['startMonth'],
          name: workHistoryData['startMonth']
        };
        this.tempStartMonth.push(monthStartObj);

        let monthEndObj = {
          id: workHistoryData['endMonth'],
          name: workHistoryData['endMonth']
        };
        this.tempEndMonth.push(monthEndObj);
        this.workHistoryList.push({   // showing in ui form
          experienceTitle: workHistoryData['experienceTitle'],
          hcoStateProvince: workHistoryData['hcoStateProvince'],
          description: workHistoryData['description'],
          tags: workHistoryData['tags'],
          healthOrganization: workHistoryData['healthOrganization'],
          employmentType: workHistoryData['employmentType'],
          hcoLocality:workHistoryData['hcoLocality'],
          hcoSubType:workHistoryData['hcoName'],
          startYear:this.tempStartYear[index],
          endYear:this.tempEndYear[index],
          startMonth:this.tempStartMonth[index],
          endMonth:this.tempEndMonth[index],
          diffYear:this.yearDiff,
        });
      });
    },
    (error) => {
      this.router.navigate(['/'])
    });
  }
  calculateDiff(dateTo, dateStart){
    dateStart = new Date(dateStart);
    dateTo = new Date(dateTo);
    return Math.floor((Date.UTC(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate()) - Date.UTC(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate()) ) /(1000 * 60 * 60 * 24));
  }
  updateWorkHistory = (f:NgForm) => {
    let workHistory = [];
    let workHistoryData = [];
    let diffYears;
    let diffMonths;
    let hcOrgNameCheck = false;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this.workHistoryList.forEach((ed, index) => {
    if(ed.healthOrganization != ''){
      //whitespace validation
      if (!ed.healthOrganization.replace(/\s/g, '').length) {
        hcOrgNameCheck = true;
      } else {
        hcOrgNameCheck = false;
      }
      workHistoryData = ed;
      let startDateString = new Date("01/"+f.value['startMonth'].id+"/"+f.value['startYear'].val);
      let endDateString = new Date("01/"+f.value['endMonth'].id+"/"+f.value['endYear'].val);
      if(f.value['endMonth'].id && f.value['endYear'].val){
        diffYears = Math.floor(this.calculateDiff(endDateString, startDateString) / 365);
        diffMonths = Math.floor(this.calculateDiff(endDateString, startDateString) % 365 / 30);
      }
      else if(!f.value['endMonth'].id && f.value['endYear'].val){
        diffYears = f.value['endYear'].val - f.value['startYear'].val;
      }
      else if(f.value['endMonth'].id && !f.value['endYear'].val){
        endDateString  = new Date("01/"+f.value['endMonth']+"/"+f.value['startYear']);
        diffMonths = Math.floor(this.calculateDiff(endDateString, startDateString) % 365 / 30);
      }
      if (diffYears < 0 || diffMonths < 0){
       this.workYearCheck = true;
      }    
      else{
       this.workYearCheck = false;
      }
      this.workHistoryList[index]['workYearCheck'] = this.workYearCheck;
      let hcoSelected =  this.hcoList.filter((obj) => {
        return obj.hcoName == ed.healthOrganization;
      });

      let dmcid;
      if (hcoSelected != null && hcoSelected.length > 0){
        dmcid = hcoSelected[0].hcoDmcid
      }
      else{
         dmcid = 0;
         ed.healthOrganization = (this.customHealthOrganization) ? this.customHealthOrganization: ed.healthOrganization;
      }
      workHistory.push({
        description: ed.description,
          endYear: (this.tempEndYear[index].val).toString(),
          experienceTitle: ed.experienceTitle,
          hcoCountry: "",
          hcoDmcid: dmcid,
          hcoLocality: ed.hcoLocality,
          //hcoName: ed.healthOrganization,
          hcoName: ed.healthOrganization,
          hcoPostcode: "",
          hcoStateProvince: ed.hcoStateProvince,
          npi: this.person.userBasicProfile.npi,
          providerId: this.person.userBasicProfile.providerId,
          userId:this._pocnLocalStorageManager.getData("userId"),
          startYear: (this.tempStartYear[index].val).toString(),
          employmentType:ed.employmentType,
          startMonth:(this.tempStartMonth[index].name).toString(),
          endMonth:(this.tempEndMonth[index].name).toString(),
          healthOrganization:ed.healthOrganization,
          tags:ed.tags,
          jobTitle:"",
          hcoSubtype:"",
          hcoStatus:"",
          hcoAddress:"",
          hcoUnit:"",
      });  
    }
    });
    if(!this.workYearCheck){
      this._pocnService.updateWorkHistory(workHistory,token).subscribe(
        (response: any) => {
          if (response.data) {
            if (response.data.updateUserExperience.userProfileUpdateResponse.status === 'Success') {
              let logDetaiils = {
                accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
                npi: this.person.userBasicProfile.npi,
                logType: "Profile Update",
                channel: this.userAgent,
                ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
                ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
                device: this.deviceType,
                geoLocation: "",
                description: "Updated profile workhistory record",
                activity: "Profile Workhistory Update",
              }
              this._pocnService.updateUserLog(logDetaiils).subscribe((response: any) => {});
              const spanName = "profile-workhistory-add-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'profile workhistory add';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully added new workhistory data' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.modalController.dismiss('workhistory');
            }
          }
        });       
    }
  }
  public async ionSlideDidChange(): Promise<void> {
    let prom1 = this.mySlider.isBeginning();
    let prom2 = this.mySlider.isEnd();
    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
    });
    const index = await this.mySlider.getActiveIndex();
    let me = this;
    me.mySlider.isEnd().then((istrue) => {
      if (istrue) {
        me.NextSlide = 'Add work Experience';
        this.lastSlide = true;
      } else {
        me.NextSlide = 'Next';
        this.lastSlide = false;
      }
    });
    me.mySlider.isBeginning().then((istrue) => {
      if (istrue) {
        this.firstSlide = true;
        this.showCustomAddBtn = false;
      } else {
        this.firstSlide = false;
      }
    });
  }
  slidePrev() {
    this.mySlider.slidePrev();
  }
  slideNext() {
    this.mySlider.slideNext();
  }
  customSwipeNext1(mySlider,f,i){
    this.selectedItem = undefined;
    setTimeout(() => {
    if(this.searchData.length > 0 ){
      this.showCustomAddBtn = false;
    }
    else{
      if(f.value['healthOrganization'] !=undefined && f.value['healthOrganization'] != ''){
        mySlider.slideNext();
        if(this.NextSlide == 'Add work Experience'){
          this.updateWorkHistory(f);
        }
      }
    }
    }, 1000);
  }
  swipeNext1(mySlider,f,i){
    this.selectEmployerMsg = false;
    setTimeout(() => {
      if(f.valid===true && this.searchData.length > 0 ){
        if(i!=undefined){
          mySlider.slideNext();
        }
        else{
          this.selectEmployerMsg = true;
        }
        if(this.NextSlide == 'Add work Experience'){
          this.updateWorkHistory(f);
        }
        this.showCustomAddBtn = false;
      }
      else{
        if(f.value['healthOrganization'] !=undefined && f.value['healthOrganization']!= '' && this.showCustomAddBtn == true){
          this.showCustomAddBtn = true;
          if(this.NextSlide == 'Add work Experience'){
            this.updateWorkHistory(f);
          }
        }
      }
    }, 1000);
  }
  swipeNext2(mySlider,f){
    if(f.valid){
      mySlider.slideNext();
      if(this.NextSlide == 'Add work Experience'){
        this.updateWorkHistory(f);
      }
    }
  }
  swipeNext3(mySlider,f){
    if(f.value['startMonth']!= '' && f.value['startYear'].val != ''){
      mySlider.slideNext();
      if(this.NextSlide == 'Add work Experience'){
        this.updateWorkHistory(f);
      }
    }
  }
  experienceTitleData(event,title,index){
    this.workHistoryList[index].experienceTitle = title;
  }
  emplyementType(event,emplyementType,index){
    this.workHistoryList[index].employmentType = emplyementType;
  }
  startDate(event,startDate,index){
    this.workHistoryList[index].startMonth = startDate;
  }
  startYear(event,startYear,index){
    this.workHistoryList[index].startYear = startYear;
  }
  endMonth(event,endMonth,index){
    this.workHistoryList[index].endMonth = endMonth;
  }
  endYear(event,endYear,index){
    this.workHistoryList[index].endYear = endYear;
  }
  descriptionData(event,description,index){
    this.workHistoryList[index].description = description;
  }
  tagsData(event,tags,index){
    this.workHistoryList[index].tags = tags;
  }
  searchUser(searchText,index) {
    this.hcoDetails = {
      hcoCountry: "",
      hcoDmcid: "",
      hcoLocality: "",
      hcoLocation: "",
      hcoLocationGlid: "",
      hcoLocationLat: "",
      hcoLocationLong: "",
      hcoPostCode: "",
      hcoStateProvince: "",
      hcoName: "",
      hcoType: ""
    }; 
    if(searchText !=''){
      this.selectedItem = undefined;
      this._pocnService.getHcoListSearch(searchText).subscribe(({ data }) => {
        this.searchData = data['hcoMasters']['nodes'];
        if (this.searchData.length === 0) {
          this.statusMessage = true;
          this.showCustomAddBtn = true;
        }
        else {
          this.showCustomAddBtn = false;
          this.statusMessage = false;
        }
      });
   }
}
updateActive(i){
  this.selectedItem = i;
}
ScrollToBottom(){
  setTimeout(() => {
    this.content.scrollToBottom(1500);
  }, 700);    
}
selectSearchData(test,i){
// this.selectedItem[i] = true;
this.selectEmployerMsg = false;
this.ScrollToBottom();
this.selectedItem = i;
this.workHistoryList[0].healthOrganization = test.hcoName;
this.workHistoryList[0].hcoCountry = test.hcoCountry;
this.workHistoryList[0].hcoLocality = test.hcoLocality;
this.workHistoryList[0].hcoDmcid = test.hcoDmcid;
this.hcoDetails = test;
}
addCustomHco(){
  this.showOptionForCustomAddInput = true;
  this.showOptionForCustomAdd = false;
  this.statusMessage = false;
  this.searchData = [];
}
}

