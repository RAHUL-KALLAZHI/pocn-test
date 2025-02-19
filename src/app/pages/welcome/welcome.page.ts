import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { AnimationController } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  public token: string = '';

  constructor(
    private animationCtrl: AnimationController,
    private _pocnLocalStorageManager: LocalStorageManager,
    private router: Router,
    public telemetry: TelemetryService,
    private httpClient: HttpClient,
    
    ) { }

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
    this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    let userId = this._pocnLocalStorageManager.getData("userId");
    if (this.token != '' && this.token != null && userId!=null && userId!='') {
      setTimeout(() => {
        this.router.navigate(["/tablinks/post"]);
      }, 1000);
    }else{
      setTimeout(() => {
        this.router.navigate(['/register']);
      }, 1000);
    }
  }

  ionViewWillEnter() {
    const animation = this.animationCtrl.create()
      .addElement(document.querySelector('ion-content'))
      .duration(500)
      .fromTo('opacity', '0', '1');
    animation.play();
  }
}
