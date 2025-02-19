import { Component, OnInit, Input } from '@angular/core';
import { EducationEditPopoverPage,} from "../education-edit-popover/education-edit-popover.page";
import { WorkhistoryEditPopoverPage,} from "../workhistory-edit-popover/workhistory-edit-popover.page";
import { DeletePopoverPage,} from "../delete-popover/delete-popover.page";
import { Router } from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { TokenManager } from "./../../services/token-manager";
import { AlertController, ModalController } from '@ionic/angular';
import { PopoverController } from "@ionic/angular";
import { ContactNode } from './../../services/type';
import { EditLicenseModalPage } from "../edit-license-modal/edit-license-modal.page";
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-more-popover',
  templateUrl: './more-popover.page.html',
  styleUrls: ['./more-popover.page.scss'],
})
export class MorePopoverPage implements OnInit {
  @Input() userAgent: string;
  @Input() deviceType: string;
  @Input() key1: string;
  @Input() key2: string;
  @Input() key3: [];
  @Input() key4: [];
  @Input()
  public onClick = (contact) => {}
  public token;
  public person;
  contactType: ContactNode[] = [];
  public contactInfoList: any[] = [{
    phoneNumber: '',
    faxNumber: '',
    mobilePhoneNumber: '',
    mobileCountryCode: '',
    email: '',
    contactType: '',
    isPrimary: ''
  }];
  contactPrimary: boolean[] = [];
  constructor(
    private popover: PopoverController,
    private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private modalController: ModalController,
    public alertController: AlertController,
    public telemetry: TelemetryService,) {
    this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  }
  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "more-popover";
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
  async showEditContactForm(){
    // if(this.key1 == 'contact'){
    //   const popover = await this.modalController.create({
    //     component: ContactEditPopoverPage,
    //     cssClass: 'contact-modal',
    //     componentProps: {key1: this.key2},

    //   });
    //   popover.onDidDismiss().then((modalDataResponse) => {
    //     if(modalDataResponse.data == 'contact'){
    //       this.onClick('contact');
    //     }
    //     else{
    //       this.onClick('contact-cancel');
    //     }
    //   });
    //   await popover.present();  
    // }
    if(this.key1 == 'education'){
      const popover = await this.modalController.create({
        component: EducationEditPopoverPage,
        cssClass: 'education-modal',
        componentProps: {key1: this.key2, userAgent: this.userAgent, deviceType: this.deviceType}

      });
      popover.onDidDismiss().then((modalDataResponse) => {
        if(modalDataResponse.data == 'education'){
          this.onClick('education');
        }
        else{
          this.onClick('education-cancel');
        }
      });
      await popover.present();  
    }
    // if(this.key1 == 'professional'){
    //   const popover = await this.modalController.create({
    //     component: EditProfileModalPage,
    //     cssClass: 'professional-modal',
    //     componentProps: {key1: this.key2},
  
    //   });
    //   popover.onDidDismiss().then((modalDataResponse) => {
    //     if(modalDataResponse.data == 'professional'){
    //       this.onClick('professional');
    //     }
    //     else{
    //       this.onClick('professional-cancel');
    //     }
    //   });
  
    //   await popover.present();  
    // }
    if(this.key1 == 'license'){
      const popover = await this.modalController.create({
        component: EditLicenseModalPage,
        cssClass: 'license-modal',
        componentProps: {key1: this.key2, key2: this.key4, userAgent: this.userAgent, deviceType: this.deviceType}
      });
      popover.onDidDismiss().then((modalDataResponse) => {
        if(modalDataResponse.data == 'license'){
          this.onClick('license');
        }
        else{
          this.onClick('license-cancel');
        }
      });
  
      await popover.present();  
    }
    if(this.key1 == 'workhistory'){
      const popover = await this.modalController.create({
        component: WorkhistoryEditPopoverPage,
        cssClass: 'workhistory-modal',
        componentProps: {key1: this.key2, userAgent: this.userAgent, deviceType: this.deviceType}

      });
      popover.onDidDismiss().then((modalDataResponse) => {
        if(modalDataResponse.data == 'workhistory'){
          this.onClick('workhistory');
        }
        else{
          this.onClick('workhistory-cancel');
        }
      });
      await popover.present();  
    }
  }

    async deleteRecord(){
     // if(this.key1 == 'contact'){
        const popover = await this.modalController.create({
          component: DeletePopoverPage,
          cssClass: 'delete-modal',
          componentProps: {key1: this.key1, key2:this.key2, key3:this.key3, userAgent: this.userAgent, deviceType: this.deviceType}
        });
        popover.onDidDismiss().then((modalDataResponse) => {
          if(modalDataResponse.data == 'contact'){
            this.onClick('contact');
          }
          else{
            this.onClick('contact-cancel');
          }
          if(modalDataResponse.data == 'education'){
            this.onClick('education');
          }
          else{
            this.onClick('education-cancel');
          }
          if(modalDataResponse.data == 'workhistory'){
            this.onClick('workhistory');
          }
          else{
            this.onClick('workhistory-cancel');
          }
          if(modalDataResponse.data == 'license'){
            this.onClick('license');
          }
          else{
            this.onClick('license-cancel');
          }
          if(modalDataResponse.data == 'professional'){
            this.onClick('professional');
          }
          else{
            this.onClick('professional-cancel');
          }
        });
        await popover.present();  
      }
 
  //  }

}
