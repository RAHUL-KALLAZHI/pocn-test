import { Component, OnInit } from '@angular/core';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { NgForm } from '@angular/forms';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  public emailInput = {
    username: '',
  }
  showSucessMsg:boolean =  false;
  showFailedMsg:boolean =  false;
  showEmailError:boolean = true ;
  setLoader: boolean = false;
  showProgressBar: boolean = false;
  showFinalMsg: boolean = false;

  constructor(private _pocnService: GraphqlDataService,    
    public telemetry: TelemetryService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private router:Router,
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

  forgotPassword(f:NgForm){
    this.showFailedMsg = false;
    //console.log(f);
    if(f.value['username']){
      let regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z](?:[a-z-]*[a-z])?$/g;
      let lowVal = f.value['username'].toLowerCase();
      let searchfind = regex.test(lowVal);
      if(f.value['username'] != '' && searchfind === true){
        this.showEmailError = true;
        //this.setLoader = true;
        this.showSucessMsg = true;

        this.showProgressBar =  true;
        this.showFailedMsg = false;
        this.emailInput.username = f.value['username'];
        this._pocnService.forgotPasswordApi(f.value['username'],window.location.hostname).subscribe(
          (response: any) => {
          if (response.data.forgotPasswordApi.forgotPasswordResult.status == 'Success') {
            //this.showSucessMsg = true;
            this.showFinalMsg = true;
            this.showProgressBar = false;
            
            //this.setLoader = false;
            const spanName = "forgot-password-btn";
            let attributes = {
              userEmail:f.value['username'],
            }
            //console.log(attributes);
            const eventName = 'forgot password';
            const event =  { 'userEmail': f.value['username'], 'status': 'success', 'message': 'successfully sent password reset link' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }   
          else{
            //error
            this.showFailedMsg = true
            //this.showProgressBar =  false;

            //this.setLoader = false;
            const spanName = "forgot-password-btn";
            let attributes = {
              userEmail:f.value['username'],
              reason: response.data.forgotPasswordApi.forgotPasswordResult.message
            }
            const eventName = 'forgot password';
            const event =  { 'userEmail': f.value['username'], 'status': 'success', 'message': 'failed to send password reset link' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          } 
        });
      }
      else{
        this.showEmailError = false;
      }
    }
  }
}
