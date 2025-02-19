import {
  Component,
  ElementRef,
  Input,
  OnInit,ViewChild 
} from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, Subscriber, ReplaySubject } from 'rxjs';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import {
  CropperPosition,
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform,
} from 'ngx-image-cropper';
import { LoadingService } from 'src/app/services/loading.service';
import { TelemetryService } from 'src/app/services/telemetry.service';
import jsSHA from 'jssha';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})


export class ImageModalPage implements OnInit {
  @Input() data: unknown;
  @Input() userId: string;
  @Input() providerId: string;
  @Input() npi: string;
  @Input() imageFor: string;
  @Input() eventDetails: any;
  @Input() selectedImage: any;
  @Input() fileExtension: any;
  @Input() userAgent: string;
  @Input() deviceType: string;
  @ViewChild('profileImageUpdate') myInputVariable: ElementRef;
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  cropperPosition: CropperPosition= { x1: 0, y1: 0, x2: 150, y2: 150 };
  appPlatform: string = Capacitor.getPlatform();
  croppedImage: any = '';
  transform: ImageTransform = {};
  platform: string = Capacitor.getPlatform()
  isMobile: boolean = Capacitor.getPlatform() != 'web'
  profileImgStatus: boolean = false;
  bannerImgStatus: boolean = false;
  imageChangedEvent: any = '';
  imageType: string = "";
  background: any = null;
  myImage: Observable<any>;
  uploadedImg: any = {};
  imgErrorStatus: boolean = false;
  errorMsg: string = '';
  croppedImageSize: number = 0;
  fileLoader: boolean = false;
  imageOrginalSize: number = 0;
  imageSizeRestriction: number = 2;
  pickedImage:any;
  uploadedImgExtension:string;

  constructor(
    private modalController: ModalController, 
    private _pocnService: GraphqlDataService, 
    private _pocnLocalStorageManager: LocalStorageManager, 
    private router: Router,
    private loading: LoadingService,     
    public telemetry: TelemetryService,
    ) {
      
    }

  ngOnInit(): void {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "upload-profile-image-popover";
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
    this.pickedImage = '';
    if(this.eventDetails){
    this.convertToBase64(this.eventDetails.target.files[0]).subscribe(base64 => {
      this.pickedImage = base64;
      let extensionToArray =  this.eventDetails.target.files[0].type.split("/");
      //this.uploadedImgExtension = extensionToArray[1];
      this.uploadedImgExtension = 'jpeg';
     })
    }else{
      this.pickedImage = this.selectedImage
      //this.uploadedImgExtension = this.fileExtension
      this.uploadedImgExtension = 'jpeg'
    }
    if(this.imageFor == "banner_img"){
      this.bannerImgStatus = true;
    }
    if(this.imageFor == "profile_img"){
      this.profileImgStatus = true;
    }
    this.background = {
      backgroundImage: `url(${this.data})`
    }
  }

  dismissModal() {
    this.modalController.dismiss(this.uploadedImgExtension,this.pickedImage);
  }
  convertToBase64(file : File) : Observable<string> {
    const result = new ReplaySubject<any>(1);
    let reader = new FileReader();
    const realFileReader = (reader as any)._realReader;
    if (realFileReader) {
      reader = realFileReader;
    }
    reader.readAsDataURL(file);
    reader.onloadend =  function() {
      result.next(reader.result);
    };   
    return result;
  }

  onImageSelect(files: any){
    //console.log(files);
  }
  
