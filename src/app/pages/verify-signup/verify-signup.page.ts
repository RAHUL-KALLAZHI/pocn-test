import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute,Params} from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { NgForm } from '@angular/forms';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-verify-signup',
  templateUrl: './verify-signup.page.html',
  styleUrls: ['./verify-signup.page.scss'],
})
export class VerifySignupPage implements OnInit {
  public tokenFromEmail: string;
  showInvalidTokenMesg: boolean = false;

  constructor(private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,) {
    const routeState = this.router?.getCurrentNavigation()?.extras.state;
    if (Capacitor.getPlatform() === 'web') {
      this.route.queryParams
        .subscribe(params => {
          this.tokenFromEmail = params.token;
        }
      );    
    }
    else{
      this.tokenFromEmail = routeState.token;
    }
  }


  ngOnInit() {
    this.verifyToken();
  }

  verifyToken(){
    this._pocnService.verifyUserWelcome(this.tokenFromEmail).subscribe(
      (response: any) => {
        if (response.data.verifyUserWelcome.updatePasswordResult.status =='Error') {
          // invalid token case
          this.showInvalidTokenMesg = true;
        }
        else{
          this.router.navigate(["/thankyou"]);
        }
    }); 
  }

}
