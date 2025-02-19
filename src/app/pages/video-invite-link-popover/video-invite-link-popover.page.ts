import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
import { Router } from '@angular/router';
@Component({
  selector: 'app-video-invite-link-popover',
  templateUrl: './video-invite-link-popover.page.html',
  styleUrls: ['./video-invite-link-popover.page.scss'],
})
export class VideoInviteLinkPopoverPage implements OnInit {

  constructor(public modalController: ModalController,
    public telemetry: TelemetryService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private router:Router,) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-' + 'video-invite-link-popover';
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
  async close(){
    await this.modalController.dismiss();
  }
}
