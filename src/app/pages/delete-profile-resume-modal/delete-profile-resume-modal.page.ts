import { Component, OnInit, Input} from '@angular/core';
import {  ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-delete-profile-resume-modal',
  templateUrl: './delete-profile-resume-modal.page.html',
  styleUrls: ['./delete-profile-resume-modal.page.scss'],
})
export class DeleteProfileResumeModalPage implements OnInit {
  constructor(
    public alertController: AlertController,
    private router:Router,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    public telemetry: TelemetryService,
  ) { 
  }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "delete-profile-resume-popover";
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
  
  deleteResume() {
    this.modalController.dismiss('confirm-delete');
  }

}





