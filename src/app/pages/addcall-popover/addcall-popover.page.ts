import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import internal from 'stream';
import { ToastController } from '@ionic/angular';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Router } from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';

@Component({
  selector: 'app-addcall-popover',
  templateUrl: './addcall-popover.page.html',
  styleUrls: ['./addcall-popover.page.scss'],
})
export class AddcallPopoverPage implements OnInit {
  showBackButton: boolean = false;
  currentValue = '';
  participantPhone = '';
  dialedPhone: string;
  showCallerIcon: boolean = true;
  participantDailer:boolean= false;
  countryCodeArray;
  twilioServerURL = environment.twilioServerURL;
  lastIndex: number=0;
  @Input() number: string;
  @Input() conferenceId: string;
  @Input() participantList: any = [];
  constructor(private modalController: ModalController,
    public alertController: AlertController,
    public telemetry: TelemetryService,
    private http: HttpClient,
    private toastController: ToastController,
    private _pocnLocalStorageManager: LocalStorageManager,
    private router:Router,
    private _pocnService: GraphqlDataService,
    ) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') +'-'+ "add-call-popover";
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
  async close(data) {
    await this.modalController.dismiss(data);
  }
  writeToInput(value: string, number: string = "callee") {
    this.showBackButton = true;
    if (number === "participant") {
      this.currentValue = this.currentValue + value;
      this.participantPhone = this.currentValue
    } else {
      this.currentValue = this.currentValue + value;
      this.dialedPhone = this.currentValue
    }
    return;
  }

  backSpace() {
  this.currentValue = this.currentValue.slice(0, -1)
  this.participantPhone = this.currentValue
  if(this.participantPhone == '') this.showBackButton = false  ;
  }
  addNewParticipant(){
    if(this.participantPhone){
      this.addParticipant();
    }
  }
  addParticipantDialer(){
    this.participantDailer = true
  }
  closeParticipantDialer(){
    this.participantDailer = false
  }
  async addParticipant() {
    console.log("add participant");
    // this.callerType = callerType_PARTICIPANT;
    // this.participantIndex = this.participantIndex + 1;
    // this.startupClient();
    const index = this.participantList.findIndex((item) => item.number === this.participantPhone);
    this._pocnService.getTelephoneCountryCode(this._pocnLocalStorageManager.getData("pocnApiAccessToken"))?.subscribe(async({ data }) => {
      let connectCountryCode;
      connectCountryCode = JSON.parse(JSON.stringify(data));
      this.countryCodeArray = connectCountryCode.getTelephoneCountryCode.data.countryCode;
    console.log(this.countryCodeArray)
    let phone=this.participantPhone;
    let  validNumber = this.countryCodeArray.some(elem => phone.match('^' + elem));
    let participantPhone;
    if(!!validNumber){
      participantPhone = this.participantPhone;
      console.log(participantPhone)
    }
    else{
      participantPhone = this.countryCodeArray + this.participantPhone;
      console.log(participantPhone)
    }
    if(index == -1){
    const params = { to: participantPhone, callStatus: 'call', from: this.number, conferenceId: this.conferenceId };
    this.http.post(`${this.twilioServerURL}/addParticipant`, params,{responseType:'text'}).subscribe((data)=>{
      this.showCallerIcon = false;
    })
    this.participantDailer = false;
    this.participantList.push({"number":participantPhone, "muted":true, "loading" : true})
    const spanName = "dialer-add-participant-btn";
    let attributes = {
        userId: this._pocnLocalStorageManager.getData("userId"),
        firstName: this._pocnLocalStorageManager.getData("firstName"),
        lastName: this._pocnLocalStorageManager.getData("lastName"),
        userEmail:this._pocnLocalStorageManager.getData("userEmail")
    }
    const eventName = 'dialer add participant';
    const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully added participant' }
    this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
        this.telemetry.parentTrace = result;
    })
    console.log(this.participantList)
  }else{
    this.presentToast('top');
  }
})
  }
  async disconnectParticipant() {
    this.lastIndex = this.participantList.length - 1
    console.log(this.lastIndex);
    const bodyData = { participant: this.participantList[this.lastIndex].number, conferenceId: this.conferenceId };
    this.http.post(`${this.twilioServerURL}/disconnectParticipant`, bodyData, { responseType: 'text' }).subscribe(async (data) => {
      if(data == "call disconnected"){
        console.log("entered on call disconnect")
        // this.participantList.splice(this.lastIndex, 1);
        this.lastIndex=0;
        this.close(this.participantList);
        const spanName = "dialer-disconnect-participant-btn";
        let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail")
        }
        const eventName = 'dialer disconnect participant';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully disconnected participant' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
      }
    })
  }
  async muteParticipant(muteStatus) {
    this.lastIndex = this.participantList.length - 1;
    let list = this.participantList[this.lastIndex];
    list.muted = muteStatus == 'mute'  ? false : true
    console.log('mute participant----------------------------')
    console.log(this.participantList);
    console.log(list);
    console.log('mute participant----------------------------')
    const bodyData = { participant: list.number, conferenceId: this.conferenceId, mute : list.muted };
    this.http.post(`${this.twilioServerURL}/mute`, bodyData, { responseType: 'text' }).subscribe(async (data) => {
      console.log('data---')
      console.log(data)
      console.log('data---')
      if(muteStatus === "mute"){
        const index = this.participantList.findIndex((item) => item.number === list.number);
        this.participantList[index] =  list;
        const spanName = "dialer-mute-participant-btn";
        let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail")
        }
        const eventName = 'dialer mute participant';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully mute participant' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
      }else if(muteStatus === "unmute"){
        const index = this.participantList.findIndex((item) => item.number === list.number);
        this.participantList[index] =list;
        const spanName = "dialer-unmute-participant-btn";
        let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail")
        }
        const eventName = 'dialer unmute participant';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully unmute participant' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
      }
    })
  }
  mergeCall(){
    this.close(this.participantList);
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Participant is already connected',
      duration: 5000,
      position: position
    });

    await toast.present();
  }

}
