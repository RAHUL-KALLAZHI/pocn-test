import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import * as Video from 'twilio-video'
import {
  connect,
  Room,
} from 'twilio-video';
import { environment } from 'src/environments/environment';
import { VideoCallPopoverPage } from "../video-call-popover/video-call-popover.page";
import { ModalController, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { DeleteChatRoomResponse } from './../../services/type';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
//import { Geolocation } from '@capacitor/geolocation';
import { VideoMorePopoverPage } from '../video-more-popover/video-more-popover.page';
import { PopoverController , Platform } from "@ionic/angular";
import { Router } from '@angular/router';
import { TelemetryService } from 'src/app/services/telemetry.service';

@Component({
  selector: 'app-dialer2',
  templateUrl: './dialer2.page.html',
  styleUrls: ['./dialer2.page.scss'],
})
export class Dialer2Page implements OnInit {

  @ViewChild('localMedia', { static: false }) localMedia: ElementRef;
  @ViewChild('buttonLeave', { static: false }) buttonLeave: ElementRef;
  @ViewChild('list', { static: false }) listRef: ElementRef;
  @ViewChild('fullView') fullView: ElementRef;
  public roomSid: string;
  public activeRoom: any = null;
  public twilioAccessToken: string;
  participant: boolean = false;
  twilioServerURL: string = environment.twilioServerURL;
  participants: Array<any> = [];
  showParticipants: boolean = false;
  showLocal: boolean = false;
  roomCreateData;
  room: Room;
  isAudioMuted: boolean = false;
  isVideoMuted: boolean = false;
  userIp = '';
  deviceType: string = '';
  geolocationPosition: string = '';
  userAgent: string;
  isParticipantMuted: boolean = false ;
  ms: any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;
  running: boolean = false;
  startTimer = null;
  showTimer: boolean = false;
  backButtonSubscription: any;
  facingMode:string ='user';
  participantName: string;
  userProfileName: string;
  token: any;
  manuallyHidden: boolean = false;
  videoRoomName: string = '';
  providerId: any;
  providerHcpNpi: any;
  toEmail: string;
  constructor(
    public readonly renderer: Renderer2,
    private modalController: ModalController,
    private location: Location,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    private popoverCtrl: PopoverController,
    private router: Router,
    private platform: Platform,
    public telemetry: TelemetryService,
    private alertController: AlertController

  ) {
    this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
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
    this.roomCreateData = this.location.getState();
    console.log(this.roomCreateData,"roomData")
    this.startRoom();
    if (this.participants.length !== 0) {
      this.showParticipants = true
    }
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
     // this.getPosition();
      this.loadIp();
  }

  // getPosition(): any {
  //   Geolocation.getCurrentPosition().then(coordinates => {
  //     this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
  //   }).catch((error) => {
  //     this.geolocationPosition = "";
  //     console.log('Error getting location', error);
  //   });
  // }
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
    this.httpClient.get('https://jsonip.com').subscribe(
      (value: any) => {
        this.userIp = value.ip;
      },
      (error) => {
      }
    );

  }
  async showVideoPopOver() {
      const popover = await this.modalController.create({
        component: VideoCallPopoverPage,
        cssClass: 'addVideoCaller-modal',
        componentProps:{userRoomId:this.roomCreateData.userDataId}
      });
      popover.onDidDismiss().then((modalDataResponse) => {
        this.toEmail = modalDataResponse?.data?.emailPhone;
      });
      await popover.present();

  }

  startRoom = async () => {
    let userName: string;
    this._pocnService.getUserBasicProfile(this.token)?.subscribe(async({ data }) => {
      this.userProfileName = data['getUserBasicProfile'].data['userBasicProfile']['name'];
      userName =  data['getUserBasicProfile'].data['userBasicProfile']['name'];
      this.videoRoomName = `${userName}'s Room`
      if(this.roomCreateData.userDataId && this.userProfileName){
        const roomName = this.roomCreateData.userDataId;
        console.log(roomName,"log")
        // fetch an Access Token from the join-room route
        const response = await fetch(`${this.twilioServerURL}/join-room`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomName: roomName, userName: `${userName}-${this.roomCreateData.userDataId}`}),
        });
        const { token } = await response.json();
        console.log(token)
        // join the video room with the token
        const room = await this.joinVideoRoom(roomName, token);
        this.activeRoom = room;
        console.log("room:", room.localParticipant)
        // render the local and remote participants' video and audio tracks
        this.handleConnectedParticipant(room.localParticipant);
        room.participants.forEach(participant => this.handleConnectedParticipant(participant))
        room.on("participantConnected", participant => {
          this.handleConnectedParticipant(participant)
          this.running = true;
          this.start();
        });
        // handle cleanup when a participant disconnects
        room.on("participantDisconnected",participant => this.handleDisconnectedParticipant(participant));
        room.once('disconnected', room => {
          room.localParticipant.tracks.forEach(publication => {
            publication.track.detach().forEach(ele => ele.remove());
          })
        });
        window.addEventListener("pagehide", () => room.disconnect());
        window.addEventListener("beforeunload", () => room.disconnect());
        room.on('dominantSpeakerChanged', participant => {
          console.log(participant,":onDominant")
          participant.tracks.forEach((trackPublication) => {
            if(!this.manuallyHidden){
            this.onClickParticipant(trackPublication.track)
            }
          })
        });
      }
      })
      const spanName = "create-video-room";
      let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail")
      }
      const eventName = 'create-video-room';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully video-call created' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
  };

  async showLocalParticipant() {
    this.handleLocalParticipant(this.activeRoom.localParticipant);
  }

  handleLocalParticipant = (participant) => {
    console.log("entered on local participant", participant)
    participant.tracks.forEach((trackPublication) => {
      this.handleTrackPublication(trackPublication, participant);
    });
    participant.on("trackPublished", this.handleTrackPublication);
  };

  handleConnectedParticipant = (participant) => {
    this.participants.push(participant)
    console.log("entered on remote participant")
    const spanName = "new-participant-connected";
      let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail")
      }
      const eventName = 'new-participant-connected';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully new-participant connected' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
    participant.tracks.forEach((trackPublication) => {  

      this.handleTrackPublicationRemote(trackPublication, participant);
    });
    participant.on("trackPublished", this.handleTrackPublicationRemote);

  };

  handleTrackPublication = (trackPublication, participant) => {
    if (trackPublication.track) {
      this.displayTrack(trackPublication.track);
    }
    trackPublication.on("subscribed", this.displayTrack);
    // trackPublication.on('unsubscribed', this.trackUnsubscribed);
  };
  trackUnsubscribed(track) {
    track.detach().forEach(ele => ele.remove());
    this.showLocal = true;
  }

  displayTrack(track) {
    const videoElement = track.attach();
    this.renderer.setStyle(videoElement, 'height', '100%');
    this.renderer.setStyle(videoElement, 'width', '100%');
    this.renderer.appendChild(this.localMedia.nativeElement, videoElement);
  }

  handleTrackPublicationRemote = (trackPublication, participant) => {
    if (trackPublication.track) {
      this.displayTrackRemote(trackPublication.track,participant);
    }
    trackPublication.on("subscribed", track => {
      this.displayTrackRemote(track , participant);
      console.log(track)
    });
    trackPublication.on('unsubscribed', this.trackUnsubscribed);
  };

  displayTrackRemote(track , participant) {
    console.log(track,'remote track')
    const element = track.attach();
    if (track.kind === "video") {
      console.log("Video")
      let participantName = participant.identity.split('-').shift()
      const label= this.renderer.createElement('label');
      this.renderer.addClass(label, track.sid);
      console.log(track.sid)
      const text = this.renderer.createText(participantName);
      this.renderer.appendChild(label, text);
      this.renderer.appendChild(this.listRef.nativeElement, label);
    }
    this.renderer.data.id = track.sid;
    this.renderer.listen(element, 'click' ,(env)=>{
      if(participant.sid == this.activeRoom.localParticipant.sid ){
        return
      }else{
        this.showPopover(track)
      }
    })
    this.renderer.setStyle(element, 'width', '31%');
    this.renderer.setStyle(element, 'margin', '1%');
    this.renderer.appendChild(this.listRef.nativeElement, element);
  }

  sendVideoLog(duration) {
    this._pocnService.getUserBasicProfile(this.token).subscribe(({ data }) => {
    this.providerHcpNpi= data['getUserBasicProfile'].data['userBasicProfile']['npi'];
    this.providerId = data['getUserBasicProfile'].data['userBasicProfile']['providerId'];
    const to =  this.toEmail
    const userId = this._pocnLocalStorageManager.getData("userId");
    const fromPhone = this._pocnLocalStorageManager.getData("userEmail")
    const historyMutate = {
      fromPhone, //TODO: to be replaced with 'from' as it's type get's updated to string in the backend
      toPhone: to,
      type: "video", //TODO: need to change accordingly
      duration: `${duration}sec`,
      providerId: parseInt(this.providerId),
      userId: userId,
      npi: this.providerHcpNpi
    }
    this._pocnService.addCallerHistory(historyMutate, this.token).subscribe(
      (response: any) => {
        console.log("saved to db", response)
      })
    },(error) => {
      console.log(error);
  });
  }

  leaveRoom() {
    const bodyData = {uniqueName : this.roomCreateData.userDataId }
    this.httpClient.post(`${this.twilioServerURL}/disconnectVideoRoom`, bodyData).subscribe((data: any) => {
      this.httpClient.get(`${this.twilioServerURL}/videoCallHistory?roomName=${this.roomCreateData.userDataId}`).subscribe((data: any) => {
        const duration = data?.data[0].duration
        this.sendVideoLog(duration)
      })
    })
   this.activeRoom = null;
    let removeRoomData;
    removeRoomData = {
      accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
      roomId:this.roomCreateData.userDataId,
      channel: this.userAgent,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      geoLocation:'',
    }
    this._pocnService.deleteChatRoom(removeRoomData).subscribe(
      (response: DeleteChatRoomResponse) => {
        if (response.data.deleteChatRoom.updateConnectionResponse.status === 'success') {
          const spanName = "dialer-delete-chat-room-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail")
          }
          const eventName = 'dialer delete chate room';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully deleted room' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
         this.router.navigate(['/tablinks/my-profile'])
        }
    });
  }
  onFullScreenVideoClick(){
    this.showParticipants = false
    this.manuallyHidden = true
  }

  onClickParticipant(track){
    this.activeRoom.participants.forEach(trackPublication => {
      trackPublication.videoTracks.forEach((listTrack) => {
        if (track.trackSid === listTrack.sid) {
          let participantName = trackPublication.identity.split('-').shift()
          this.participantName = participantName
        }
      })
    })
    this.showParticipants = true
    console.log("on dominant sopeaker", track)
    if (track.kind === "video") {
    if(this.showParticipants ){
    const element = track.attach();
    if(!this.showLocal){
    if(track.attach()){
      this.showLocalParticipant();
      this.showLocal = true
    }
  }
    this.renderer.setStyle(element, 'width', '100%');
    this.renderer.setStyle(element, 'height', '100%');
    this.renderer.appendChild(this.fullView.nativeElement, element)
  }
  }
  }

  // async ngAfterViewInit() {
  //   console.log("view initialized")
  //   if (this.listRef && this.listRef.nativeElement) {
  //     console.log("initialized")
  //     if (this.activeRoom) {
  //       console.log(this.activeRoom)
  //       this.activeRoom.on("participantConnected", participant => this.handleConnectedParticipant(participant));
  //     }
  //   }
  // }

  handleDisconnectedParticipant = (participant) => {
    
    participant.tracks.forEach((trackPublication) => {
      if (trackPublication.kind === 'video') {
        let trackSid = trackPublication.trackSid;
        console.log('video track sid to remove name', trackSid);
        if (trackSid) {
          const element = this.listRef.nativeElement.querySelector(`.${trackSid}`);
          this.renderer.removeChild(this.listRef.nativeElement, element);
          this.showLocal = true;
          this.showParticipants = false;
        }
      }
    });
    console.log(participant)
    const spanName = "participant-disconnected";
      let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail")
      }
      const eventName = 'participant-disconnected';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully participant-disconnected' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
  };

  joinVideoRoom = async (roomName, token) => {

    // join the video room with the Access Token and the given room name
    const room = await connect(token,{
      name: roomName,
      audio: true,
      video: { height: 720, frameRate: 24, width: 1280 },
      bandwidthProfile: {
        video: {
          mode: 'grid'
        }
      },
      maxAudioBitrate: 16000, //For music remove this line
      networkQuality: { local: 1, remote: 1 },
      dominantSpeaker: true
    });
    return room;
  };

  isAttachable(track: Video.RemoteTrack): track is Video.RemoteAudioTrack | Video.RemoteVideoTrack {
    return !!track &&
      ((track as Video.RemoteAudioTrack).attach !== undefined ||
        (track as Video.RemoteVideoTrack).attach !== undefined);
  }

  muteVideo() {
    if (this.isVideoMuted) {
      console.log("clicked")
      this.isVideoMuted = false
      const opts = {
        audio: false,
        video: true
      }
      this.unmute(opts)
    } else {
      this.isVideoMuted = true
      console.log("clicked")
      const opts = {
        audio: false,
        video: true
      }
      this.mute(opts)
    }
  }

  muteAudio() {
    if (this.isAudioMuted) {
      console.log("clicked")
      this.isAudioMuted = false
      const opts = {
        audio: true,
        video: false
      }
      this.unmute(opts)
    } else {
      this.isAudioMuted = true
      const opts = {
        audio: true,
        video: false
      }
      this.mute(opts)
    }
  }

  mute(opts) {
    if (!this.activeRoom || !this.activeRoom.localParticipant)
        throw new Error('You must be connected to a room to mute tracks.');

    if (opts.audio) {
        this.activeRoom.localParticipant.audioTracks.forEach(
            publication => {
              publication.track.disable();
              console.log('audio disabled ');
          }
        );
    }

    if (opts.video) {
      console.log('video disabled ')
        this.activeRoom.localParticipant.videoTracks.forEach(
            publication => publication.track.disable()
        );
    }
}

