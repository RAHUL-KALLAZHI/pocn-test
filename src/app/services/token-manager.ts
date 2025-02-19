import { Injectable } from '@angular/core';
import { GraphqlDataService } from './../services/graphql-data.service';
import { LocalStorageManager } from "./../services/local-storage-manager";


@Injectable({
  providedIn: 'root'
})
export class TokenManager {

  constructor( private _pocnService:GraphqlDataService, private pocnLocalStorageManager: LocalStorageManager ) { }
  cnt = 0;
  setRefreshTokenIntrvl(){
    //console.log("Renewal of token will call soon")
  setInterval(() => this.refreshToken(),300000);
  // this.refreshToken()
  }

  refreshToken(){
    // this.cnt = this.cnt + 1;
    // //console.log ('Count is ' + this.cnt);
    // const refreshTokenInput = {
    //   realm: "POCN",
    //   refreshToken: this.pocnLocalStorageManager.getData("refreshToken")
    // }
    // this._pocnService.getRefreshToken(refreshTokenInput).subscribe(
    //   (response: any) => {
    //     if (response.data) {
    //       //console.log(response);
    //       const jsonifyData = JSON.parse(response.data.refreshTokenRealm);
    //       //console.log(jsonifyData);
    //       this.pocnLocalStorageManager.saveData(
    //         "pocnApiAccessToken",
    //         jsonifyData.access_token,
    //       );
    //       this.pocnLocalStorageManager.saveData(
    //         "refreshToken",
    //         jsonifyData.refresh_token,
    //       );
    //       console.log("Token has been renewed")
    //     }
    //   });
  }
}