import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { Source, DegreeNode, educationNode } from './../../services/type';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenManager } from "./../../services/token-manager";
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { PopoverController } from "@ionic/angular";
import { ActionSheetController } from '@ionic/angular';
import { IonSlides, Platform } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { SettingsPageRoutingModule } from '../settings/settings-routing.module';
@Component({
  selector: 'app-education-popover',
  templateUrl: './education-popover.page.html',
  styleUrls: ['./education-popover.page.scss'],
})
export class EducationPopoverPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild(IonSlides) mySlider: IonSlides;
  @Input() userAgent: string;
  @Input() deviceType: string;
  NextSlide = 'Next';
  hcoDetails = {
    id: "",
    hcoName: "",
    hcoDmcid: "",
  }
  
  searchData;
  searchDataResult = [];
  statusMessage = false;
  selectedItem : number;
  public token;
  public active: string;
  public person;
  eduList: educationNode[] = [];
  degreeType: DegreeNode[] = [];
  yearHistory: number[] = [];
  monthHistory: Source[] = [];
  tempYear = [{id:'', val:''}];
  temp = [{degreeCode:'', degreeGroupCode:'', degreeGroupName:'', degreeId:'', degreeName:''}];

  disablePrevBtn = true;
  public yearHistoryTemp: any[] = [];
  public educationList: any[] = [{
    school: '',
    hcoDegree: '',
    field: '',
    periodFfrom: '',
    periodTo: '',
    description: '',
    year: {id:'',val:''}
  }];
  eduSuccess: boolean = true;
  slideOpts;
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
      this.slideOpts = {
        onInit: function (mySlider) {
          mySlider.lockSwipes();
          //slides.unlockSwipes();
        }
      }
  }
  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "add-education-popover";
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
  }
  updateActive(i){
    this.selectedItem = i;
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
    this.yearHistory = range(1950, (new Date()).getFullYear() - 1);
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
    let educationDetails = [];
    let educationData = [];
    this._pocnService.getUserProfile(this.token)?.subscribe(({ data }) => {
      educationDetails = data['getUserFullProfile'].data['userEducationProfile'];
      this.person = data['getUserFullProfile'].data;
      educationDetails.forEach((field, index) => {
        educationData = field;
        let yearObj = {
          id: educationData['hcpGraduationYear'],
          val: educationData['hcpGraduationYear']
        };
        this.tempYear.push(yearObj);
        this.educationList.push({
          school: educationData['hcoName'],
          field: educationData['hcoSubtype'],
          year: this.tempYear[index],
          hcoDegree: educationData['hcoDegree'],
          description: educationData['description'],
        });

        let degreeTemp =  this.degreeType.filter((obj) => {
          return obj.degreeName === educationData['hcoDegree'];
        });
        let edObj = {
          degreeCode: degreeTemp[0].degreeCode,
          degreeGroupCode: degreeTemp[0].degreeGroupCode,
          degreeGroupName: degreeTemp[0].degreeGroupName, 
          degreeId: (degreeTemp[0].degreeId).toString(),
          degreeName: degreeTemp[0].degreeName
        };
        this.temp.push(edObj);
      });
    },
    (error) => {
      this.router.navigate(['/'])
    });
  }
  updateEducation = (f: NgForm) => {
    let education = [];
    let schoolCheck = false;
    this.educationList.forEach((ed, index) => {
      if (!ed.school.replace(/\s/g, '').length) {
        schoolCheck = true;
      } else {
        schoolCheck = false;
      }
      if (ed.school != '') {
        let hcoSelected = this.eduList.filter((obj) => {
          return obj.hcoName === ed.school;
        });
        let dmcid;
        if (hcoSelected != null) {
          dmcid = hcoSelected[0].hcoDmcid;
        }
        else {
          dmcid = 0;
        }

        if(ed.school != '' && schoolCheck == false && this.temp[index].degreeName!= '' && this.tempYear[index].val!= ''){
          education.push({
            hcoName: ed.school,
            hcoDegree: this.temp[index].degreeName,
            hcoDmcid: dmcid,
            hcoStatus: 'Active',
            hcoSubtype: ed.field,
            hcpGraduationYear: (this.tempYear[index].val).toString(),
            description: ed.description,
            npi: this.person.userBasicProfile.npi,
            providerId: this.person.userBasicProfile.providerId,
            userId: this._pocnLocalStorageManager.getData("userId"),
          });
        } else{
          this.eduSuccess = false;
        }
      }
    });
    if(this.eduSuccess){
      this._pocnService.updateEducation(education, this.token).subscribe(
        (response: any) => {
          if (response.data) {
            if (response.data.updateUserEducation.userProfileUpdateResponse.status === 'Success') {
              let logDetaiils = {
                accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
                npi: this.person.userBasicProfile.npi,
                logType: "Profile Update",
                channel: this.userAgent,
                ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
                ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
                device: this.deviceType,
                geoLocation: "",
                description: "Updated profile education record",
                activity: "Profile Education Update",
              }
              this._pocnService.updateUserLog(logDetaiils).subscribe((response: any) => {});
              this.getUserProfile();
              const spanName = "profile-education-add-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'profile education add';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully added new education data' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.modalController.dismiss('education');
            }
          }
        }
      );
    }
    this.eduSuccess = true;
  }
  ionSlidesDidLoad(mySlider){
    mySlider.lockSwipes(true); 
  }
  public async ionSlideDidChange(mySlider): Promise<void> {
    let prom1 = this.mySlider.isBeginning();
    let prom2 = this.mySlider.isEnd();
  
    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
    });
    const index = await this.mySlider.getActiveIndex();
    let me = this;
    mySlider.lockSwipes(true); 
    me.mySlider.isEnd().then((istrue) => {
      if (istrue) {
        me.NextSlide = 'Add Education';
      } 
      else {
        me.NextSlide = 'Next';
        window.scrollTo(0, 0);
      }
    });
    // this.mySlider.slideNext();
  }
  ScrollToTop(){
    this.content.scrollToTop(1500);
  }
  ScrollToBottom(){
    setTimeout(() => {
      this.content.scrollToBottom(1500);
    }, 700);    
  }
  swipeNext(mySlider, f,selectedItem) {
    if(f.valid==true && this.searchData && this.searchData.length != 0 && selectedItem!=undefined ){
      mySlider.lockSwipes(false); 
      mySlider.slideNext();
      window.scrollTo(0, 0);
      if (this.NextSlide == 'Add Education') {
        this.updateEducation(f);
      }
    }
  }
  swipeNextSecond(mySlider, f) {
    if(f.valid==true){
      mySlider.lockSwipes(false); 
      mySlider.slideNext();
      window.scrollTo(0, 0);
      if (this.NextSlide == 'Add Education') {
        this.updateEducation(f);
      }
    }
  }

  hcoDegreeType(event, hcoDegree, index) {
    this.educationList[index].hcoDegree = hcoDegree;
  }
  graduationYear(event, graduationYear, index) {
    this.educationList[index].year = graduationYear;
  }
  fieldData(event, fieldData, index) {
    this.educationList[index].field = fieldData;
  }
  descriptionData(event, description, index) {
    this.educationList[index].description = description;
  }
  searchUser(searchText,index) {
    this._pocnService.getEducationSearch(searchText).subscribe(({ data }) => {
      this.searchData = data['educationMasters']['nodes'];
      if (this.searchData.length === 0) {
        this.statusMessage = true;
      }
      else {
        this.statusMessage = false;
      }
    });
  }
  selectSearchData(test,i){
    this.ScrollToBottom();
    this.selectedItem = i;
    this.educationList[0].healthOrganization = test.hcoName;
    this.educationList[0].school = test.hcoName;
    this.educationList[0].hcoDmcid = test.hcoDmcid;
    this.hcoDetails = test;
  }
  slidePrev() {
    this.mySlider.lockSwipes(false); 
    this.mySlider.slidePrev();
  }
}