unmute(opts) {
  if (!this.activeRoom || !this.activeRoom.localParticipant)
      throw new Error('You must be connected to a room to mute tracks.');

  if (opts.audio) {
    console.log('audio enabled ')
      this.activeRoom.localParticipant.audioTracks.forEach(
          publication => publication.track.enable()
      );
  }

  if (opts.video) {
    console.log('video enabled ')
      this.activeRoom.localParticipant.videoTracks.forEach(
          publication => publication.track.enable()
      );
  }
}

async showPopover(track) {
  const popover = await this.popoverCtrl.create({
    component: VideoMorePopoverPage,
    cssClass: 'edit-modal',
    event,
    componentProps: {
      listTrack: track,
      listRoom: this.activeRoom,
      showParticipants: this.showParticipants,
      showLocal: this.showLocal,
      fullView: this.fullView,
      roomName: this.roomCreateData.userDataId,
      main: () => this.showLocalParticipant(),
      muteAudio: () => this.muteAudio,
      muteVideo: () => this.muteVideo,
      onClick: (type) => {
      },
    },
  });
  popover.onDidDismiss().then((modalDataResponse) => {
    if(modalDataResponse && modalDataResponse.data !== undefined){
      console.log(modalDataResponse," datalist");
      if(modalDataResponse?.data){
        console.log(modalDataResponse.data);
        let participantName = modalDataResponse.data.participantName.split('-').shift()
        this.showParticipants = modalDataResponse.data.showParticipants
        this.showLocal = modalDataResponse.data.showLocal
        this.participantName = participantName
        let trackSid =  modalDataResponse.data.trackSid
        console.log("video track sid to remove name",trackSid)
        if(trackSid){
          const element = this.listRef.nativeElement.querySelector(`.${trackSid}`);
          this.renderer.removeChild(this.listRef.nativeElement, element);
        }
      }
      else{

      }
      console.log('ondismiss-------')
      console.log('ondismiss-------')
    }

   });
  await popover.present();
}


