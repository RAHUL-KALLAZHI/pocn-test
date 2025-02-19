import { Component,OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DialerPopoverPage } from "../dialer-popover/dialer-popover.page";
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { CookieManager } from "./../../services/cookie-manager";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-dialer',
  templateUrl: './dialer.page.html',
  styleUrls: ['./dialer.page.scss'],
})
export class DialerPage implements OnInit {

  public myUserDialerData: string;
  public token: string;
  dialedPhone = null;
  currentValue = '';
  callerIdNumber: string;
  participantPhone;
  fromNumber: string;
  public countryCodeArray;
  constructor(private modalController: ModalController,
    public alertController: AlertController,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,
    private router: Router,
    private http: HttpClient,
    public telemetry: TelemetryService,
    ) {
      this._pocnService.getIpAddress();
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
     // this.callerIdNumber = (localStorage.getItem('callerId'));
    }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-');
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
    if (this.token == "" || this.token == null) {
      this.router.navigate(["/"]);
    }
    this.getTelephoneCountryCode();
    this.getDialerCaller();
  }
  getTelephoneCountryCode(){
    this._pocnService.getTelephoneCountryCode(this.token)?.subscribe(({ data }) => {
      let connectCountryCode;
      connectCountryCode = JSON.parse(JSON.stringify(data));
      this.countryCodeArray = connectCountryCode.getTelephoneCountryCode.data.countryCode;
    })
  }
  getDialerCaller() {
    this._pocnService.getDialerCaller(this.token)?.subscribe(({ data }) => {
      this.callerIdNumber = data['getDialerCaller'].data[0].name + " " + data['getDialerCaller'].data[0].phoneNumber.replace(this.countryCodeArray, '');
      this.fromNumber = data['getDialerCaller'].data[0].phoneNumber ;
    })
  }
  async showDialerPopOver() {
    const popover = await this.modalController.create({
      component: DialerPopoverPage,
      cssClass: 'dialer-modal',
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      this.callerIdNumber = modalDataResponse.data?modalDataResponse.data:'';
      if(modalDataResponse.data){
        this.callerIdNumber = modalDataResponse.data.name + " " + modalDataResponse.data.phone;
        this.fromNumber = modalDataResponse.data.phone;
      }
      else{
        this.getDialerCaller();
      }
    });


    await popover.present();

  }
  writeToInput(value: string, number: string = "callee") {
    if (number === "participant") {
      this.currentValue = this.currentValue + value;
      this.participantPhone = this.currentValue
    } else {
      this.currentValue = this.currentValue + value;
      this.dialedPhone = this.currentValue;
      localStorage.removeItem('dialerNumber');
      localStorage.setItem(
        "dialerNumber",
        this.dialedPhone
      );
    }
    return;
  }

  backSpace() {
  this.currentValue = this.currentValue.slice(0, -1)
  this.dialedPhone = this.currentValue
  }
  callDialer(){
    if(this.currentValue != ''){
      this.router.navigateByUrl('/dialer1', { state: { fromNumber: this.fromNumber,dialedPhone:this.dialedPhone, callerData:this.callerIdNumber } });
    }
  }
  goBackProfile(){
    this.router.navigate(['/tablinks/my-profile']);
  }
}
