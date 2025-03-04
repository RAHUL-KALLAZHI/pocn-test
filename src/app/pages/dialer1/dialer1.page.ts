import { Component,Input,OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { Router } from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { AddcallPopoverPage } from "../addcall-popover/addcall-popover.page";
import { Location } from '@angular/common';
import { PopoverController , Platform  } from "@ionic/angular";
import { DialerMorePopoverPage } from "../dialer-more-popover/dialer-more-popover.page";
import { Socket } from 'ngx-socket-io';
import { TelemetryService } from 'src/app/services/telemetry.service';

declare const Twilio: any;

const callerType_MODERATOR = 'MODERATOR';
@Component({
  selector: 'app-dialer1',
  templateUrl: './dialer1.page.html',
  styleUrls: ['./dialer1.page.scss'],
})
export class Dialer1Page implements OnInit {
  number = null;
  twilioServerURL = environment.twilioServerURL;
  conferenceId: string;
  callerType:string;
  device: any;
  participantIndex = 0;
  accessToken: string;
  dialedPhone: string;
  fromNumber: string;
  currentValue = '';
  callerIdNumber: string;
  participantList= [];
  showContent = false;
  muted = false;
  running = false;
  ms: any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;
  startTimer = null;
  history = [];
  token: string;
  providerHcpNpi: string;
  providerId: string;
  participantPhone: any;
  participantDailer:boolean= false;
  showBackSpace: boolean = false;
  showCallStatus: boolean = true;
  callerIds:any;
  callerData: any;
  showBackButton = false;
  showCallParticipant: boolean = false;
  showDialerPad: boolean = false;
  showCommonDialer: boolean = false;
  listParticipant=[];
  backButtonSubscription;
  countryCodeArray;
  constructor(private modalController: ModalController,
    public alertController: AlertController,
    private http: HttpClient,
    private router: Router,
    private _pocnLocalStorageManager: LocalStorageManager,
    private _pocnService: GraphqlDataService,
    private location:Location,
    private popoverCtrl: PopoverController,
    private platform: Platform,
    private socket: Socket,
    public telemetry: TelemetryService,
    ) {
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      this.callerIds = this.location.getState();
      this.callerData= this.callerIds?.callerData;

     }

  ngOnInit() {
    this.getTelephoneCountryCode();
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
    this.startupClient();
    this.showCallStatus = true;
    this.socket.connect();
    this.socket.emit('my message', 'Socket ping');

    this.socket.fromEvent('my broadcast').subscribe((data:string) => {
      console.log(data);
    });
    this.socket.fromEvent('callEnded').subscribe((data: any) => {
      console.log("disconnected participant details: ",data);
    });
    this.socket.fromEvent('statusChanged').subscribe((data: any) => {
      console.log("call status: ",data);
      console.log("this.dialedPhone: ",this.dialedPhone);
      switch (data.status) {
        case 'initiated':
          break;
        case 'ringing':
          break;
        case 'in-progress':
          this.showCallStatus = false;
          this.start();
          break;
        case 'completed':
          let index = this.participantList.findIndex(((item) => item.number === this.countryCodeArray[1]+this.dialedPhone))
          console.log("before",index, this.participantList)
          if (index > -1) {
            console.log("after",index, this.participantList)
            this.participantList.splice(index, 1);
          if (this.participantList.length == 1) {
            this.dialedPhone = this.participantList[0].number;
            this.showCallParticipant = false;
            this.showDialerPad = false;
            this.showCommonDialer = true;
          }
        }
          break;
        case 'failed':
          this.device.disconnectAll()
          this.participantList = []
          this.muted = false
          this.router.navigate(["/dialer"]);
          break;
        case 'busy':
          this.device.disconnectAll()
          this.participantList = []
          this.muted = false
          this.router.navigate(["/dialer"]);
          break;
        case 'canceled':
          this.device.disconnectAll()
          this.participantList = []
          this.muted = false
          this.router.navigate(["/dialer"]);
          break;
      }
    });
    this.socket.fromEvent('participantStatusChanged').subscribe((data: any) => {
      console.log("participant status: ",data);
      let participantLabel = data.participantNumber.split("+").pop();
      let index = this.participantList.findIndex(((item) => item.number === participantLabel))
      switch (data.callStatus) {
        case 'initiated':
          break;
        case 'ringing':
          break;
        case 'in-progress':
          console.log("index",index);
          if (index > -1) {
            this.participantList[index].loading = false ;
            console.log("loader changed");
          }
          break;
        case 'completed':
          console.log("index of the participant",index);
          console.log(this.participantList)
          if (index > -1) {
            this.participantList.splice(index, 1);
            if(this.participantList.length == 1){
              this.dialedPhone = this.participantList[0].number;
              this.showCallParticipant = false ;
              this.showDialerPad = false;
              this.showCommonDialer = true;
              this.close();
            }
          }
          break;
        case 'failed':
          console.log(index,"index")
          console.log("this.participantList", this.participantList);

          if (index > -1) {
            this.participantList.splice(index, 1);
            if (this.participantList.length == 1) {
              this.dialedPhone = this.participantList[0].number;
              this.showCallParticipant = false;
              this.showDialerPad = false;
              this.showCommonDialer = true;
              this.close();
            }
          }
          break;
        case 'busy':
          if (index > -1) {
            this.participantList.splice(index, 1);
            if (this.participantList.length == 1) {
              this.dialedPhone = this.participantList[0].number;
              this.showCallParticipant = false;
              this.showDialerPad = false;
              this.showCommonDialer = true;
              this.close();
            }
          }
          break;
        case 'canceled':
          if (index > -1) {
            this.participantList.splice(index, 1);
            if (this.participantList.length == 1) {
              this.dialedPhone = this.participantList[0].number;
              this.showCallParticipant = false;
              this.showDialerPad = false;
              this.showCommonDialer = true;
              this.close();
            }
          }
          break;
          case 'no-answer':
          if (index > -1) {
            this.participantList.splice(index, 1);
            if (this.participantList.length == 1) {
              this.dialedPhone = this.participantList[0].number;
              this.showCallParticipant = false;
              this.showDialerPad = false;
              this.showCommonDialer = true;
              this.close();
            }
          }
          break;
      }
    });

    setInterval(()=>{
      this.socket.emit('my message', 'Socket ping');
    },5000)

    this.socket.on('disconnect', (reason) => {
      console.log(reason,"reason")
    })
  }


  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {

    });
  }

  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
    this.socket.disconnect();

  }

  //drop down dialer case temporarily hidden from client request
  // async showDialerPopOver() {
  //   const popover = await this.modalController.create({
  //     component: DialerPopoverPage,
  //     cssClass: 'dialer-modal',
  //   });
  //   popover.onDidDismiss().then((modalDataResponse) => {
  //     if(modalDataResponse.data){
  //       this.callerData = modalDataResponse.data.name + " " + modalDataResponse.data.phone;
  //     }
  //     else{
  //       this.callerIds = this.location.getState();
  //       this.callerData = this.callerIds.callerData;
  //     }
  //   });
  //   await popover.present();

  // }
  getUserProfile() {
    this._pocnService.getUserBasicProfile(this.token).subscribe(({ data }) => {
    this.providerHcpNpi= data['getUserBasicProfile'].data['userBasicProfile']['npi'];
    this.providerId = data['getUserBasicProfile'].data['userBasicProfile']['providerId'];
    },
      (error) => {
          this.router.navigate(['/'])
      });
  }
  getTelephoneCountryCode(){
    this._pocnService.getTelephoneCountryCode(this.token)?.subscribe(({ data }) => {
      let connectCountryCode;
      connectCountryCode = JSON.parse(JSON.stringify(data));
      this.countryCodeArray = connectCountryCode.getTelephoneCountryCode.data.countryCode;
    })
  }
  startupClient() {
    this.showCommonDialer = true;
    this.showCallParticipant = false;
    this.showDialerPad = false;
    this.dialedPhone = this.callerIds?.dialedPhone;
    this.fromNumber = this.callerIds?.fromNumber;
    this.callerData = this.callerIds?.callerData;
    console.log('Requesting Access Token...');
    try {
      let tokenStored = localStorage.getItem('token') ? localStorage.getItem('token') : '';
      console.log('token: ' + tokenStored);
      this.accessToken = tokenStored;
      this.http.get(`${this.twilioServerURL}/accessToken`, { responseType: 'text' }).subscribe((data: any) => {
        console.log('Got a token : ' + data);
        this.accessToken = data
        localStorage.setItem('token', data);
        this.intitializeDevice();
      });
    } catch (err) {
      console.log(err);
      console.log('An error occurred. See your browser console for more information.');
    }
  }

  async intitializeDevice () {
    console.log('Initializing device');
    const options: any = {
      logLevel: 1, enableRingingState: true,
      codecPreferences: ['pcmu', 'opus'],
      edge: 'ashburn',
    };
    this.device = await Twilio.Device.setup(this.accessToken,options);
    this.addDeviceListeners(this.device);
    // this.device[this.participantIndex].register();

  }

  addDeviceListeners(device) {
    this.startConference();
    // device.on('registered', () => {
    //   console.log('Twilio.Device Ready to make and receive calls!');
    //   this.startConference();
    //   if (this.callerType === 'callerType_PARTICIPANT') {
    //     // this.callParticipant();
    //   }
    // });

    // device.on('error', (error) => {
    //   console.log('Twilio.Device Error: ' + error.message);
    // });
  }
  async startConference() {
    this.currentValue = '';
    this.callerType = callerType_MODERATOR;
    this.conferenceId = `${this.dialedPhone}conferance`
    this.number = this.fromNumber;
    this.socket.emit('my message', `${this.conferenceId}`);
    this._pocnService.getTelephoneCountryCode(this.token)?.subscribe(async({ data }) => {
      let connectCountryCode;
      connectCountryCode = JSON.parse(JSON.stringify(data));
      this.countryCodeArray = connectCountryCode.getTelephoneCountryCode.data.countryCode;
    let phone=this.dialedPhone;
    let  validNumber = this.countryCodeArray.some(elem => phone.match('^' + elem));
    let dialedPhoneNumber;
    // if(!!validNumber){
    //   dialedPhoneNumber = this.dialedPhone;
    // }
    // else{
    //   dialedPhoneNumber = this.countryCodeArray[0] + this.dialedPhone;
    // }
    if (validNumber) {
      // Remove the existing country code
      phone = phone.replace(new RegExp(`^(${this.countryCodeArray.join('|')})`), '');
      // Add the country code from countryCodeArray[0]
      dialedPhoneNumber = this.countryCodeArray[1] + phone;
    } else {
      // Add the country code from countryCodeArray[0]
      dialedPhoneNumber = this.countryCodeArray[1] + phone;
    }
    const params = { to: dialedPhoneNumber, record: 'record-from-answer', callStatus: 'call', from: this.number, caller: '+18149134172', conferenceId: this.conferenceId };
    if (this.device) {
      if (this.dialedPhone !== null) {
        const connection  = await this.device.connect(params);
        this.participantList.push({"number":dialedPhoneNumber, "muted":true, "loading" : false})
        console.log("connection status:", connection);
        console.log("connection status:", this.participantList);
        this.showContent = true;
        connection.on("ringing", (hasEarlyMedia) => {
          console.log("The call has started and the other phone is ringing.");
        });
        connection.on("accept", (connection) => {
          console.log("The other person answered the phone!");
        });
        connection.on("disconnect", () => {
          console.log("The other person hung up.");
          this.getCommunicationHistory();
          this.router.navigate(['/dialer'])
          this.participantList = []
          this.muted = false;
        });
        connection.on('error', (error) => {
          this.router.navigate(['/dialer'])
          console.log("the call has an error", error);
        });
        connection.on('reject', () => {
          this.router.navigate(['/dialer'])
        });
      } else {
        console.log('Unable to make call.');
      }
    } else {
      console.log('Unable to make call.');
    }
    const spanName = "voice-call-initiated-btn";
      let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail")
      }
      const eventName = 'voice-call-initiated';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully voice-call-initiated' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
    })
  }
  start() {
    if (!this.running) {
      this.running = true;
      this.startTimer = setInterval(() => {
        this.ms++;
        this.ms = this.ms < 10 ? '0' + this.ms : this.ms;

        if (this.ms === 100) {
          this.sec++;
          this.sec = this.sec < 10 ? '0' + this.sec : this.sec;
          this.ms = '0' + 0;
        }

        if (this.sec === 60) {
          this.min++;
          this.min = this.min < 10 ? '0' + this.min : this.min;
          this.sec = '0' + 0;
        }

        if (this.min === 60) {
          this.hr++;
          this.hr = this.hr < 10 ? '0' + this.hr : this.hr;
          this.min = '0' + 0;
        }
      }, 10);
    } else {
      this.sec = '0' + 0
      this.min = '0' + 0
      this.ms = '0' + 0

    }
  }
  getCommunicationHistory = () =>{
    const body = JSON.stringify({"from":this.number,"to":this.dialedPhone})
    this.http.post(`${this.twilioServerURL}/callHistory`,body, { responseType: 'text'}).subscribe((data) => {
      this.history = JSON.parse(data)
      this.history.map((data)=>{
        this.addToCallLog(data)
      })
    });
  }
  async addToCallLog(logData) {
    this._pocnService.getUserBasicProfile(this.token).subscribe(({ data }) => {
      this.providerHcpNpi= data['getUserBasicProfile'].data['userBasicProfile']['npi'];
      this.providerId = data['getUserBasicProfile'].data['userBasicProfile']['providerId'];
      const duration = this.secondsToHms(logData.duration)
      const from = logData.from
      const to = logData.to
      const userId = this._pocnLocalStorageManager.getData("userId");
      const historyMutate = {
        fromPhone: from, 
        toPhone: to,
        type: "call", 
        duration: duration,
        providerId: parseInt(this.providerId),
        userId: userId,
        npi: this.providerHcpNpi
      }
      this._pocnService.addCallerHistory(historyMutate, this.token).subscribe(
        (response: any) => {
        })
      },
        (error) => {
            console.log(error)
        });
  }
  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hour, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " min, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " sec") : "";
    return `${hDisplay + mDisplay + sDisplay}`;
  }
  muteCall() {
    const bodyData = { participant: this.number, conferanceId: this.conferenceId , mute: this.muted };
      this.http.post(`${this.twilioServerURL}/muteCall`, bodyData, { responseType: 'text' }).subscribe((data) => {
      if(data === "muted") this.muted = true
      else if(data === "unmuted") this.muted = false
    })
    }


  getColor(){
    if(this.muted === true){
     return "rgb(254 61 47)"
    }
   }
  endCall() {
    this.device.disconnectAll()
    this.participantList = []
    this.muted = false
    const spanName = "voice-call-disconnection-btn";
      let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail")
      }
      const eventName = 'voice-call-disconnection';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully voice-call-disconnected' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
    this.router.navigate(["/dialer"]);
  }
  async addNewCallerPopOver() {
    const popover = await this.modalController.create({
      component: AddcallPopoverPage,
      cssClass: 'addCaller-modal',
      componentProps:{number:this.number,conferenceId:this.conferenceId,participantList:this.participantList}
    });
    popover.onDidDismiss().then((modalDataResponse) => {
     if(modalDataResponse.data.length > 1){
      this.listParticipant = modalDataResponse.data;
      this.showCallParticipant = true;
      this.showDialerPad = false;
      this.showCommonDialer = false;

     }
    });
    await popover.present();
  }
  // async addParticipant() {
  //   console.log("add participant");
  //   // this.callerType = callerType_PARTICIPANT;
  //   // this.participantIndex = this.participantIndex + 1;
  //   // this.startupClient();
  //   const params = { to: this.participantPhone, callStatus: 'call', from: this.number, conferenceId: this.conferenceId };
  //   this.http.post(`${this.twilioServerURL}/addParticipant`, params,{responseType:'text'}).subscribe((data)=>{
  //     console.log(data)
  //   })
  //   this.participantDailer = false;
  //   this.participantList.push({"number":this.participantPhone , "muted":true, "loading" : true})
  //   console.log(this.participantList)
  // }
  // writeToInput(value: string, number: string = "callee") {
  //   this.showBackButton = true;
  //   if (number === "participant") {
  //     this.currentValue = this.currentValue + value;
  //     this.participantPhone = this.currentValue
  //   } else {
  //     this.currentValue = this.currentValue + value;
  //     this.dialedPhone = this.currentValue
  //   }
  //   return;
  // }
  backSpace() {
    console.log('backspace')
    this.currentValue = this.currentValue.slice(0, -1)
    this.participantPhone = this.currentValue
    if (this.participantPhone == '') this.showBackButton = false;
  }
  showDialer(){
    this.showDialerPad = true;
    this.showCallParticipant = false;
    this.showCommonDialer = false;
  }

  async close() {
    await this.modalController.dismiss(this.participantList);
  }

  async showPopover(event, type, indexVal) {
    const popover = await this.popoverCtrl.create({
      component: DialerMorePopoverPage,
      cssClass: 'edit-modal',
      event,
      componentProps: {key1: type, list: indexVal,conferenceId:this.conferenceId, participantLists:this.listParticipant,
        onClick: (type) => {
        },
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if(modalDataResponse && modalDataResponse.data !== undefined){
        if(modalDataResponse.data.participantList.length > 1){
          this.showCallParticipant = true;
          this.showCommonDialer = false;
          this.showDialerPad = false;
          this.listParticipant = modalDataResponse.data.participantList;
        }
        else{
          this.listParticipant = modalDataResponse.data.participantList;
          this.showCallParticipant = false;
          this.showCommonDialer = true;
          this.showDialerPad = false;
        }
        console.log('ondismiss-------')
        console.log(this.listParticipant)
        console.log('ondismiss-------')
      }

     });
    await popover.present();
  }
}
