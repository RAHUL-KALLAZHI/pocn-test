import { Component, OnInit } from '@angular/core';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password-success',
  templateUrl: './reset-password-success.page.html',
  styleUrls: ['./reset-password-success.page.scss'],
})
export class ResetPasswordSuccessPage implements OnInit {

  constructor( public telemetry: TelemetryService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private router:Router,) { }

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

}
