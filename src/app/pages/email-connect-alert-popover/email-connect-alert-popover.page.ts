import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-email-connect-alert-popover',
  templateUrl: './email-connect-alert-popover.page.html',
  styleUrls: ['./email-connect-alert-popover.page.scss'],
})
export class EmailConnectAlertPopoverPage implements OnInit {

  constructor(public modalController: ModalController,
    private _pocnLocalStorageManager: LocalStorageManager,
    public telemetry: TelemetryService,
    private router: Router,) { }

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
  }
  async close(){
    await this.modalController.dismiss();
  }
}
