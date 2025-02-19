import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Filesystem } from '@capacitor/filesystem';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ios-selected-images',
  templateUrl: './ios-selected-images.page.html',
  styleUrls: ['./ios-selected-images.page.scss'],
})
export class IosSelectedImagesPage implements OnInit {
  @Input() selectedImageList: [];
  @Input() getUserProfile: any;
  @Input() userId: any;
  @Input() providerId: any;
  @Input() npi: any;
  @Input() imageFor: any;
  @Input() eventDetails: any;
  background;
  fileExtesion: any;
  pickedImage: any;
  imageUrlArray: Array<any> = [];
  constructor(
    public domSanitizer: DomSanitizer,
    private modalController: ModalController, 
    public loading: LoadingService,
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
     this.selectedImageList?.map((image:any) =>{
      let imgSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(image.webPath);
      this.imageUrlArray.push(imgSrc)
      return this.imageUrlArray
    });
    console.log("imageurl",this.imageUrlArray);
    if(this.loading.isLoading) this.loading.dismiss()
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async openImageModal() {
    //console.log(event);
    if(this.pickedImage){
       const modal = await this.modalController.create({
        component: ImageModalPage,
        cssClass: 'profileImage-modal',
        componentProps: {
          'userId': this.userId,
          'providerId': this.providerId,
          'npi':this.npi,
          'imageFor':'profile_img',
          'eventDetails':null ,
          'selectedImage':this.pickedImage,
          'fileExtension' :this.fileExtesion
        },
      });
      modal.onDidDismiss().then(data => {
        this.getUserProfile();
      })
      return await modal.present();
    }else{
    }
  }

  goToImageModal(i: number) {
    let content: any;
    let file: any;
    this.selectedImageList?.map(async (image: any, index: number) => {
      if (i === index) {
        this.loading.present();
        this.fileExtesion = image.format;
        try {
          content = await Filesystem.readFile({
            path: image.path
          })
        } catch (error) {
          console.log(error)
          if(this.loading.isLoading) this.loading.dismiss()
        }
        if (content) {
          file = `data:image/jpeg;base64,${content.data}`
          if(this.loading.isLoading) this.loading.dismiss()
          this.pickedImage = file;
          this.dismissModal()
          this.openImageModal()
          return;
        }
      }
    })
    return;
  }

}
