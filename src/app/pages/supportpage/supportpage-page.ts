import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { GraphqlDataService } from '../../services/graphql-data.service';
import { CookieManager } from "../../services/cookie-manager";
import { LocalStorageManager } from "../../services/local-storage-manager";
import { Observable, Subscriber, ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenManager } from "../../services/token-manager";
import { Source, EmploymentNode, UserProfileImage, UserResume, AddressNode, ContactNode, DegreeNode, SpecialityNode, StateNode, educationNode } from '../../services/type';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supportpage',
  templateUrl: './supportpage.page.html',
  styleUrls: ['./supportpage.page.scss'],
})
export class SupportPage implements OnInit {
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
   

    ) { }

  ngOnInit() {
  
  }

 
  closeModal() {
    this.modalController.dismiss();
  }

}
