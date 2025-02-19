import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { SendParticipantEmailResponse,AddParticipantResponse } from './../../services/type';
import { VideoInviteLinkPopoverPage } from "../video-invite-link-popover/video-invite-link-popover.page";
import { DeviceDetectorService } from 'ngx-device-detector';
//import { Geolocation } from '@capacitor/geolocation';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Router } from '@angular/router';
import { allowedNodeEnvironmentFlags } from 'process';
@Component({
  selector: 'app-video-call-popover',
  templateUrl: './video-call-popover.page.html',
  styleUrls: ['./video-call-popover.page.scss'],
})
export class VideoCallPopoverPage implements OnInit {
  emailPhone: string ='';
  senderId: string ='';
  showEmailError:boolean = true ;
  showCallCountryError:boolean = true;
  smsBody = null;
  twilioServerURL: string = environment.twilioServerURL;
  videoInviteLink: string = environment.videoCallInviteLink
  roomLink: any;
  public token: string;
  @Input() userRoomId: string;
  userIp = '';
  deviceType: string = '';
  geolocationPosition: string = '';
  userAgent: string;
  disableLinkBtn: boolean = false;
  public countryCodeArray;
  constructor(public modalController: ModalController,
    private http: HttpClient,
    public alertController: AlertController,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private deviceService: DeviceDetectorService,
    public telemetry: TelemetryService,
    private router:Router

    ) {
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    }

  ngOnInit() {
    this.getTelephoneCountryCode();
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-' + 'video-call-popover';
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
    if(this.isMobile == true){
      this.deviceType = "Mobile"
      }
      else if(this.isTablet == true){
      this.deviceType = "Tablet"
      }
      else if(this.isDesktop == true){
      this.deviceType = "Desktop"
      }
      else{
      this.deviceType = "Unknown"
      }
      this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();
      //this.getPosition();
      this.loadIp();
  }
  //get location
  // getCurrentPosition = async () => {
  //   const coordinates = await Geolocation.getCurrentPosition();
  //   this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
  // };
  // getPosition(): any {
  //   Geolocation.getCurrentPosition().then(coordinates => {
  //     this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
  //   }).catch((error) => {
  //     this.geolocationPosition = "";
  //     console.log('Error getting location', error);
  //   });
  // }
  ionViewDidEnter(){
    console.log("test")
    this.getTelephoneCountryCode();
  }
   //fetching browser details
 detectBrowserName() {
  const agent = window.navigator.userAgent.toLowerCase()
  switch (true) {
    case agent.indexOf('edge') > -1:
      return 'edge';
    case agent.indexOf('opr') > -1 && !!(<any>window).opr:
      return 'opera';
    case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
      return 'chrome';
    case agent.indexOf('trident') > -1:
      return 'ie';
    case agent.indexOf('firefox') > -1:
      return 'firefox';
    case agent.indexOf('safari') > -1:
      return 'safari';
    default:
      return 'other';
  }
}
detectBrowserVersion(){
  let userAgent = navigator.userAgent, tem,
  matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

  if(/trident/i.test(matchTest[1])){
      tem =  /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE '+(tem[1] || '');
  }
  if(matchTest[1]=== 'Chrome'){
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
  }
  matchTest= matchTest[2]? [matchTest[1], matchTest[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem= userAgent.match(/version\/(\d+)/i))!= null) matchTest.splice(1, 1, tem[1]);
  return matchTest.join(' ');
}
  get device(): any {
    return this.deviceService.getDeviceInfo();
    }

    get isMobile(): boolean {
    return this.deviceService.isMobile();
    }

    get isTablet(): boolean {
    return this.deviceService.isTablet();
    }

    get isDesktop(): boolean {
    return this.deviceService.isDesktop();
    }
  //load npi
  loadIp() {
    this.http.get('https://jsonip.com').subscribe(
      (value: any) => {
        this.userIp = value.ip;
      },
      (error) => {
      }
    );

  }
  
