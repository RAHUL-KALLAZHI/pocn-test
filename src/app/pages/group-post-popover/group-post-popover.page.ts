import { Component, OnInit,Input, ElementRef, ViewChild } from '@angular/core';
import {  ModalController, ActionSheetController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { Observable, ReplaySubject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CreatePostResponse } from './../../services/type';
import { DeviceDetectorService } from 'ngx-device-detector';
import {IonInput} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { AlertController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File as ionicFile } from '@ionic-native/file/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Filesystem } from '@capacitor/filesystem';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Router } from '@angular/router';
import { PhotoPlugin } from 'src/plugins/imagePicker';
@Component({
  selector: 'app-group-post-popover',
  templateUrl: './group-post-popover.page.html',
  styleUrls: ['./group-post-popover.page.scss'],
})
export class GroupPostPopoverPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  userIp: string = '';
  postData: any;
  userAgent: any;
  attachmentTypeContent= {};
  type:number;
  description='';
  hideImg: boolean = true;
  showRename: boolean = true;
  postFileName = "";
  fileSize: any;
  fileType: string;
  fileDate: string;
  idfileErrorStatus:boolean = false;
  errorMsg = '';
  postImageErrorMsg: boolean = false;
  postErrorMsg = '';
  resumeFileType = ["image/jpeg", "image/jpg", "image/png","image/PNG", "image/JPG", "image/JPEG","video/mp4", 'video/mpg', 'video/mpeg', 'video/quicktime', 'audio/mp3', 'audio/mpeg', 'audio/wav'];
  deviceType: string = '';
  showDescriptionErr: boolean = true;
  showImage: boolean = true;
  postTypeList: any;
  date = new Date();
  videoContent  = {};
  showVideo: boolean = true;
  showDeleteIcon: boolean = true;
  showImageData:boolean = true;
  focusIsSet!: boolean;
  appPlatform: string = Capacitor.getPlatform();
  postFileType: string;
  @ViewChild('autoFocus', {static: false}) autoFocus!: IonInput;
  @ViewChild('pickImageInput ') pickImageInput : ElementRef;
  @Input() groupId: string;

  showEmojiPicker: boolean = false;
  message : any;
  disablePostBtn: boolean = false;
  showAlertPostSuccess:boolean = true;

  constructor(private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    private httpClient: HttpClient,
    private _pocnService: GraphqlDataService,
    private deviceService: DeviceDetectorService,
    public alertController: AlertController,
    private mediaCapture:  MediaCapture,
    private actionSheetCtrl: ActionSheetController,
    private file: ionicFile,
    public domSanitizer: DomSanitizer,
    public telemetry: TelemetryService,
    private router:Router,
    )
     {
    }
    // public ngAfterViewChecked(): void {
    //   if (!this.focusIsSet) {
    //     this.autoFocus.setFocus();
    //    // Disable focus on setTimeout()
    //     // Timeout needed for buggy behavior otherwise!
    //     setTimeout(() => {this.focusIsSet = true; }, 1000);
    //   }
    // }
  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "group-post-popover";
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
    this.loadIp();
    this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();
  if(this.isMobile == true){
    this.deviceType = "Mobile"
    }
    else if(this.isTablet == true){
    this.deviceType = "Tablet"
    }
    else if(this.isDesktop == true){
    this.deviceType = "Desktop"
    }
    else{
    this.deviceType = "Unknown"
    }
  }
//device details
get device(): any {
  return this.deviceService.getDeviceInfo();
  }

  get isMobile(): boolean {
  return this.deviceService.isMobile();
  }

  get isTablet(): boolean {
  return this.deviceService.isTablet();
  }

  get isDesktop(): boolean {
  return this.deviceService.isDesktop();
  }
