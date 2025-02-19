import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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
import { Console } from 'console';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-edit-license-modal',
  templateUrl: './edit-license-modal.page.html',
  styleUrls: ['./edit-license-modal.page.scss'],
})
export class EditLicenseModalPage implements OnInit {
  temp = [];
  key1: number;
  @Input() key2: [];
  @Input() userAgent: string;
  @Input() deviceType: string;
  public token;
  public person;
  public basicProfile;
  public licenseDetails;
  licSuccess: boolean = true;
  public licenseList: any[] = [{
    certificateName: '',
    speciality: '',
    institutionName: ''
  }];
  yearDiff: any;
  yearLabel: any;
  monthLabel: any;  selectWrapper;
  selectOptions;
  specialityType: SpecialityNode[] = [];
  setLoader: boolean = true;
  noSpacesRegex = /.*\S.*/;
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
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "edit-license-popover";
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
    this.getUserProfile();
    this.specialityType = this.key2;
  }
  async close() {
    /* const closeModal: string = "Modal Closed"; */
    await this.modalController.dismiss();
  }
  // getSpecialityType = () => {
  //   this._pocnService.getSpecialityType().subscribe(({ data }) => {
  //   this.specialityType = data.masterSpecialties.nodes;
  //  // console.log(this.specialityType);
  //   });
  // }
  getUserProfile() {

    let licenseData = [];
    this.licenseList = [];
    this._pocnService.getUserProfile(this.token)?.subscribe(({ data }) => {
      this.person = data['getUserFullProfile'].data;
      this.basicProfile = data['getUserFullProfile'].data['userBasicProfile'];
      this.licenseDetails = data['getUserFullProfile'].data['userCertLicense'];
        //console.log(this.licenseDetails);
        this.licenseDetails.forEach((field, index) => {
          licenseData = field;
          let specialityTemp =  this.specialityType.filter((obj) => {
            return obj.specialtyName === licenseData['specialty'];
          });

          let licenseObj = {
            specialtyCode: specialityTemp[0].specialtyCode,
            specialtyGroupCode: specialityTemp[0].specialtyGroupCode,
            specialtyGroupName: specialityTemp[0].specialtyGroupName, 
            specialtyId: specialityTemp[0].specialtyId,
            specialtyName: specialityTemp[0].specialtyName
          };
  
         // console.log(edObj);
  
          this.temp.push(licenseObj);


          this.licenseList.push({
            certificateName: licenseData['certificationLicenceName'],
            speciality: licenseData['specialty'],
            institutionName: licenseData['hcoName']
        });
        });
      // });
      this.setLoader = false;
    },
      (error) => {
        this.router.navigate(['/'])
      });
  }
  updateLicense = (f:NgForm) => {
    let license = [];
    var licSuccess = false;
    let certificateNameCheck = false;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    let providerId: number = this.basicProfile.providerId;

    //log(this.licenseList);
    this.licenseList.forEach((ed, index) => {
      //whitespace validation
    //  console.log(this.temp[index].specialtyName);
      if (!ed.certificateName.replace(/\s/g, '').length) {
        certificateNameCheck = true;
      } else {
        certificateNameCheck = false;
      }
      if(this.temp[index].specialtyName != '' && ed.certificateName != '' && certificateNameCheck == false) {
          license.push({
          userId:this.basicProfile.userId,
          npi: this.basicProfile.npi,
          providerId: Number(providerId),
          hcoDmcid: 0,
          hcoName: ed.institutionName,
          certificationLicenceName: ed.certificateName,
          specialty: this.temp[index].specialtyName,
          specialtyId: 0,
          yearOfCertification: ''
        });
      } else{
        this.licSuccess = false;
      }
    });
    if(this.licSuccess) {
      this._pocnService.updateLicense(license,token).subscribe(
        (response: any) => {
          if (response.data) {
            if (response.data.updateCertLicenseInfo.userProfileUpdateResponse.status === 'Success') {
              // this.getUserProfile();
              let logDetaiils = {
                accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
                npi: this.basicProfile.npi,
                logType: "Profile Update",
                channel: this.userAgent,
                ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
                ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
                device: this.deviceType,
                geoLocation: "",
                description: "Updated profile licenses/certifications record",
                activity: "Profile Licenses/Certifications Update",
              }
              this._pocnService.updateUserLog(logDetaiils).subscribe((response: any) => {});
              const spanName = "profile-license-edit-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'profile license edit';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated license data' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              this.modalController.dismiss('license');
            }
          }
        });
      }
      this.licSuccess = true;
  }
  

}

