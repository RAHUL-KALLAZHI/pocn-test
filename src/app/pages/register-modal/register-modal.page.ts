import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { Output, EventEmitter } from '@angular/core';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { npiNotificationResponse, ProvderInfoNode } from './../../services/type'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.page.html',
  styleUrls: ['./register-modal.page.scss'],
})
export class RegisterModalPage implements OnInit {
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() states: string[];
  @Input() provideType: string;
  @Input() npi;
  @Input() city: string;
  provideTypes: any = [];
  lookupState: string = '';
  lookupProvider: string = '';
  lookupCity: string = '';
  // npiResults = [];
  pageLoaderStatus = true;
  npiResults: ProvderInfoNode[] = [];
  setLoader: boolean = false;
  setSuccess: boolean = false;
  selectWrapper;
  selectOptions;
  isModalOpen = false;
  email: string;
  message: string;
  supportEmail:any;
  npiErrMsg:any;
  npiEmptyResult:boolean;
  npiEmailCheck:boolean;
  setSignUpLoader:boolean;
  constructor(private modalCtr: ModalController,
    private router: Router,
    private _pocnService: GraphqlDataService,
    private loadingCtrl: LoadingController,
    
  ) { }

  ngOnInit() {
    //this.showLoading();

    this.getProviders();
    let npiData;
    if(this.npi){
      this._pocnService.getProviderInfoNpi(this.npi).subscribe(({ data }) => {
        npiData =  data.providerInfos.nodes;
        this.pageLoaderStatus = false;
        //this.loadingCtrl.dismiss();
        npiData.forEach((ed, index) => {
          if(ed['hcpDegreeGroupCode'].includes('PA') || ed['hcpDegreeGroupCode'].includes('NP')){
            this.npiResults = data.providerInfos.nodes;
          }
          else{
              this.npiResults =[];
            }
        });
      })
    }
    else if(this.firstName && this.lastName && this.states && this.provideType){
    this.setSuccess = false;
        this.setLoader = true;
        let filter: any = {};
        filter = {
          firstName: this.firstName.trim(),
          lastName: this.lastName.trim(),
          hcpDegreeGroupCode: this.provideType ,
          hcpState: this.states
    }
    if(this.city !='' && this.city !=null ){

      filter['hcpLocality'] = this.city.trim();
      this._pocnService.getProviderInfoCity(filter).subscribe(({ data }) => {
        this.npiResults = data.providerInfos.nodes;
        this.pageLoaderStatus = false;
        this.loadingCtrl.dismiss();
        this.setSuccess = true;
        this.setLoader = false;
      })
    }
    else{
        // filter = {
        //   firstName: this.firstName,
        // };
        // (this.lookupState != '') ? filter.hcpState = this.states : null;
        // (this.lastName != '') ? filter.lastName = this.lastName : null;
        // (this.lookupCity != '') ? filter.hcpLocality = this.city : null;
        // (this.lookupProvider != '') ? filter.hcpDegreeGroupCode = this.provideType : null;// (this.lookupProvider != '') ? filter.hcpDegreeCode = this.lookupProvider : null;
        this._pocnService.getProviderInfo(filter).subscribe(({ data }) => {
          this.npiResults = data.providerInfos.nodes;
         this.pageLoaderStatus = false;
         this.loadingCtrl.dismiss();
          this.setSuccess = true;
          this.setLoader = false;
        })
      }
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'circles',
    });

    loading.present();
  }
  
  getProviders = () => {
    this.provideTypes = [
      { id: 1, name: 'NP' },
      { id: 2, name: 'PA' },
      { id: 3, name: 'MD' },
      { id: 4, name: 'DO' },
      { id: 5, name: 'Others' }
    ]
  }


  selectLookUp = (el: ProvderInfoNode) => {
    this.modalCtr.dismiss({
      'npi': el
    });
  }

  closeLookUp = () => {
    this.modalCtr.dismiss({});
  }
  onCancel = (e) => {
    this.lookupProvider = '';
  }
   // Open the modal
    submitTicket() {
      this.setSignUpLoader = true;
      if(this.supportEmail){
        let npiNotificationRes = {
          fullName: this.firstName + ' ' + this.lastName,
          userEmail: this.supportEmail,
        }
        this._pocnService.sendNpiLookupFailureNotification(npiNotificationRes).subscribe({
          next: (response: npiNotificationResponse) => {
            const npiResult = response?.data?.sendNpiLookupFailureNotification?.npiLookupFailureNotificationResult?.status;
            const npiMessage = response?.data?.sendNpiLookupFailureNotification?.npiLookupFailureNotificationResult?.message;
            console.log('submitTicket', response?.data);
            this.setSignUpLoader = false;
            if (npiResult === 'success') {
              this.modalCtr.dismiss({});
            } else if (npiResult === 'error' && npiMessage === "Please provide a valid email address") {
              this.npiEmptyResult = true;
              this.npiErrMsg = npiMessage;
            }
          },
          error: (error) => {
            console.error('Error:', error);
          }
        });
      }else{
        this.npiEmailCheck=true;
      }
  }

  // Close the modal
  closeModal() {
    this.modalCtr.dismiss();
  }

  
}