//fetching browser details
detectBrowserName() {
const agent = window.navigator.userAgent.toLowerCase()
switch (true) {
  case agent.indexOf('edge') > -1:
    return 'edge';
  case agent.indexOf('opr') > -1 && !!(<any>window).opr:
    return 'opera';
  case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
    return 'chrome';
  case agent.indexOf('trident') > -1:
    return 'ie';
  case agent.indexOf('firefox') > -1:
    return 'firefox';
  case agent.indexOf('safari') > -1:
    return 'safari';
  default:
    return 'other';
}
}
detectBrowserVersion(){
let userAgent = navigator.userAgent, tem,
matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

if(/trident/i.test(matchTest[1])){
    tem =  /\brv[ :]+(\d+)/g.exec(userAgent) || [];
    return 'IE '+(tem[1] || '');
}
if(matchTest[1]=== 'Chrome'){
    tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
    if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
}
matchTest= matchTest[2]? [matchTest[1], matchTest[2]]: [navigator.appName, navigator.appVersion, '-?'];
if((tem= userAgent.match(/version\/(\d+)/i))!= null) matchTest.splice(1, 1, tem[1]);
return matchTest.join(' ');
}
async closeAlert(data){
  await this.modalController.dismiss(data);

}
getFileContent(){

}
//for fetching ipaddress
loadIp() {
this.httpClient.get('https://jsonip.com').subscribe(
  (value:any) => {
    this.userIp = value.ip;
  },
  (error) => {
    console.log(error);
  }
);

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

  async selectFile() {
    console.log("...clicked")
    let permissions: any;
    let permissionList: any;
    let image: any;
    switch (this.appPlatform) {
      case 'web':
        this.pickImageInput.nativeElement.click()
        break;
      case 'android':
        try {
          permissions = await Camera.requestPermissions();
        } catch (error) {
          console.log(error)
        }
        permissionList = await Camera.checkPermissions();
        console.log("checking permissions.....", permissionList, permissions)
        if ( permissionList.photos === 'granted' ) {
          this.pickImageInput.nativeElement.click()
        }else{
          this.presentAlert()
        }
        break;
      case 'ios':
        try {
          permissions = await Camera.requestPermissions();
        } catch (error) {
          console.log(error)
        }
        permissionList = await Camera.checkPermissions();
        console.log("checking permissions.....", permissionList, permissions)
        if ( permissionList.photos === 'granted') {
          try {
            image = await Camera.getPhoto({
              quality: 80,
              allowEditing: false,
              resultType: CameraResultType.Base64,
              saveToGallery: true,
              correctOrientation: true,
              source: CameraSource.Photos
            });
          } catch (error) {
            console.log(error)
          }
          if (image) {
            this.cameraImageUpload(image.base64String)
          }
        }else if(permissionList.photos === 'limited'){
          try {
            image = await PhotoPlugin.getPhoto({ message: 'SINGLE' });
            if (image) {
              this.cameraImageUpload(image.dataImage)
            }
          } catch (error) {
            console.log(error);
            return;
          }
        }else {
          this.presentAlert()
        }
        break;
    }
  }

  async takeImage() {
    switch (this.appPlatform) {
      case 'web':
        this.pickImageInput.nativeElement.click()
        break;
      case 'android':
        // this.selectImagePickOption()
        this.getImageAndroid()
        break;
      case 'ios':
        // this.selectImagePickOption()
        this.getImageIOS()
        break;
    }
  }

  async getImageAndroid() {
    let permissionList: any;
    let image: any;
    try {
      await Camera.requestPermissions();
    } catch (error) {
      console.log(error)
    }
    permissionList = await Camera.checkPermissions();
    console.log("%c checking permissions.....", permissionList, 'color: yellow')
    if (permissionList.camera === 'granted') {
      try {
        image = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          saveToGallery: true,
          correctOrientation: true,
          source: CameraSource.Camera
        });
      } catch (error) {
        console.log(error)
      }
      if (image) {
        this.cameraImageUpload(image.base64String)
      }
    } else {
      this.presentAlert()
    }
  }

  async getVideoAndroid() {
    let options: CaptureVideoOptions = {
      limit: 1
    }
    this.mediaCapture.captureVideo(options).then(async (res: MediaFile[]) => {
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      this.fileType = 'mp4';
      this.postFileName = capturedFile.name;
      this.postFileType = capturedFile.type;
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');
      var toDirectory = this.file.dataDirectory;
      this.file.copyFile(fromDirectory, fileName, toDirectory, fileName).then(async (res) => {
        let path = this.file.dataDirectory + fileName;
        let myURL = Capacitor.convertFileSrc(path);
        this.videoContent = myURL;
        let content = await Filesystem.readFile({ path })
        const buffer: any = content.data.substring(content.data.indexOf(',') + 1);
        this.fileSize =  buffer.length / 1000000;
        if(this.resumeFileType.includes(this.postFileType)){
          this.showImageData = false;
          this.showDeleteIcon = false;
          this.idfileErrorStatus = false;
          this.postImageErrorMsg = false;
        }
        if ((this.fileSize) <= 12) {
          this.attachmentTypeContent = `data:video/quicktime;base64,${content.data}`
          this.showImage = true;
          this.showVideo = false;
          this.showImageData = false
        } else {
          this.postImageErrorMsg = true;
          let errorMsg = "Maximum file upload size is restricted to 12 MB.";
          this.postErrorMsg = errorMsg;
        }
        return
      }, err => {
        console.log('err: ', err);
      });
    },
      (err: CaptureError) => console.error(err));
  }

  async getImageIOS() {
    let permissionList: any;
    let image: any;
    try {
      await Camera.requestPermissions();
    } catch (error) {
    }
    permissionList = await Camera.checkPermissions();
    if (permissionList.camera === 'granted') {
      try {
        image = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          saveToGallery: true,
          correctOrientation: true,
          source: CameraSource.Camera
        });
      } catch (error) {
        console.log(error)
      }
      if (image) {
        this.cameraImageUpload(image.base64String)
      }
    } else {
      this.presentAlert()
    }
  }

  async getVideoIOS() {
    let options: CaptureVideoOptions = {
      limit: 1
    }
    this.mediaCapture.captureVideo(options).then(async (res: MediaFile[]) => {
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      this.fileType = 'MOV';
      this.postFileName = capturedFile.name;
      this.postFileType = capturedFile.type;
      let toFileName = fileName;
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');
      var toDirectory = this.file.dataDirectory;
      this.file.copyFile(fromDirectory, fileName, toDirectory, toFileName).then(async (res) => {
        let path = this.file.dataDirectory + toFileName;
        let win: any = window;
        var webPathUri = win.Ionic.WebView.convertFileSrc(path);
        let videoSrc: SafeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(webPathUri);
        this.videoContent = videoSrc;
        let content = await Filesystem.readFile({ path })
        const buffer: any = content.data.substring(content.data.indexOf(',') + 1);
        this.fileSize =  buffer.length / 1000000;
        if(this.resumeFileType.includes(this.postFileType)){
          this.showImageData = false;
          this.showDeleteIcon = false;
          this.idfileErrorStatus = false;
          this.postImageErrorMsg = false;
        }
        if ((this.fileSize) <= 12) {
          this.attachmentTypeContent = `data:video/quicktime;base64,${content.data}`
          this.showImage = true;
          this.showVideo = false;
          this.showImageData = false
        } else {
          this.postImageErrorMsg = true;
          let errorMsg = "Maximum file upload size is restricted to 12 MB.";
          this.postErrorMsg = errorMsg;
        }
        return
      }, err => {
        console.log('err: ', err);
      });
    },
      (err: CaptureError) => console.error(err));
    return
  }

  async selectImagePickOption() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Take a photo',
          handler: () => this.appPlatform == 'android' ? this.getImageAndroid() : this.getImageIOS()
        },
        {
          text: 'Take a video',
          handler: () => this.appPlatform == 'android' ? this.getVideoAndroid() : this.getVideoIOS()
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async presentAlert() {
    let alert = await this.alertController.create({
      header: 'Permission Denied',
      message: 'If you would like to add an image, please provide POCN access in your settings.',
      buttons: ['Cancel', {
        text: 'Go to Settings',
        handler: () => {
          if(this.appPlatform === 'ios'){
            NativeSettings.openIOS({
              option: IOSSettings.App,
            });
          }else if(this.appPlatform === 'android'){
            NativeSettings.openAndroid({
              option: AndroidSettings.ApplicationDetails,
            });
          }
        }
        }]
    });
    await alert.present();
  }

  async cameraImageUpload(image: any) {
    let file = `data:image/jpeg;base64,${image}`
    this.fileType = 'jpeg';
    let fileName = new Date().toLocaleString()
    this.postFileName = `${fileName.replace(' ', '')}.${this.fileType}`;
    const buffer: any = file.substring(file.indexOf(',') + 1);
    this.fileSize =  buffer.length / 1000000;
    if (file) {
      this.fileDate = '';
      this.showRename = false;
      this.showImageData = false;
      this.showDeleteIcon = false;
      this.idfileErrorStatus = false;
      this.postImageErrorMsg = false;
      this.postFileType = `image/${this.fileType}`;
      if ((this.fileSize) <= 12) {
        this.attachmentTypeContent = file;
        this.showImage = false;
        this.showVideo = true;
      } else {
        this.postImageErrorMsg = true;
        let errorMsg = "Maximum file upload size is restricted to 12 MB.";
        this.postErrorMsg = errorMsg;
      }
    } else {
      this.postImageErrorMsg = true;
      let errorMsg = "Maximum file upload size is restricted to 12 MB.";
      this.postErrorMsg = errorMsg;
    }
  }

postImageUploads(event){
  const file  = (event.target as HTMLInputElement).files[0];
  this.postFileName = file.name;
  this.fileSize = Math.round(file.size / 1024) + " KB";
  this.fileType= file.type.split("/").pop();
  this.fileDate= '';
  this.showRename= false;
  if(this.resumeFileType.includes(file.type)){
    this.showImageData = false;
    this.showDeleteIcon = false;
    this.idfileErrorStatus = false;
    this.postImageErrorMsg = false;
    if(file.type == 'image/png' || file.type == 'image/PNG' || file.type == 'image/JPEG' || file.type == 'image/JPG' || file.type == 'image/jpg'  || file.type == 'image/jpeg') {
      this.postFileType = file.type;
      if((file.size/1000000) <= 12){
        this.convertToBase64(event.target.files[0]).subscribe(base64 => {
        this.attachmentTypeContent  = base64;
        this.showImage = false;
        this.showVideo = true;
        });
      } else{
        this.postImageErrorMsg = true;
        let errorMsg = "Maximum file upload size is restricted to 12 MB.";
        this.postErrorMsg = errorMsg ;
      }
    } else if(file.type == 'video/mp4' ||  file.type =='video/mpg' || file.type =='video/mpeg' || file.type == 'video/quicktime') {
      this.postFileType = file.type;
      this.showImage = true;
      this.showVideo = false;
      if((file.size/1000000) <= 12){
         this.convertToBase64(event.target.files[0]).subscribe(base64 => {
          this.videoContent = base64;
          this.attachmentTypeContent = this.videoContent;
         });
      } else{
        this.postImageErrorMsg = true;
        let errorMsg = "Maximum file upload size is restricted to 12 MB.";
        this.postErrorMsg = errorMsg ;
      }
   } else{
    if(file.type ==  "audio/mpeg"  || file.type ==  "audio/mp3"  || file.type ==  "audio/wav" ){
      this.postFileType = file.type;
      this.showImage = true;
      this.showVideo = true;
      if((file.size/1000000) <= 12){
        this.convertToBase64(event.target.files[0]).subscribe(base64 => {
          this.attachmentTypeContent  = base64;
      });
      }else{
        this.postImageErrorMsg = true;
        let errorMsg = "Maximum file upload size is restricted to 12 MB.";
        this.postErrorMsg = errorMsg ;
      }
    }
 }
}else{
  this.idfileErrorStatus = true;
  this.errorMsg = "Upload failed. Please select a valid file format (Jpg, png, jpeg,mp4, mp3, mpeg, wav, mov).";   }
}
submitPostForm(f:NgForm){
  this.showEmojiPicker = false;
  this.disablePostBtn = true;
  if(this.idfileErrorStatus == false &&  this.postImageErrorMsg == false && f.value['postDescription']){
    this.showDescriptionErr = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    if(this.postFileName){
      this.attachmentTypeContent = this.attachmentTypeContent;
      this.fileType = this.fileType;
    }
    else{
      this.attachmentTypeContent = '';
      this.fileType = '';
    }
    this.postData = {
      accessToken:token,
      channel: this.device.userAgent,
      class: "class" ,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      postType: 0,
      postTypeContent:  this.attachmentTypeContent ,
      postContent:btoa(unescape(encodeURIComponent(f.value['postDescription'] ))),
      postTags: "",
      postTitle: "",
      device:this.deviceType,
      parentPost:'',
      postExtension:this.fileType,
      postFileType:this.postFileType,
      audienceType:'1',
      groupId:this.groupId
    }

    this._pocnService.createPost(this.postData).subscribe(
      (response: CreatePostResponse) => {
        if(response.data) {
          if(response.data.createPost.postStatusResponse.status === "success") {
            const spanName = "share-post-grp-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
          }
          const eventName = 'share post group';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully share the post from grp' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
            this.closeAlert('success');
            this.disablePostBtn = false;
          }
        }
      }
    );
  }
  else{
    if(this.description == '' || !this.description){
      this.disablePostBtn = false;
      this.showDescriptionErr = false;
    }
  }
}
removeFile(){
  this.postFileName = '';
  this.showImage = true;
  this.showVideo = true;
  this.showDeleteIcon = true;
}
async close(data,f:NgForm) {
  if(f.value['postDescription'] || this.postFileName){
    this.showAlertPostSuccess = false;
    this.content.scrollToTop(3000);
    setTimeout(function () {
      this.showPostSuccess = true;
    }.bind(this), 3500);
  }
  else{
    await this.modalController.dismiss();

  }
}
groupEmit(f:NgForm){
  if(f.value['postDescription'] || this.postFileName){
  this.showAlertPostSuccess = true;
  }
}
async dismissGroup(f:NgForm){
  if(f.value['postDescription'] || this.postFileName){
  await this.modalController.dismiss();
  }
}
}
