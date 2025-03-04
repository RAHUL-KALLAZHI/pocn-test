import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DialerAddPopoverPage } from "../dialer-add-popover/dialer-add-popover.page";
import { DialerEditPopoverPage } from "../dialer-edit-popover/dialer-edit-popover.page";
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { CookieManager } from "./../../services/cookie-manager";
import { Source, EmploymentNode, UserProfileImage, UserResume, AddressNode, ContactNode, DegreeNode, SpecialityNode, StateNode, educationNode } from './../../services/type';
import { Router } from '@angular/router';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-dialer-popover',
  templateUrl: './dialer-popover.page.html',
  styleUrls: ['./dialer-popover.page.scss'],
})
export class DialerPopoverPage implements OnInit {
  public myUserDialerData: any[];
  public token: string;
  dialerDetails: any;
  disableNumber:boolean[]=[];
  selectedItem = 0;
  public countryCodeArray;
  constructor(private modalController: ModalController,
    public alertController: AlertController,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private router:Router,
    public telemetry: TelemetryService,
    private _pocnLocalStorageManager: LocalStorageManager,
    ) {
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    }
  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') +'-'+ "dialer-popover";
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
    this.getTelephoneCountryCode();
    this.getDialerCaller();
  }
  getDialerCaller() {
    this._pocnService.getDialerCaller(this.token)?.subscribe(({ data }) => {
      this.myUserDialerData = data['getDialerCaller'].data;
    })
  }
  getTelephoneCountryCode(){
    this._pocnService.getTelephoneCountryCode(this.token)?.subscribe(({ data }) => {
      let connectCountryCode;
      connectCountryCode = JSON.parse(JSON.stringify(data));
      this.countryCodeArray = connectCountryCode.getTelephoneCountryCode.data.countryCode;
    })
  }
  async close(data) {
    await this.modalController.dismiss(data);
  }
  async addDialerPopOver() {
     //this.close('');
    const popover = await this.modalController.create({
      component: DialerAddPopoverPage,
      cssClass: 'dialer-add-modal'
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      this.getDialerCaller();

    });
    await popover.present();
  }
  async editDialerPopOver() {
    const popover = await this.modalController.create({
      component: DialerEditPopoverPage,
      cssClass: 'dialer-edit-modal'
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      this.getDialerCaller();
    });
    await popover.present();
  }
   getSelectNumber(set,event, index){
    let selected = {
      name: set.name,
      phone :set.phoneNumber.replace(new RegExp(`^(${this.countryCodeArray.join('|')})`), '')
      // phone:set.phoneNumber.replace(this.countryCodeArray, '')
     }
     console.log("selected", selected);
    this.dialerDetails =  selected;
  }

  getDialerSave(){
    this.close(this.dialerDetails);
  }
  replaceCountryCode(phoneNumber: string): string {
    const regex = new RegExp(`^(${this.countryCodeArray.join('|')})`);
    return phoneNumber.replace(regex, '');
  }
}

