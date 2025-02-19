import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { Location } from '@angular/common';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
import { TelemetryService } from 'src/app/services/telemetry.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  refetchData;
  constructor(    private router:Router,
    private location:Location,
    private _pocnLocalStorageManager: LocalStorageManager,
    public telemetry: TelemetryService,
    ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
      this.refetchData = this.location.getState();
      console.log(this.refetchData)
      };
    });
  }

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
  backNavigation(){
    if(this.refetchData.connectMsg == "connect"){
      this.router.navigate(['/connect']);
    }
    else{
      this.router.navigate(['/settings']);
    }
  }
}
