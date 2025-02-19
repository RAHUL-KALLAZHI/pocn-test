import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { AlertController, ModalController } from '@ionic/angular';
import { PopoverController } from "@ionic/angular";
import { ContactNode } from './../../services/type';
import { DeleteProfileImagePage } from '../delete-profile-image/delete-profile-image.page';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-profile-image-update-popover',
  templateUrl: './profile-image-update-popover.page.html',
  styleUrls: ['./profile-image-update-popover.page.scss'],
})
export class ProfileImageUpdatePopoverPage implements OnInit {
  @ViewChild('profileImageUpdate') myInputVariable: ElementRef;
  @Input()
  @Input() selectImage: any;
  @Input() providerId: any;
  @Input() npi: any;
  @Input() userId: any;
  @Input() userAgent: string;
  @Input() deviceType: string;

  public onClick = () => {}
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
  loading: any;
  hasProImage: boolean = true;
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
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "profile-image-update-popover";
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
    this.hasProImage = (this._pocnLocalStorageManager.getData("imgExtension") !='' && this._pocnLocalStorageManager.getData("imgExtension") != null) ? true : false;
  }
  selectProfileImage(){
    this.selectImage();
  }
  async close(){
    this.modalController.dismiss();
  }
  delete(){
    this.deleteRecord();
  }
  async deleteRecord(){
    const popover = await this.modalController.create({
      component: DeleteProfileImagePage,
      cssClass: 'delete-modal',
      componentProps: {
        'userId': this.userId,
        'providerId': this.providerId,
        'npi':this.npi,
        'userAgent': this.userAgent,
        'deviceType': this.deviceType
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
        if(modalDataResponse.data == 'delete'){
          this.modalController.dismiss('profile-delete');
          this.onClick();
        }
    });
    await popover.present();  
  }
}
