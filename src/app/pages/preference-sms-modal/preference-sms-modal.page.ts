import { Component, OnInit } from '@angular/core';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-preference-sms-modal',
  templateUrl: './preference-sms-modal.page.html',
  styleUrls: ['./preference-sms-modal.page.scss'],
})
export class PreferenceSmsModalPage implements OnInit {
  showPhoneDiv:boolean = false;
  validMobileNumber:string = "0";
  public countryCodeArray;
  constructor(    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private modalController: ModalController,
    public telemetry: TelemetryService,
    private router:Router,

    ) { }
public mobileNumberInput='';
  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-' + 'preference-sms-modal';
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
    });
    this.getTelephoneCountryCode();
  }
  async close() {
    // this.onClick('speciality-cancel');
    let args={
      mobileEntered:this.mobileNumberInput,
      validMobileCheck:this.validMobileNumber

    }
    await this.modalController.dismiss(args);
    // await this.modalController.dismiss(this.type);
  }
  getUserMobileNumber(){
   const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getUserMobileNumber(token).subscribe(({ data }) => {
      // this.mobileNumberData = data['getUserMobileNumber'].data;
    });
  }
// fecthing couintry codes
  getTelephoneCountryCode(){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getTelephoneCountryCode(token)?.subscribe(({ data }) => {
      let connectCountryCode;
      connectCountryCode = JSON.parse(JSON.stringify(data));
      this.countryCodeArray = connectCountryCode.getTelephoneCountryCode.data.countryCode;
    })
  }
  submitPhone(f:NgForm){
    let mobileNumber = f.value['phoneNumber'].replace('+','');
    let countryCodes= this.countryCodeArray;
    let validNumber = countryCodes.some(elem => mobileNumber.match('^' + elem));
    let phoneRegex = new RegExp("^[0-9]+$");
    let findPhoneRegex = phoneRegex.test(mobileNumber);
    if(mobileNumber.length < 10 || findPhoneRegex == false){
      this.showPhoneDiv = true;
      this.validMobileNumber = "0";
    }else if(mobileNumber.length > 10 && validNumber == false){
      this.showPhoneDiv = true;
      this.validMobileNumber = "0";
    }else{
      this.showPhoneDiv = false;
      this.validMobileNumber = "1";
      setTimeout(() => {
        this.close();
      }, 500);
    }
    // if(validNumber == true && mobileNumber.length >= 11 && findPhoneRegex == true) {
    //   this.showPhoneDiv = false;
    //   this.validMobileNumber = "1";
    //   setTimeout(() => {
    //     this.close();
    //   }, 500);

    //   //channel['value'] = mobileNumber;
    // } else {
    //   this.showPhoneDiv = true;
    //   this.validMobileNumber = "0";

    //   // channel['value'] = '';
    // }

  // if(channel.isChecked === true && channel.value == '' && channel.name == 'SMS') {
  //   this.showPhoneDiv = true;
  // }
   }

}