  imageCropped(event: ImageCroppedEvent) {
    this.imgErrorStatus = false;
    let image: any;
    setTimeout(()=>{
      image = event.base64
      this.croppedImage = image;
      this.uploadedImg = image;
    },1000)
  }
  imageLoaded() {
      // show cropper
      if(this.loading.isLoading) this.loading.dismiss()
      console.log("Loaded");
      this.imgErrorStatus = false;
  }
  cropperReady() {
  }
  loadImageFailed() {
  }
  profileImageSave (){
    this.fileLoader = true;
    const imageMutate = {
      accessCode: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
      fileContent: this.uploadedImg,
      fileExtension: this.uploadedImgExtension, // to add extension
      fileName: this.userId+"."+this.imageType,
      imgType: "profile_img",
      npi: this.npi,
      providerId: this.providerId,
      userId: this.userId
    }
      this._pocnService.updateUserProfileImage(imageMutate).subscribe(
      (response: any) => {
        if(response.data.updateUserImage.userProfileUpdateResponse.status == "Success"){
          this._pocnLocalStorageManager.saveData(
            "imgExtension",this.uploadedImgExtension,
          );
          this.imgProxyUpload(this.userId,this.uploadedImgExtension);
          let logDetaiils = {
            accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
            npi: this.npi,
            logType: "Profile Update",
            channel: this.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
            ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation: "",
            description: "Updated profile image",
            activity: "Profile Image Update",
          }
          this._pocnService.updateUserLog(logDetaiils).subscribe((response: any) => {});
          const spanName = "profile-image-upload-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail")
          }
          const eventName = 'profile image upload';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully uploaded profile image' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
        }
        else{
          this.imgErrorStatus = true;
          this.fileLoader = false;
          this.errorMsg = response.data.updateUserImage.userProfileUpdateResponse.message;
          this.myInputVariable.nativeElement.value = "";
        }
      });
  }

   async imgProxyUpload(id,ext){            
    let imageurl = environment.postProfileImgUrl + id +"."+ ext;
    var encoded_url = btoa(imageurl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
         "/g:" + "no"  + "/" + encoded_url + "." + "jpg"; 
         var shaObj = new jsSHA("SHA-256", "BYTES")
         shaObj.setHMACKey(environment.imageProxyKey, "HEX");
         shaObj.update(this.hex2a(environment.imageProxySalt));             
         shaObj.update(path);            
        var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    
    let imgUrl = environment.imageProxyUrl + "/" + hmac +path+'?lastmod=' + Math.random();;
    let base64img;
    try{
    await this.getDataBlob(imgUrl).then((result) =>{
      base64img= result;
      this.handleBase64save(base64img);
    })
  }catch(err){
    this.imgErrorStatus = true;
      this.fileLoader = false;
      this.errorMsg = err;
      this.myInputVariable.nativeElement.value = "";
      this.dismissModal();
      this.router.navigate(["/tablinks/my-profile"]);
  }
    //console.log(base64img)

}
handleBase64save(base64img){
  const imageMutate = {
    accessCode: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
    fileContent: base64img,
    fileExtension: this.uploadedImgExtension, // to add extension
    fileName: this.userId+"."+this.imageType,
    imgType: "profile_img",
    npi: this.npi,
    providerId: this.providerId,
    userId: this.userId
  }
  this._pocnService.updateUserProfileImage(imageMutate).subscribe(
  (response: any) => {
    if(response.data.updateUserImage.userProfileUpdateResponse.status == "Success"){
      this._pocnLocalStorageManager.saveData(
        "imgExtension",this.uploadedImgExtension,
      );
      this.dismissModal();
      this.router.navigate(["/tablinks/my-profile"]);
    }
    else{
      this.imgErrorStatus = true;
      this.fileLoader = false;
      this.errorMsg = response.data.updateUserImage.userProfileUpdateResponse.message;
      this.myInputVariable.nativeElement.value = "";
    }
  });
}

hex2a(hexx:any) {    
  var hex = hexx.toString() //force conversion
  var str = ''
  for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}
async getDataBlob(url:any){
  var res = await fetch(url);
  var blob = await res.blob();
  var uri = await this.parseURI(blob);
  return uri;
}
async  parseURI(d:any){
  let reader = new FileReader(); 
  const realFileReader = (reader as any)._realReader; 
  if (realFileReader) {
    reader = realFileReader;
  }  // https://developer.mozilla.org/en-US/docs/Web/API/FileReader /
  reader.readAsDataURL(d);          // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL /
  return new Promise((res,rej)=> {  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise /
    reader.onload = (e:any) => {    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onload /
    res(e.target.result)
    }
  })
}
}
