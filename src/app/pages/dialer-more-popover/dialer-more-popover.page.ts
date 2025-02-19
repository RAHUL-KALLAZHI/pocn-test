import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PopoverController } from "@ionic/angular";
import { GraphqlDataService } from 'src/app/services/graphql-data.service';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
import { TelemetryService } from 'src/app/services/telemetry.service';

@Component({
  selector: 'app-dialer-more-popover',
  templateUrl: './dialer-more-popover.page.html',
  styleUrls: ['./dialer-more-popover.page.scss'],
})
export class DialerMorePopoverPage implements OnInit {
  twilioServerURL = environment.twilioServerURL;
  @Input() key1: string;
  @Input() list: any;
  @Input() conferenceId: string;
  @Input() participantLists: any;
  constructor(private router: Router,
    private http: HttpClient,
    private modalController: ModalController,
    public alertController: AlertController,
    private popoverCtrl: PopoverController,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public telemetry:TelemetryService
    ) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') +'-'+ "more-dialer-popover";
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
    console.log(this.participantLists)
  }
  async disconnectParticipant() {
    const bodyData = { participant: this.list.number, conferenceId: this.conferenceId };
    this.http.post(`${this.twilioServerURL}/disconnectParticipant`, bodyData, { responseType: 'text' }).subscribe(async (data) => {
      if(data == "call disconnected"){
        // const index = this.participantLists.findIndex((item) => item.number === this.list.number);
        // this.participantLists.splice(index, 1);
        let dataList ={participantList:this.participantLists, list:this.list}
        console.log("popover :", this.participantLists);
        this.close(dataList);
      }
    })
  }
  async muteParticipant(muteStatus) {
    this.list.muted = muteStatus == 'mute'  ? false : true
    console.log('mute participant----------------------------')
    console.log(this.participantLists);
    console.log(this.list);
    console.log('mute participant----------------------------')
    const bodyData = { participant: this.list.number, conferenceId: this.conferenceId, mute : this.list.muted };
    this.http.post(`${this.twilioServerURL}/mute`, bodyData, { responseType: 'text' }).subscribe(async (data) => {
      console.log('data---')
      console.log(data)
      console.log('data---')
      if(muteStatus === "mute"){
        const index = this.participantLists.findIndex((item) => item.number === this.list.number);
        this.participantLists[index] =  this.list;
        let dataList ={participantList:this.participantLists, list:this.list}
        this.close(dataList);
      }else if(muteStatus === "unmute"){
        const index = this.participantLists.findIndex((item) => item.number === this.list.number);
        this.participantLists[index] =  this.list;
        let dataList ={participantList:this.participantLists, list:this.list}
        this.close(dataList);
      }
    })
  }
  async close(dataList) {
    await this.popoverCtrl.dismiss(dataList);
  }
}
