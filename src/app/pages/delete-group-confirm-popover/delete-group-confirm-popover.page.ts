import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { ModalController } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';

@Component({
  selector: 'app-delete-group-confirm-popover',
  templateUrl: './delete-group-confirm-popover.page.html',
  styleUrls: ['./delete-group-confirm-popover.page.scss'],
})
export class DeleteGroupConfirmPopoverPage implements OnInit {

  constructor(private modalController: ModalController,
    private router:Router,
    private _pocnLocalStorageManager: LocalStorageManager,
    public telemetry: TelemetryService,) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+"leave-group-popover";
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
  async close() {
    await this.modalController.dismiss();
  }

  leaveGroup() {
    this.modalController.dismiss('confirm-delete');
  }

}
