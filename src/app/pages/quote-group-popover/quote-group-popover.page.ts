import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {  ActionSheetController, ModalController } from '@ionic/angular';
import { Observable, Subscriber, ReplaySubject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CreatePostResponse } from './../../services/type';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import {IonInput} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { AlertController } from '@ionic/angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File as ionicFile } from '@ionic-native/file/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Filesystem } from '@capacitor/filesystem';
import { IonContent } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-group-popover',
  templateUrl: './quote-group-popover.page.html',
  styleUrls: ['./quote-group-popover.page.scss'],
})
export class QuoteGroupPopoverPage implements OnInit {
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
  showDescriptionErr: boolean = true;
  showImage: boolean = true;
  showVideo: boolean = true;
  videoContent  = {};
  showDeleteIcon: boolean = true;
  showImageData:boolean = true;
  appPlatform: string = Capacitor.getPlatform();
  @Input() groupUuid: string;
  @Input() descData: string;
  @Input() postId: string;
  @ViewChild('autoFocus', {static: false}) autoFocus!: IonInput;
  @ViewChild('pickImageInput ') pickImageInput : ElementRef;
  focusIsSet!: boolean;
  postFileType:string;
  disablePostBtn: boolean = false;
  deviceType: string = '';
  showAlertPostSuccess:boolean = true;

  constructor(private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    private _pocnService: GraphqlDataService,
    public alertController: AlertController,
    private deviceService: DeviceDetectorService,
    private mediaCapture:  MediaCapture,
    private file: ionicFile,
    public domSanitizer: DomSanitizer,
    private actionSheetCtrl: ActionSheetController,
    public telemetry: TelemetryService,
    private router:Router,
    ) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "quote-group-popover";
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
  public ngAfterViewChecked(): void {
    if (!this.focusIsSet) {
      this.autoFocus.setFocus();
     // Disable focus on setTimeout()
      setTimeout(() => {this.focusIsSet = true; }, 1000);
    }
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
        if ( permissionList.photos === 'granted' || permissionList.photos === 'limited' ) {
          this.pickImageInput.nativeElement.click()
        }else{
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
    console.log("%cchecking permissions.....", 'color: yellow')
    console.table(permissionList)
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
        this.cameraImageUploads(image)
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
        console.log(this.fileSize)
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
      console.log(error)
    }
    permissionList = await Camera.checkPermissions();
    console.log("checking permissions.....", permissionList)
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
        this.cameraImageUploads(image)
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
        console.log(this.fileSize)
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

  async cameraImageUploads(image: any) {
    let file = `data:image/jpeg;base64,${image.base64String}`
    this.fileType = image.format;
    this.postFileName = `postImage${this.fileType}`;
    const buffer: any = file.substring(file.indexOf(',') + 1);
    this.fileSize =  buffer.length / 1000000;
    if (file) {
      this.fileDate = image.exif.DateTime;
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
      } else if(file.type == 'video/mp4' ||  file.type =='video/mpg' || file.type =='video/mpeg' || file.type =='video/quicktime') {
        this.postFileType = file.type;
        if((file.size/1000000) <= 12){
           this.convertToBase64(event.target.files[0]).subscribe(base64 => {
            this.videoContent = base64;
            this.attachmentTypeContent = this.videoContent;
            this.showImage = true;
            this.showVideo = false;
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
    this.errorMsg = "Upload failed. Please select a valid file format (Jpg, png, jpeg,mp4, mp3, mpeg, wav, mov).";
   }
 }
 submitPostForm(f:NgForm){
  this.disablePostBtn = true;
  if(this.idfileErrorStatus == false &&  this.postImageErrorMsg == false && f.value['postDescription']){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    if(this.postFileName){
      this.attachmentTypeContent = this.attachmentTypeContent;
      this.fileType = this.fileType;
    }
    else{
      this.attachmentTypeContent = '';
      this.fileType =  '';
    }
    this.postData = {
      accessToken:token,
      channel: this.device.userAgent,
      class: "class",
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      postType: 0,
      postTypeContent:  this.attachmentTypeContent ,
      postContent: btoa(unescape(encodeURIComponent(f.value['postDescription'] ))),
      postTags: "",
      postTitle: "",
      device:this.deviceType,
      parentPost:this.postId.toString( ),
      postExtension:this.fileType,
      postFileType:this.postFileType,
      audienceType:'1',
      groupId:this.groupUuid
    }
    console.log(this.postData)
    this._pocnService.createPost(this.postData).subscribe(
      (response: CreatePostResponse) => {
        if(response.data) {
          if(response.data.createPost.postStatusResponse.status === "success") {
            this.closeAlert('success');
            this.disablePostBtn = false;
            console.log(response.data.createPost.postStatusResponse.status)
            const spanName = "comment-group-post-create-btn";
            let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                groupId:this.groupUuid
            }
            const eventName = 'comment group post create';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully created comment post' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }
        }
      }
    );
  }
    if(f.value['postDescription'] == ''){
      this.disablePostBtn = false;
      this.showDescriptionErr = false;
    }
  }
  removeFile(){
    this.postFileName = '';
    this.showImage = true;
    this.showVideo = true;
    this.showDeleteIcon = true;
  }
  async closeAlert(data){
    await this.modalController.dismiss(data);

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
