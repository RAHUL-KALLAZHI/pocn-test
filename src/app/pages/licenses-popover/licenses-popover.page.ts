import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
//import { SpecialityNode} from './../../services/type';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Console } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-licenses-popover',
  templateUrl: './licenses-popover.page.html',
  styleUrls: ['./licenses-popover.page.scss'],
})
export class LicensesPopoverPage implements OnInit {
  @Input() key1: [];
  @Input() userAgent: string;
  @Input() deviceType: string;

  public token;
  public basicProfile;
  noSpacesRegex = /.*\S.*/;
  licSuccess: boolean = true;
  public licenseList: any[] = [{
    certificateName: '',
    speciality: '',
    institutionName: ''
  }];


  specialityType = [];
  temp = [{specialtyCode:'', specialtyGroupCode:'', specialtyGroupName:'', specialtyId:'', specialtyName:''}];

  constructor(
    private modalController: ModalController,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public alertController: AlertController,
    public telemetry: TelemetryService,
    private router:Router,
    ) { 
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "add-license-popover";
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

  ionViewDidEnter() {
    this.specialityType = this.key1;
    this.getUserProfile();
  }

  async close() {
    await this.modalController.dismiss();
  }
  async setSpeciality(licenseData){
    let specialityTemp =  this.specialityType.filter((obj) => {
      return obj.specialtyName === licenseData['specialty'];
    });   
    let licObj = {
      specialtyCode: specialityTemp[0].specialtyCode,
      specialtyGroupCode: specialityTemp[0].specialtyGroupCode,
      specialtyGroupName: specialityTemp[0].specialtyGroupName, 
      specialtyId: (specialityTemp[0].specialtyId).toString(),
      specialtyName: specialityTemp[0].specialtyName
    };
    this.temp.push(licObj);
    return true;
  }

  getUserProfile() {
    let licenseData = [];
    let licenseDetails = [];
    this._pocnService.getUserProfile(this.token).subscribe(({ data }) => {
      this.basicProfile = data['getUserFullProfile'].data['userBasicProfile'];
      licenseDetails = data['getUserFullProfile'].data['userCertLicense'];
        licenseDetails.forEach(async (field, index) => {
            licenseData = field;
            let specialityTemp =  this.specialityType.filter((obj) => {
              return obj.specialtyName === licenseData['specialty'];
            });   
            let licObj = {
              specialtyCode: specialityTemp[0].specialtyCode,
              specialtyGroupCode: specialityTemp[0].specialtyGroupCode,
              specialtyGroupName: specialityTemp[0].specialtyGroupName, 
              specialtyId: (specialityTemp[0].specialtyId).toString(),
              specialtyName: specialityTemp[0].specialtyName
            };
            this.temp.push(licObj);
            
            this.licenseList.push({
              certificateName: licenseData['certificationLicenceName'],
              speciality: licenseData['specialty'],
              institutionName: licenseData['hcoName']
            }); 
        });
    },
    
    );
  }

  updateLicense = (f:NgForm) => {
    let license = [];
    let certificateNameCheck = false;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    let providerId = Number(this.basicProfile.providerId);
    if (f.value['certificateName'].replace(/\s/g, '').length) {
      certificateNameCheck = true;
    } else {
      certificateNameCheck = false;
    } 
    if( f.value['speciality'].specialtyName != '' &&  f.value['certificateName'] != '' && certificateNameCheck == true) {
      this.licenseList.forEach((ed, index) => {
        let licenseobj= {
        userId:this.basicProfile.userId,
        npi: this.basicProfile.npi,
        providerId: Number(providerId),
        hcoDmcid: 0,
        hcoName: (ed.institutionName) ? ed.institutionName : '',
        certificationLicenceName: (ed.certificateName) ? ed.certificateName : '',
        specialty: (this.temp[index].specialtyName) ? this.temp[index].specialtyName : '',
        specialtyId: 0,
        yearOfCertification: ''
        }
        license.push(licenseobj);
      });
    } 
    else{ 
      this.licSuccess = false;
    }  
    if(this.licSuccess) {
      this._pocnService.updateLicense(license,token).subscribe(
        (response: any) => {
          if (response.data) {
            if (response.data.updateCertLicenseInfo.userProfileUpdateResponse.status === 'Success') {
              this.modalController.dismiss('license');
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
              const spanName = "profile-license-add-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'profile license add';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully added new license data' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
            }
          }
        });
    }
    this.licSuccess = true;
  }
}