  async close(){
    await this.modalController.dismiss({emailPhone:this.senderId});
  }
  getTelephoneCountryCode(){
    this._pocnService.getTelephoneCountryCode(this.token)?.subscribe(({ data }) => {
      let connectCountryCode;
      connectCountryCode = JSON.parse(JSON.stringify(data));
      this.countryCodeArray = connectCountryCode.getTelephoneCountryCode.data.countryCode;
    })
  }
  sendVerifyEmailPhone(f:NgForm){
    if(f.value['emailPhone']){
      let regex = /^\d+$/;
      let phoneVal = f.value['emailPhone'].toLowerCase();
      let searchPhonefind = regex.test(phoneVal);
      //phone number section
      if(searchPhonefind === true){
        let mobilePhoneNumber = f.value['emailPhone'].replace('+', '');
        let countryCodes = this.countryCodeArray;
        let phone=mobilePhoneNumber;
        let validNumber = countryCodes.some(elem => phone.match('^' + elem));
        // if(f.value['emailPhone'].length < 11 || validNumber == false){
        //   this.showCallCountryError = false;
        // } else {
        //   this.showCallCountryError = true;
        // }
        if(f.value['emailPhone'].length < 10){
          this.disableLinkBtn = false;
          this.showCallCountryError = false;
        } else if(f.value['emailPhone'].length > 10 && validNumber == false){
          this.disableLinkBtn = false;
          this.showCallCountryError = false;
        }else {
          this.disableLinkBtn = true;
          this.showCallCountryError = true;
        }
        //for sending link to phone number
        if(this.userRoomId && this.showCallCountryError){
          let roomData: any;
          let countryCodes = this.countryCodeArray;
          let phone= this.emailPhone;
          let validNumber = countryCodes.some(elem => phone.match('^' + elem));
          let emailPhone;
          if(validNumber == true){
            emailPhone =this.emailPhone;
          }
          else{
            emailPhone =  this.countryCodeArray + this.emailPhone;
          }
              roomData = {
                accessToken: this.token,
                roomId:this.userRoomId,
                participantContact:f.value['emailPhone'],
                channel: this.userAgent,
                ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
                ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
                device: this.deviceType,
                geoLocation:'',
              }
              console.log(this.userRoomId)
              this._pocnService.addParticipant(roomData).subscribe(
                (response: AddParticipantResponse) => {
                  if(response.data.addParticipant.updateConnectionResponse.status === 'success') {

                    this.disableLinkBtn = true;
                    let smsContent = `Please join:${this.videoInviteLink}/web/?roomName=`+ response.data.addParticipant.updateConnectionResponse.data;
                    const bodyData = {"to":emailPhone,"message":smsContent}
                    this.http.post(`${this.twilioServerURL}/sendMessage`,bodyData).subscribe((data) => {
                    if(data["status"] === "accepted")  {
                      const spanName = "video-call-invite-link-phone-btn";
                      let attributes = {
                          userId: this._pocnLocalStorageManager.getData("userId"),
                          firstName: this._pocnLocalStorageManager.getData("firstName"),
                          lastName: this._pocnLocalStorageManager.getData("lastName"),
                          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                          roomId:this.userRoomId,
                        }
                      const eventName = 'video call invite link';
                      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully invited link through sms' }
                      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                          this.telemetry.parentTrace = result;
                      })
                      this.senderId = emailPhone
                      this.messageSent();
                    }});
                  }
              });

        }
      } else {//email section
            let regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z](?:[a-z-]*[a-z])?$/g;
            let lowVal = f.value['emailPhone'].toLowerCase();
            let searchfind = regex.test(lowVal);
            if(searchfind === true){
              let roomData: any;
              roomData = {
                accessToken: this.token,
                roomId:this.userRoomId,
                participantContact:f.value['emailPhone'],
                channel: this.userAgent,
                ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
                ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
                device: this.deviceType,
                geoLocation:'',
              }
              this._pocnService.addParticipant(roomData).subscribe(
                (response: AddParticipantResponse) => {
                  if (response.data.addParticipant.updateConnectionResponse.status === 'success') {
                    let mailData: any;
                    mailData = {
                      accessToken: this.token,
                      callUrl:`${this.videoInviteLink}/web/?roomName=`+ response.data.addParticipant.updateConnectionResponse.data ,
                      participantEmail:f.value['emailPhone'],
                      channel: this.userAgent,
                      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
                      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
                      device: this.deviceType,
                      geoLocation:'',
                    }
                    this._pocnService.sendParticipantEmail(mailData).subscribe(
                      (response: SendParticipantEmailResponse) => {
                        if (response.data.sendParticipantEmail.updateConnectionResponse.status === 'success') {
                          const spanName = "video-call-invite-link-email-btn";
                      let attributes = {
                          userId: this._pocnLocalStorageManager.getData("userId"),
                          firstName: this._pocnLocalStorageManager.getData("firstName"),
                          lastName: this._pocnLocalStorageManager.getData("lastName"),
                          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                          roomId:this.userRoomId,
                        }
                      const eventName = 'video call invite link';
                      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully invited link through email' }
                      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                          this.telemetry.parentTrace = result;
                      })
                      this.senderId = f.value['emailPhone']
                      this.messageSent();
                        }
                    });
                  }
              });
          }
          else{
            this.showEmailError = false;
          }
        }
      }
  }
  //message send
  async messageSent() {
    this.disableLinkBtn = false;
    const alert = await this.alertController.create({
      header: 'Invitation sent sucessfully',
      buttons: [
        {
          text: 'OK',
         handler:()=> {this.emailPhone = '';
        this.close();
        }

        }]
    });
    await alert.present();
  }
  async inviteLinkPopOver() {
    const popover = await this.modalController.create({
      component: VideoInviteLinkPopoverPage,
      cssClass: 'video-invite-link-modal',
    });
    popover.onDidDismiss().then((modalDataResponse) => {

    });
    await popover.present();
  }
}
