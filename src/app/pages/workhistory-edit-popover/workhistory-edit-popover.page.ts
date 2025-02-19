
  import { Component, OnInit, Input, ViewChild } from '@angular/core';
  import { Router } from '@angular/router';
  import { ModalController } from '@ionic/angular';
  import { DataService } from 'src/app/services/data.service';
  import { GraphqlDataService } from './../../services/graphql-data.service';
  import { CookieManager } from "./../../services/cookie-manager";
  import { LocalStorageManager } from "./../../services/local-storage-manager";
  import { Source,EmploymentNode, UserProfileImage, UserResume, AddressNode, ContactNode, DegreeNode, SpecialityNode, StateNode, educationNode} from './../../services/type';
  import { DomSanitizer } from '@angular/platform-browser';
  import { TokenManager } from "./../../services/token-manager";
  import { NgForm } from '@angular/forms';
  import { AlertController } from '@ionic/angular';
  import { PopoverController } from "@ionic/angular";
  import { ActionSheetController } from '@ionic/angular';
  import { IonSlides, Platform } from '@ionic/angular';
  import { IonContent } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-workhistory-edit-popover',
  templateUrl: './workhistory-edit-popover.page.html',
  styleUrls: ['./workhistory-edit-popover.page.scss'],
})
export class WorkhistoryEditPopoverPage implements OnInit {
  @Input() userAgent: string;
  @Input() deviceType: string;
  @ViewChild(IonSlides) mySlider: IonSlides;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  showCustomAddBtn: boolean = false; 
  statusMessage = false;
  NextSlide = 'Next';
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
  setLoader: boolean = true;
  searchData = [];
  noSpacesRegex = /.*\S.*/;
  workSuccess: boolean = true;
  selectEmployerMsg: boolean = false; 
  selectedItem : number;
  npRadio;
  paRadio;
  showOptionForCustomAdd: boolean = false; 
  showOptionForCustomAddInput: boolean = false; 
  customHealthOrganization;
  public token;
  public person;
  public hcoList;
  yearDiff: any;
  yearLabel: any;
  monthLabel: any;  selectWrapper;
  disablePrevBtn = true;
  disableNextBtn = false;
  selectOptions;
  eduList: educationNode[] = [];
  degreeType: DegreeNode[] = [];
  yearHistory: number[] = [];
  monthHistory: Source[] = [];
  employmentType: EmploymentNode[] = [];
  stateList: StateNode[] = [];
  @Input() key1: number;
  workHistoryList = [];
  workYearCheck = false;
  firstSlide:boolean = true;
  lastSlide:boolean = false;
  public slideOpts = {
    autoHeight: true,
    slidesPerView: 1,
    spaceBetween: 1,
    static: true,
    centeredSlides: true,
    allowTouchMove: false
  };
  tempStartYeart = {id:"",val:""}
  public yearHistoryTemp: any[] = [];
  tempStartYear = [];
  tempEndYear = [];
  tempStartMonth = [];
  tempEndMonth = [];
  currentHcoDmcId: string;
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
      const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "edit-workhistry-popover";
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
      this.getHcoList();
      this.getEmploymentType();
      this.getStates();
    }
    getStates = () => {
      this._pocnService.getStates().subscribe(({ data }) => {
        this.stateList = data.states.nodes;
      });
    }
    getEmploymentType = () => {
      this._pocnService.getEmploymentType().subscribe(({ data }) => {
      this.employmentType = data.employmentTypes.nodes;
      });
    }
    getHcoList = () => {
      this._pocnService.getHcoList().subscribe(({ data }) => {
        this.hcoList = data.hcoMasters.nodes;
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
    ScrollToTop(){
      //this.content.scrollToTop(1500);
    }
    getYearHistory = () => {
      let range = (start: number, end: number) => Array.from(Array(end - start + 1).keys()).map(x => x + start);
      this.yearHistory = range(1950, (new Date()).getFullYear()-1);
      this.yearHistory.forEach((val, i) => {
        this.yearHistoryTemp.push({
          id: (val).toString(),
          val: (val).toString(),
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
   
    slidePrev() {
      this.mySlider.slidePrev();
    }
    slideNext() {
      this.mySlider.slideNext();
    }
    getUserProfile() {
      let workHistoryDetails = [];
      let workHistoryData = [];
      this._pocnService.getUserProfile(this.token)?.subscribe(({ data }) => {
       workHistoryDetails = data['getUserFullProfile'].data['userExperienceProfile'];
        this.currentHcoDmcId = workHistoryDetails[this.key1].hcoDmcid;
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
          if(workHistoryData['experienceTitle']!=''){
            let yearStartObj = {
              id: workHistoryData['startYear'],
              val: workHistoryData['startYear']
            };
            this.tempStartYear.push(yearStartObj);
            if(workHistoryData['endYear'] === 'null'){
              let yearEndObj = {
                id: '',
                val: ''
              }
              this.tempEndYear.push(yearEndObj);
            }
            else{
              let yearEndObj = {
                id: workHistoryData['endYear'],
                val: workHistoryData['endYear']
              }
              this.tempEndYear.push(yearEndObj);
            }
            if(workHistoryData['endMonth'] == ''){
              let monthEndObj = {
                id: '',
                name: ''
              }
              this.tempEndMonth.push(monthEndObj);
            }
            else{
              let endMonthId =  this.monthHistory.filter((obj) => {
                return obj.name === workHistoryData['endMonth'];
              });
              let monthEndObj = {
                id: endMonthId[0].id,
                name: workHistoryData['endMonth']
              }
              this.tempEndMonth.push(monthEndObj);
            }
            if(workHistoryData['startMonth'] == ''){
              let monthStartObj = {
                id: '',
                name: ''
              }
              this.tempStartMonth.push(monthStartObj);
            }
            else{
              let startMonthId =  this.monthHistory.filter((obj) => {
                return obj.name === workHistoryData['startMonth'];
              });
              let monthStartObj = {
                id: startMonthId[0].id,
                name: workHistoryData['startMonth']
              };
              this.tempStartMonth.push(monthStartObj);
            }
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
              endYear: this.tempEndYear[index],
              startMonth:this.tempStartMonth[index],
              endMonth:this.tempEndMonth[index],
              diffYear:this.yearDiff,
          }); 
        }
        });
        this.setLoader = false;
      },
      (error) => {
        // this.router.navigate(['/'])
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
        // whitespace validation
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
          endDateString  = new Date("01/"+f.value['endMonth'].id+"/"+f.value['startYear'].val);
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
          return obj.hcoName === ed.healthOrganization;
        });

        let dmcid;
        if (hcoSelected != null && hcoSelected.length > 0){
          dmcid = hcoSelected[0].hcoDmcid
        }
        else{
           dmcid = 0;
           ed.healthOrganization = (this.customHealthOrganization) ? this.customHealthOrganization: ed.healthOrganization;
        }
        //  if( ed.healthOrganization != '' && hcOrgNameCheck == false && ed.startMonth != '' && ed.startYear != ''  && !this.workYearCheck) {
          workHistory.push({
            description: ed.description,
              endYear: (this.tempEndYear[index].val).toString(),
              experienceTitle: ed.experienceTitle,
              hcoCountry: "",
              hcoDmcid: dmcid,
              hcoLocality: ed.hcoLocality,
              hcoName: ed.healthOrganization,
              hcoPostcode: "",
              hcoStateProvince: ed.hcoStateProvince,
              npi: this.person.userBasicProfile.npi,
              providerId: this.person.userBasicProfile.providerId,
              userId:this._pocnLocalStorageManager.getData("userId"),
              //startYear: ed.startYear,
              startYear: (this.tempStartYear[index].val).toString(),
              employmentType:ed.employmentType,
              startMonth:this.tempStartMonth[index].name,
              endMonth:(this.tempEndMonth[index].name !== undefined) ? this.tempEndMonth[index].name : '',
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
      if(!this.workYearCheck) {
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


                this.getUserProfile();
                const spanName = "profile-workhistory-edit-btn";
                let attributes = {
                    userId: this._pocnLocalStorageManager.getData("userId"),
                    firstName: this._pocnLocalStorageManager.getData("firstName"),
                    lastName: this._pocnLocalStorageManager.getData("lastName"),
                    userEmail:this._pocnLocalStorageManager.getData("userEmail")
                }
                const eventName = 'profile workhistory edit';
                const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated workhistory data' }
                this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                    this.telemetry.parentTrace = result;
                })
                this.modalController.dismiss('workhistory');
              }
            }
          });
      }
      this.workSuccess = true;
    }
    public async ionSlideDidChange(): Promise<void> {
      let prom1 = this.mySlider.isBeginning();
      let prom2 = this.mySlider.isEnd();
      Promise.all([prom1, prom2]).then((data) => {
        data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
        data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
      });
      const index = await this.mySlider.getActiveIndex();
      let me = this;
      me.mySlider.isEnd().then((istrue) => {
        if (istrue) {
          me.NextSlide = 'Edit work Experience';
          this.lastSlide = true;
        } else {
          this.lastSlide = false;
          me.NextSlide = 'Next';
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

    swipeNext1(mySlider,f,selectedItem){
      this.selectEmployerMsg = false;
      setTimeout(() => {
        let searchResult=[];
        this._pocnService.getHcoListSearch(f.value['healthOrganization']).subscribe(({ data }) => {
          searchResult = JSON.parse(JSON.stringify(data['hcoMasters']['nodes'])); 
          if (searchResult.length === 0) {
            this.showCustomAddBtn = true;
            mySlider.slideNext();
          }
          else {
            this.showCustomAddBtn = false;
            if (searchResult.length > 1) {
              searchResult.forEach((field, index) => {
                if (index !== -1) {
                  searchResult.splice(index, 1);
                }
              })
              if(selectedItem == undefined){
                this.selectEmployerMsg = true;
              }          }
            this.swipeNextData(mySlider, f,searchResult);
          }
        }); 
      }, 1000);
  }
  swipeNextData(mySlider, f,searchResult){
    if(searchResult.length != 0){
      searchResult.forEach((field, index) => {
        if(f.valid==true){
          if(field.hcoName == f.value['healthOrganization']){
            mySlider.slideNext();
            if(this.NextSlide == 'Edit work Experience'){
              this.updateWorkHistory(f);
            }
          }
        }
      })
    }
    else{
      this.customHealthOrganization = f.value['customHco'];
      if(f.value['healthOrganization'] !=undefined && (this.currentHcoDmcId == '0' || this.showOptionForCustomAddInput === true) ){
        mySlider.slideNext();
        if(this.NextSlide == 'Edit work Experience'){
          this.updateWorkHistory(f);
        }
      }
    }
  }
  swipeNext2(mySlider,f){
    if(f.valid){
      mySlider.slideNext();
      if(this.NextSlide == 'Edit work Experience'){
        this.updateWorkHistory(f);
      }
    }
  }
  swipeNext3(mySlider,f){
      if(f.value['startMonth'].id!= '' && f.value['startYear'].val != ''){
      mySlider.slideNext();
      if(this.NextSlide == 'Edit work Experience'){
        this.updateWorkHistory(f);
      }
    }
  }
    tagsData(event,tags,index){
      this.workHistoryList[index].tags = tags;
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
  searchUser(searchText,index, event) {
    this.selectedItem = undefined;
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
      // this.showCustomAddBtn = false;
      if(searchText !=''){
        this._pocnService.getHcoListSearch(searchText).subscribe(({ data }) => {
          this.searchData = data['hcoMasters']['nodes']; 
          if (this.searchData.length == 0) {
            this.statusMessage = true;
            this.showCustomAddBtn = true;
          }
          else {
            this.statusMessage = false;
            this.showCustomAddBtn = false;
          }
        });
      }  
    event.srcEvent.stopPropagation();
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
  this.selectEmployerMsg = false;
  this.ScrollToBottom();
  this.selectedItem = i;
  this.workHistoryList[this.key1].healthOrganization = test.hcoName;
  this.workHistoryList[this.key1].hcoCountry = test.hcoCountry;
  this.workHistoryList[this.key1].hcoLocality = test.hcoLocality;
  this.workHistoryList[this.key1].hcoDmcid = test.hcoDmcid;
  this.hcoDetails = test;
  }
  addCustomHco(){
    this.showOptionForCustomAddInput = true;
    this.showOptionForCustomAdd = false;
    this.statusMessage = false;
    this.searchData = [];
  }
}

