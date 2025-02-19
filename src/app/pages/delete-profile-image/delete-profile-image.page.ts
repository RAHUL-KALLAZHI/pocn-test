import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GraphqlDataService } from 'src/app/services/graphql-data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
import { TelemetryService } from 'src/app/services/telemetry.service';

@Component({
  selector: 'app-delete-profile-image',
  templateUrl: './delete-profile-image.page.html',
  styleUrls: ['./delete-profile-image.page.scss'],
})
export class DeleteProfileImagePage implements OnInit {
  @Input() userAgent: string;
  @Input() deviceType: string;
  fileLoader: boolean;
  @Input() providerId: any;
  @Input() npi: any;
  @Input() userId: any;
  imgErrorStatus: boolean;
  errorMsg: any;
  myInputVariable: any;

  constructor(    private modalController: ModalController, 
    private _pocnService: GraphqlDataService, 
    private _pocnLocalStorageManager: LocalStorageManager, 
    private router: Router,
    private loading: LoadingService,     
    public telemetry: TelemetryService,) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+"delete-profile-image-popover";
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

  async close(){
    this.modalController.dismiss("delete");
  }
  deleteImage (){
    this.fileLoader = true;
    const imageMutate = {
      accessCode: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
      fileContent: '',
      fileExtension: '', 
      fileName: this._pocnLocalStorageManager.getData("userId")+".",
      imgType: "profile_img",
      npi: this.npi,
      providerId: this.providerId,
      userId: this._pocnLocalStorageManager.getData("userId")
    }
      this._pocnService.updateUserProfileImage(imageMutate).subscribe(
      (response: any) => {
        if(response.data.updateUserImage.userProfileUpdateResponse.status == "Success"){
          this._pocnLocalStorageManager.removeData("imgExtension");
          this.modalController.dismiss("delete");
          let logDetaiils = {
            accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
            npi: this.npi,
            logType: "Profile Update",
            channel: this.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
            ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation: "",
            description: "Deleted profile image",
            activity: "Profile Image Delete",
          }
          this._pocnService.updateUserLog(logDetaiils).subscribe((response: any) => {});
          const spanName = "profile-image-delete-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail")
          }
          const eventName = 'profile image delete';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully deleted profile image' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })

        }
        else{
          // this.imgErrorStatus = true;
          // this.fileLoader = false;
          // this.errorMsg = response.data.updateUserImage.userProfileUpdateResponse.message;
          // this.myInputVariable.nativeElement.value = "";
        }
      });
  }

}
