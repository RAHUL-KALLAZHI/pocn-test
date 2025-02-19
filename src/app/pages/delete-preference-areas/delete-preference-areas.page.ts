import { Component, OnInit, Input} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { ModalController } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-delete-preference-areas',
  templateUrl: './delete-preference-areas.page.html',
  styleUrls: ['./delete-preference-areas.page.scss'],
})
export class DeletePreferenceAreasPage implements OnInit {

  constructor(
    public alertController: AlertController,
    private router:Router,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    public telemetry: TelemetryService,
  ) { 
  }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+"delete-preference-area-popover";
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
  
  deleteAreaOfInterest() {
    this.modalController.dismiss('confirm-delete');
  }

}
