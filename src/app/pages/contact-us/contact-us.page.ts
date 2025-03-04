import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  constructor(private router: Router,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    public alertController: AlertController,
    public telemetry: TelemetryService,) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') ;
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

}
