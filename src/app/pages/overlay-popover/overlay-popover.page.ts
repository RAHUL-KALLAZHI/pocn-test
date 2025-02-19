import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
@Component({
  selector: 'app-overlay-popover',
  templateUrl: './overlay-popover.page.html',
  styleUrls: ['./overlay-popover.page.scss'],
})
export class OverlayPopoverPage implements OnInit {

  constructor(
    public modalController: ModalController,
    private router: Router,
    public telemetry: TelemetryService,
    private _pocnLocalStorageManager: LocalStorageManager,
  ) { }

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
    this.router.navigate(['/tablinks/my-profile'])

    await this.modalController.dismiss();
  }
}
