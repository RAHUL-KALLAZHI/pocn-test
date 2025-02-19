import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { Observable, Subscriber, ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenManager } from "./../../services/token-manager";
import { Source, EmploymentNode, UserProfileImage, UserResume, AddressNode, ContactNode, DegreeNode, SpecialityNode, StateNode, educationNode } from './../../services/type';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-popover',
  templateUrl: './delete-popover.page.html',
  styleUrls: ['./delete-popover.page.scss'],
})
export class DeletePopoverPage implements OnInit {
  @Input() userAgent: string;
  @Input() deviceType: string;
  @Input() key1: string;
  @Input() key2: string;
  @Input() key3: [];
  public token;
  public person;
  public basicProfile;
  professionalProfileDetails = [];
  licenseDetails = [];
  eduList: educationNode[] = [];
  disableDeleteButton: boolean = false;

  public hcoList;

  yearDiff: any;
  public educationList: any[] = [{
    school: '',
    hcoDegree: '',
    field: '',
    periodFfrom: '',
    periodTo: '',
    description: ''
  }];
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
  public contactInfoList: any[] = [{
    phoneNumber: '',
    faxNumber: '',
    mobilePhoneNumber: '',
    //mobileCountryCode: '',
    email: '',
    contactType: '',
    isPrimary: ''
  }];
  public profileList: any[] = [{
    jobTitle: '',
    hcoName: '',
    city: '',
    state: '',
    fromMonth: '',
    fromYear: '',
    bio: '',
    employmentType: '',
    description: ''
  }];
  public licenseList: any[] = [{
    certificateName: '',
    speciality: '',
    institutionName: ''
  }];
  constructor(private modalController: ModalController,
    private dataService: DataService,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,
    private _sanitizer: DomSanitizer,
    private tokenManager: TokenManager,
    public telemetry: TelemetryService,
    private router:Router,

    ) {this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken"); }

  ngOnInit() {
    //this.getHcoList();
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+"delete-popover";
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
    this.hcoList = this.key3;
  }

  getEducationList = () => {
    this._pocnService.getEducationList().subscribe(({ data }) => {
      this.eduList = data.educationMasters.nodes;
    });
  }

  deleteUserDetails(){
    this.disableDeleteButton = true;

    this.getUserProfile();
    this.getEducationList();
    //this.getHcoList();

  }
  // getHcoList = () => {
  //   this._pocnService.getHcoList().subscribe(({ data }) => {
  //     this.hcoList = data.hcoMasters.nodes;
  //     console.log(this.hcoList);

  //   });
  // }
  getUserProfile () {
    let educationDetails = [];
    let educationData = [];
    let licenseData = [];
    let workHistoryData = [];
    let contactInfoData = [];
    let contactInfoDetails = [];
    var contactHeaderType: any;
    var contactPrimary: boolean[] = [];
    let workHistoryDetails = [];
    var checkedContactPrimary: any;
    var yearLabel;
    var monthLabel;
    this.educationList = [];
    this.licenseList = [];
    this._pocnService.getUserProfile(this.token).subscribe(({ data }) => {
      this.person = data['getUserFullProfile'].data;
      this.basicProfile = data['getUserFullProfile'].data['userBasicProfile'];
      educationDetails = data['getUserFullProfile'].data['userEducationProfile'];
      this.professionalProfileDetails = data['getUserFullProfile'].data['userProfessionalProfile'];
      this.licenseDetails = data['getUserFullProfile'].data['userCertLicense'];
      workHistoryDetails = data['getUserFullProfile'].data['userExperienceProfile'];
      contactInfoDetails = data['getUserFullProfile'].data['userContactProfile'];
      educationDetails.forEach((field, index) => {
        educationData = field;
        this.educationList.push({
          school: educationData['hcoName'],
          field: educationData['hcoSubtype'],
          year: educationData['hcpGraduationYear'],
          hcoDegree: educationData['hcoDegree'],
          description: educationData['description'],
        });
      } );
        this.licenseDetails.forEach((field, index) => {
          licenseData = field;
          this.licenseList.push({
            certificateName: licenseData['certificationLicenceName'],
            speciality: licenseData['specialty'],
            institutionName: licenseData['hcoName']
        });
        this.workHistoryList = [];
        workHistoryDetails.forEach((field, index) => {
          workHistoryData = field;
          this.yearDiff = yearLabel + monthLabel;
          this.workHistoryList.push({   // showing in ui form
            experienceTitle: workHistoryData['experienceTitle'],
            hcoStateProvince: workHistoryData['hcoStateProvince'],
            description: workHistoryData['description'],
            tags: workHistoryData['tags'],
            healthOrganization: workHistoryData['healthOrganization'],
            employmentType: workHistoryData['employmentType'],
            hcoLocality: workHistoryData['hcoLocality'],
            hcoSubType: workHistoryData['hcoName'],
            startYear: workHistoryData['startYear'],
            endYear: workHistoryData['endYear'],
            startMonth: workHistoryData['startMonth'],
            endMonth: workHistoryData['endMonth'],
            diffYear: this.yearDiff,
          });
        });
        this.contactInfoList = [];
        contactInfoDetails.forEach((field, index) => {
          contactInfoData = field;
          contactPrimary[index] = contactInfoData['isPrimary'];
          if(contactInfoData['contactType']!=''){
            this.contactInfoList.push({
              faxNumber: contactInfoData['faxNumber'],
              phoneNumber: contactInfoData['phoneNumber'],
              mobilePhoneNumber: contactInfoData['mobilePhoneNumber'],
              email: contactInfoData['email'],
              setPrimary: checkedContactPrimary,
              contactType: contactInfoData['contactType'],
              contactHeaderType: '1'
            });
          }
        });
        });

        if(this.key1 == 'contact'){
          this.removeContactInfo(this.key2);
        }
        else if(this.key1 == 'education'){
          this.removeEducation(this.key2);
        }
        else if(this.key1 == 'license'){
          this.removeLicense(this.key2);
        }
        else if(this.key1 == 'workhistory'){
          this.removeWorkHistory(this.key2);
        }
        else if(this.key1 == 'professional'){
          this.removeProfessional(this.key2);
        }
    },
      (error) => {
        //this.router.navigate(['/'])
      });
  }


  removeProfessional(e:any) {
    this.professionalProfileDetails

    let profileDetails;
   
      profileDetails = {
      accessToken: this.token,
      npi: this.person.userBasicProfile.npi,
      providerId: this.person.userBasicProfile.providerId,
      userId:this._pocnLocalStorageManager.getData("userId"),
      hcoDmcid: 0,
      hcoName: '',
      jobTitle: '',
      startYear: '',
      endYear: '',
      hcoSubtype: '',
      hcoStatus: '',
      hcoAddress: '',
      hcoUnit: '',
      hcoLocality: '',
      hcoStateProvince: '',
      hcoPostcode: '',
      hcoCountry: '',
      bio: '',
      isPrimary: 0,
      employmentType: '',
      description: '',
      month: '',

    }
    this._pocnService.updateProfessionalProfileDetails(profileDetails).subscribe(
      (response: any) => {
        if (response.data.updateUserProfessionalProfile.userProfileUpdateResponse.status === 'Success') {
          this.modalController.dismiss('professional');
         }
      });
    }



 
  removeWorkHistory(e:any) {
    if (e !== -1) {
      this.workHistoryList.splice(e, 1);
    }

    let workHistory = [];
  
    //const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this.workHistoryList.forEach((ed, index) => {
      
      if(ed.healthOrganization != ''){

      let hcoSelected =  this.hcoList.filter((obj) => {
        return obj.hcoName === ed.healthOrganization;
      });

      let dmcid;
      if (hcoSelected != null && hcoSelected.length > 0){
        dmcid = hcoSelected[0].hcoDmcid
      }
      else{
         dmcid = 0;

      }
        workHistory.push({
          description: ed.description,
            endYear: ed.endYear,
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
            startYear: ed.startYear,
            employmentType:ed.employmentType,
            startMonth:ed.startMonth,
            endMonth:ed.endMonth,
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

      this._pocnService.updateWorkHistory(workHistory,this.token).subscribe(
        (response: any) => {
          if (response.data) {
            if (response.data.updateUserExperience.userProfileUpdateResponse.status === 'Success') {
             // this.getUserProfile();
             let logDetaiils = {
              accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
              npi: this.person.userBasicProfile.npi,
              logType: "Profile Update",
              channel: this.userAgent,
              ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
              ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
              device: this.deviceType,
              geoLocation: "",
              description: "Deleted profile workhistory record",
              activity: "Profile Workhistory Delete",
            }
            this._pocnService.updateUserLog(logDetaiils).subscribe((response: any) => {});
              const spanName = "profile-workhistory-delete-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'profile workhistory delete';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully deleted workhistory data' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.modalController.dismiss('workhistory');
            }
          }
        });       
  }
  async close() {
    await this.modalController.dismiss();
  }
  removeLicense(e:any) {
    if (e !== -1) {
      this.licenseList.splice(e, 1);
    }
    let license = [];
    let providerId: number = this.basicProfile.providerId;
    this.licenseList.forEach((ed, index) => {
      if(ed.certificateName != ''){

    license.push({
      userId:this.basicProfile.userId,
      npi: this.basicProfile.npi,
      providerId: Number(providerId),
      hcoDmcid: 0,
      hcoName: ed.institutionName,
      certificationLicenceName: ed.certificateName,
      specialty: ed.speciality,
      specialtyId: 0,
      yearOfCertification: ''
    });  

  }
    });
    this._pocnService.updateLicense(license,this.token).subscribe(
      (response: any) => {
        if (response.data) {
          if (response.data.updateCertLicenseInfo.userProfileUpdateResponse.status === 'Success') {
            let logDetaiils = {
              accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
              npi: this.basicProfile.npi,
              logType: "Profile Update",
              channel: this.userAgent,
              ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
              ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
              device: this.deviceType,
              geoLocation: "",
              description: "Deleted profile licenses/certifications record",
              activity: "Profile Licenses/Certifications Delete",
            }
            this._pocnService.updateUserLog(logDetaiils).subscribe((response: any) => {});
            const spanName = "profile-license-delete-btn";
            let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail")
            }
            const eventName = 'profile license delete';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully deleted license data' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
            this.modalController.dismiss('license');
          }
        }
    });
  }

  removeEducation(e:any) {
    if (e !== -1) {
      this.educationList.splice(e, 1);
    }
    let education = [];
    this.educationList.forEach((ed, index) => {
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
        education.push({
          hcoName: ed.school,
          hcoDegree: ed.hcoDegree,
          hcoDmcid: dmcid,
          hcoStatus:'Active',
          hcoSubtype: ed.field,
          hcpGraduationYear: ed.year,
          description: ed.description,
          npi: this.person.userBasicProfile.npi,
          providerId: this.person.userBasicProfile.providerId,
          userId:this._pocnLocalStorageManager.getData("userId"),
        });
      }
    });
    this._pocnService.updateEducation(education,this.token).subscribe(
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
              description: "Deleted profile education record",
              activity: "Profile Education Delete",
            }
            this._pocnService.updateUserLog(logDetaiils).subscribe((response: any) => {});
            const spanName = "profile-education-delete-btn";
            let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail")
            }
            const eventName = 'profile education delete';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully deleted education data' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
            this.modalController.dismiss('education');
          }
        }
    });
  }

  removeContactInfo(e:any) {
    let contactProfile = [];
    if (e !== -1) {
      this.contactInfoList.splice(e, 1);
    }
    this.contactInfoList.forEach((ed, index) => {
      contactProfile.push({
        userId:this._pocnLocalStorageManager.getData("userId"),
        npi:this.person['userBasicProfile'].npi,
        mobilePhoneNumber: ed.mobilePhoneNumber,
        faxNumber: ed.faxNumber,
        phoneNumber: '',
        isPrimary: false,
        email: ed.email,
        contactType:ed.contactType
      })
    });
    this._pocnService.updateUserContactProfile(contactProfile,this.token).subscribe(
      (response: any) => {
        if (response.data) {
          if (response.data.updateUserContactProfile.userProfileUpdateResponse.status === 'Success') {
           this.modalController.dismiss('contact');
          }
        }
    });
  }
}