disconnectParticipant(){
  console.log("log",this.activeRoom)
  this.activeRoom.participants.forEach(trackPublication =>{
  console.log(trackPublication)
  const bodyData = {uniqueName : this.roomCreateData.userDataId ,identity : trackPublication.sid }
    this.httpClient.post(`${this.twilioServerURL}/disconnectRemoteParticipant`, bodyData).subscribe((data) => {
      console.log(data,"data disconnection");
    })
  })
}

  async flipCamera() {
    let cameraTrack: any;
    const { videoTracks } = this.activeRoom?.localParticipant
    await videoTracks.forEach(track => {
      if (track.kind === 'video') {
        console.log(track.track, "track")
        cameraTrack = track.track
      }
    });
    if (this.facingMode === 'user') this.facingMode = 'environment'
    else this.facingMode = 'user'
    setTimeout(() => {
      cameraTrack.restart({ facingMode: this.facingMode });
    }, 1000)
  }

start() {
  if (this.running) {
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

async showAlert(){
    const alert = await this.alertController.create({
      header: 'If you go back, video room will be disconnected. Do you want to continue?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler:()=>{}
        },
        {
          text: 'OK',
          role: 'confirm',
          handler:()=>{
            this.leaveRoom()
            this.router.navigate(['/tablinks/my-profile'])
          }
        }
      ]
    });
    await alert.present();
}

ionViewDidEnter() {
  this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {

  });
}

ionViewDidLeave() {
  this.backButtonSubscription.unsubscribe();
}


}
