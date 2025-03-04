import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { Source, EmploymentNode, UserProfileImage, UserResume, AddressNode, ContactNode, DegreeNode, SpecialityNode, StateNode, educationNode } from './../../services/type';
import { Observable, Subscriber, ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenManager } from "./../../services/token-manager";
import { NgForm } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { PopoverController } from "@ionic/angular";
import { IonSlides, Platform } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-education-edit-popover',
  templateUrl: './education-edit-popover.page.html',
  styleUrls: ['./education-edit-popover.page.scss'],
})
export class EducationEditPopoverPage implements OnInit {
  @ViewChild(IonSlides) mySlider: IonSlides;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @Input() userAgent: string;
  @Input() deviceType: string;


  eduListTemp = {degreeCode: "CPNP-AC",degreeGroupCode: "NP/CNS",degreeGroupName: "NP/CNS",degreeId: "16",degreeName: "Acute Care Certified Pediatric Nurse Practitioner"};
  //eduListTemp: any;
  yearListTemp: [];

  NextSlide = 'Next';
  hcoDetails = {
    id: "",
    hcoName: "",
    hcoDmcid: "",
  }
  temp = [];
  tempYear = [];
  searchData;
  fileLoader = true;
  searchDataResult = [];
  statusMessage = false;
  selectedItem : number;
  public token;
  public person;
  selectWrapper;
  selectOptions;
  eduList: educationNode[] = [];
  degreeType: DegreeNode[] = [];
  yearHistory: number[] = [];
  monthHistory: Source[] = [];
  public yearHistoryTemp: any[] = [];
  disablePrevBtn = true;
  showSearch: boolean = false;
  educationList = [];
  listSearchData : boolean = false;
  @Input() key1: number;
  setLoader: boolean = true;
  constructor(
    private popover: PopoverController,
    private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private _sanitizer: DomSanitizer,
    private modalController: ModalController,
    public alertController: AlertController,
    public telemetry: TelemetryService,
    ) {
    this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "edit-education-popover";
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

  ScrollToTop(){
    this.content.scrollToTop(1500);
  }  
  ScrollToBottom(){
    setTimeout(() => {
      this.content.scrollToBottom(1500);
    }, 700);    
  }
  getEducationList = () => {
    this._pocnService.getEducationList().subscribe(({ data }) => {
      this.eduList = data.educationMasters.nodes;
    });
  }
  getDegreeType = () => {
    this._pocnService.getDegreeType().subscribe(({ data }) => {
    this.degreeType = data.masterDegrees.nodes;
   // console.log(this.degreeType);
    });
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
  addContactInfo() {
    this.educationList.push({
      school: '',
      hcoDegree: '',
      field: '',
      periodFfrom: '',
      periodTo: '',
      description: ''
    });
  }

  async close() {
    await this.modalController.dismiss();
  }
  updateEducation = (f:NgForm) => {

   // console.log(f);
    let education = [];
    let schoolCheck = false;
   // console.log(this.educationList);
    this.educationList.forEach((ed, index) => {
      //whitespace validation
      // if (!ed.school.replace(/\s/g, '').length) {
      //   schoolCheck = true;
      // } else {
      //   schoolCheck = false;
      // }
   //   console.log(ed.hcoDegree.degreeName);
      if(ed.school != ''){
        let hcoSelected =  this.eduList.filter((obj) => {
          return obj.hcoName === ed.school;
        });
        let dmcid;
        if (hcoSelected != null){
          dmcid = hcoSelected[0].hcoDmcid;
        }
        else{
           dmcid = 0;
        }
     //   console.log(this.tempYear[index].val);
        // if(ed.school != '' && schoolCheck == false && ed.hcoDegree != '' && ed.year != ''){
          education.push({
          hcoName: ed.school,
          hcoDegree: this.temp[index].degreeName,
          hcoDmcid: dmcid,
          hcoStatus:'Active',
          hcoSubtype: ed.field,
          //hcpGraduationYear: ed.year,
          hcpGraduationYear: (this.tempYear[index].val).toString(),
          description: ed.description,
          npi: this.person.userBasicProfile.npi,
          providerId: this.person.userBasicProfile.providerId,
          userId:this._pocnLocalStorageManager.getData("userId"),
        });

        //console.log(education);

      }

      // } else{
      //   this.eduSuccess = false;
      // }
    });
   // if(this.eduSuccess){
      this._pocnService.updateEducation(education,this.token).subscribe(
        (response: any) => {
          if (response.data) {
            if (response.data.updateUserEducation.userProfileUpdateResponse.status === 'Success') {
              //this.getUserProfile();
              //this.showEducationEdit = false;
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
              const spanName = "profile-education-edit-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'profile education edit';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated education data' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.modalController.dismiss('education');
            }
          }
        });
   // }
   // this.eduSuccess = true;
  }
  getUserProfile() {
    let educationDetails = [];
    let educationData = [];

    this._pocnService.getUserProfile(this.token)?.subscribe(({ data }) => {
      educationDetails = data['getUserFullProfile'].data['userEducationProfile'];
      this.person = data['getUserFullProfile'].data;

     //console.log("fetched educ datas");
    //  console.log(educationDetails);
     
     
      educationDetails.forEach((field, index) => {
        educationData = field;
      //  console.log(educationData);
       //console.log(educationData['hcoDegree']);
        let degreeTemp =  this.degreeType.filter((obj) => {
          return obj.degreeName === educationData['hcoDegree'];
        });

      //  console.log(degreeTemp);

        let edObj = {
          degreeCode: degreeTemp[0].degreeCode,
          degreeGroupCode: degreeTemp[0].degreeGroupCode,
          degreeGroupName: degreeTemp[0].degreeGroupName, 
          degreeId: degreeTemp[0].degreeId,
          degreeName: degreeTemp[0].degreeName
        };

       // console.log(edObj);

        this.temp.push(edObj);

        let yearObj = {
          id: educationData['hcpGraduationYear'],
          val: educationData['hcpGraduationYear']
        };

       // console.log(edObj);

        //this.yearListTemp.push(yearObj);

       // console.log(this.temp);
       // this.eduListTemp = {degreeCode: degreeTemp[0].degreeCode,degreeGroupCode: degreeTemp[0].degreeGroupCode,degreeGroupName: degreeTemp[0].degreeGroupName, degreeId: "16",degreeName: degreeTemp[0].degreeName};
       // console.log(educationData);
        if(educationData['hcoDegree']!=''){

        //this.yearListTemp = {yearid:'2000',yearval: '2000'};
        this.tempYear.push(yearObj);

       // console.log(this.yearListTemp[index]);
        //console.log("gradu year ");
        this.educationList.push({
          school: educationData['hcoName'],
          field: educationData['hcoSubtype'],
          //year: educationData['hcpGraduationYear'],
          year: this.tempYear[index],
          hcoDegree: this.temp[index],
          //eduListTemp = {degreeCode: "CPNP-AC",degreeGroupCode: "NP/CNS",degreeGroupName: "NP/CNS",degreeId: "16",degreeName: "Acute Care Certified Pediatric Nurse Practitioner"};,
          //hcoDegree: educationData['hcoDegree'],
          description: educationData['description'],
        });
        this.showSearch = !this.educationList?.some(item => item['school']);

        console.log("hiiiworkHistoryList ", this.educationList );
        console.log("hiii this.showSearch ", this.showSearch );
       // console.log("**************");
       // console.log(this.educationList);
      }
 
      });
      // this.fileLoader = false;
      this.setLoader = false;
    },
    (error) => {
      this.router.navigate(['/'])
    });
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
        me.NextSlide = 'Edit Education';
      } else {
        me.NextSlide = 'Next';
      }
    });
    // this.mySlider.slideNext();
  }
  swipeNext(mySlider, f) {
    let searchResult;
    this._pocnService.getEducationSearch(f.value['school']).subscribe(({ data }) => {
      searchResult = data['educationMasters']['nodes'];
      if (searchResult.length === 0) {
      }
      else {
        this.swipeNextData(mySlider, f, searchResult);
      }

    });
  }
  updateActive(i){
    this.selectedItem = i;
    this.showSearch = false;
  }
  swipeNextData(mySlider, f, searchResult) {
    searchResult.forEach((field, index) => {
      if (f.valid == true) {
        if (field.hcoName == f.value['school']) {

          mySlider.lockSwipes(false);
          mySlider.slideNext();
          if (this.NextSlide == 'Edit Education') {
            this.updateEducation(f);
          }
        }
      }
    })
  }
  swipeNextSecond(mySlider, f) {
    if(f.valid==true){
    mySlider.lockSwipes(false); 
    mySlider.slideNext();
    if (this.NextSlide == 'Edit Education') {
      this.updateEducation(f);
    }
  }
  }
  schoolType(event, schoolType, index) {
    this.educationList[index].school = schoolType;

    if (this.educationList[index].school != '') {
      let hcoSelected = this.eduList.filter((obj) => {
        return obj.hcoName === this.educationList[index].school;
      });
      let dmcid;
      if (hcoSelected != null) {
        dmcid = hcoSelected[0].hcoDmcid;
      }
      else {
        dmcid = 0;
      }
      this.educationList[index].hcoDmcid = dmcid;
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
    // if(searchText.length >= 3 ){
     // Keyboard.hide();
    this._pocnService.getEducationSearch(searchText).subscribe(({ data }) => {
      this.searchData = data['educationMasters']['nodes'];
      this.listSearchData = true;
      if (this.searchData.length === 0) {
        this.statusMessage = true;
        this.listSearchData = false;
      }
      else {
        this.statusMessage = false;
        // return this.searchData;
      }
    });
  // }
}
selectSearchData(test,i){
// this.selectedItem[i] = true;
this.ScrollToBottom();
this.selectedItem = i;
this.educationList[this.key1].healthOrganization = test.hcoName;
this.educationList[this.key1].school = test.hcoName;
this.educationList[this.key1].hcoDmcid = test.hcoDmcid;
this.hcoDetails = test;
}
slidePrev() {
  this.mySlider.lockSwipes(false); 
  this.mySlider.slidePrev();
}
clearSearch(workHistory: any) {
  workHistory.healthOrganization = ''; 
  this.searchData = [];
  this.showSearch = true;
  this.listSearchData = false;

}
}
