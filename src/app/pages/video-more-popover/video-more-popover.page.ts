import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { PopoverController } from "@ionic/angular";
import { TelemetryService } from 'src/app/services/telemetry.service';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-more-popover',
  templateUrl: './video-more-popover.page.html',
  styleUrls: ['./video-more-popover.page.scss'],
})
export class VideoMorePopoverPage implements OnInit {
  twilioServerURL: string = environment.twilioServerURL;
  isMuted: boolean ;
  participantName : string;
  trackSid: string;
  @Input() listTrack: any;
  @Input() showParticipants: any;
  @Input() showLocal: any;
  @Input() fullView: any;
  @Input() main:any;
  @Input() muteVideo:any;
  @Input() muteAudio:any;
  @Input() listRoom:any;
  @Input() roomName:any;
  constructor(
    public readonly renderer: Renderer2,
    private http: HttpClient,
    public alertController: AlertController,
    private popoverCtrl: PopoverController,
    public telemetry: TelemetryService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private router:Router,
  ) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-' + 'video-more-popover';
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
    this.listRoom?.participants.forEach(trackPublication => {
      trackPublication.videoTracks.forEach((track) => {
        if (track.trackSid === this.listTrack.sid) {
          this.participantName = trackPublication.identity
          trackPublication.audioTracks.forEach((track)=>{
            console.log(track.isSubscribed)
            this.isMuted = track.isSubscribed
          })
        }
      })
    })
  }

  async close(dataList) {
    await this.popoverCtrl.dismiss(dataList);
  }

  onClickParticipant(track){
    console.log("on dominant speaker", track)
    if (track.kind === "video") {
      console.log("kind video");
      this.showParticipants = true
    if(this.showParticipants){
      console.log(this.showParticipants)
    const element = track.attach();
    if(!this.showLocal){
    if(track.attach()){
      this.main();
      this.showLocal = true
    }
  }
    this.renderer.setStyle(element, 'width', '100%');
    this.renderer.setStyle(element, 'height', '100%');
    this.renderer.listen(element, 'click' ,(env)=>{
      this.showParticipants = true
    })
    this.renderer.appendChild(this.fullView.nativeElement, element)
      }
    }
    let dataList = {showParticipants :this.showParticipants , showLocal:this.showLocal, participantName: this.participantName, trackSid : null}
    this.close(dataList)
  }

  disconnectParticipant() {
    console.log("log", this.listRoom)
    this.trackSid = this.listTrack.sid
    let dataList = {showParticipants :this.showParticipants , showLocal:this.showLocal, participantName: this.participantName, trackSid: this.listTrack.sid}
    console.log(dataList)
    this.listRoom.participants.forEach(trackPublication => {
      console.log(trackPublication, "participants")
      trackPublication.videoTracks.forEach((track) => {
        if (track.trackSid === this.listTrack.sid) {
          console.log(trackPublication.sid)
          this.close(dataList)
          const bodyData = { uniqueName: this.roomName, identity: trackPublication.sid }
          this.http.post(`${this.twilioServerURL}/disconnectRemoteParticipant`, bodyData).subscribe((data) => {
            console.log(data, "data disconnection");
          })
        }
      })
    });
  }

  muteParticipants() {
    let participantList = []
    
    let identity = null;
    participantList.push(this.listRoom.localParticipant.identity)
    console.log(this.listRoom.localParticipant.identity)
    this.listRoom.participants.forEach(trackPublication => {
      console.log(trackPublication, "partcipants")
      trackPublication.videoTracks.forEach((track) => {
        if (track.trackSid !== this.listTrack.sid) {
          console.log("not selected video track")
          participantList.push(trackPublication.identity)
          console.log(participantList)
        }else{
          console.log("identity",trackPublication.identity)
          console.log(this.isMuted)
          identity = trackPublication.identity
        }
      })
    })
    const bodyData = {uniqueName : this.roomName,identity : identity, participantList :participantList , notMuted :this.isMuted}
      this.http.post(`${this.twilioServerURL}/muteRemoteVideoParticipant`, bodyData).subscribe((data:any) => {
        console.log(data); 
        let response = undefined
        if(data){
          this.close(response)
        }
      })
  }

}
