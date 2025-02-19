import { Component, OnInit, ViewChild} from '@angular/core';
import { DeletePostPopoverPage } from "../delete-post-popover/delete-post-popover.page";
import { QuotePopoverPage} from "../quote-popover/quote-popover.page";
import { ModalController } from '@ionic/angular';
import { PopoverController , Platform  } from "@ionic/angular";
import { Location } from '@angular/common';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
//import { Geolocation } from '@capacitor/geolocation';
import { LikePostResponse } from './../../services/type';
import { PublicProfilePage } from '../public-profile/public-profile.page';
import { Router,NavigationEnd } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import jsSHA from 'jssha';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { PostSharePopoverPage } from "../post-share-popover/post-share-popover.page";
import { IonContent } from '@ionic/angular';
import { Observable, ReplaySubject,throwError  } from 'rxjs';
@Component({
  selector: 'app-post-detailpage',
  templateUrl: './post-detailpage.page.html',
  styleUrls: ['./post-detailpage.page.scss'],
})
export class PostDetailpagePage implements OnInit {
  @ViewChild(IonContent) content: IonContent
  count: number = 0;
  postData;
  postView: any;
  imageType: boolean = true;
  videoType: boolean = true;
  audioType: boolean = true;
  token;
  userIp = '';
  deviceType: string = '';
  geolocationPosition: string = '';
  userAgent: string;
  likeStatus: any;
  fullName;
  description;
  providerType;
  specialty;
  postDate;
  postStatus;
  likeCount;
  parentPostContent;
  postAttachment;
  likedUsers;
  userId;
  userDataId;
  profileImg = "assets/images-pocn/group-default-thumbnail.svg";
  profileImage;
  showUnLikePost;
  showLikePost;
  parentPostId;
  fileType;
  imageUrl = environment.postImgUrl;
  profileImgUrl;
  fileExtension;
  postImageUrl;
  postFrom;
  postFromData;
  postId;
  showAdmin: boolean = false;
  public refetchPost;
  groupViewDetailLink: boolean = true;
  groupViewLink: boolean = true;
  descDataLink;
  descDataContentLink;
  groupLinkUrl;
  public urlContent;
  public url;
  grpDetails;
  roleId;
  public getUserCheck;
  newDescription;
  newContentDescription;
  groupViewContentLink;
  groupLinkContentUrl;
  showSharePostSuccess: boolean = true;
  feedUrl;
  feedTitle;
  feedContent;
  feedAuthor;
  hideDetailContent: boolean = true;
  urlMeta;
  preview;
  hideLinkPreview: boolean = false;
  title;
  groupViewDataContentLink: boolean = true;
  public commentData;
  public groupLinkdata;
  constructor(
    public modalController: ModalController,
    private popoverCtrl: PopoverController,
    private location:Location,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private httpClient: HttpClient,
    private deviceService: DeviceDetectorService,
    private router: Router,
    public loading: LoadingService,
    public telemetry: TelemetryService,
) {
  this.userId = this._pocnLocalStorageManager.getData("userId");
  router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
    this.refetchPost = this.location.getState();
    };
  });
}

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') ;
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
  ionViewDidEnter() {
    this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this.getDetailPocnPosts();
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
      this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();
     // this.getPosition();
      this.loadIp();
     // this.loading.present();
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
  //load npi
  loadIp() {
    this.httpClient.get('https://jsonip.com').subscribe(
      (value: any) => {
        this.userIp = value.ip;
      },
      (error) => {
      }
    );

  }
  // getPosition(): any {
  //   Geolocation.getCurrentPosition().then(coordinates => {
  //     this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
  //   }).catch((error) => {
  //     this.geolocationPosition = "";
  //     console.log('Error getting location', error);
  //   });
  // }
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
  getDetailPocnPosts(){
    // this.hideLinkPreview = false;
    this.loading.present();
    let postData = JSON.parse(JSON.stringify(this.location.getState()));
    if(postData && postData.postId!=undefined){
      this._pocnService.getDetailPocnPosts(postData.postId).subscribe(({ data }) => {
        this.postData = postData;
        this.postView = JSON.parse(JSON.stringify(data['pocnPosts'].nodes[0]));
        if(this.loading.isLoading){
          if(this.postView){
            this.loading.dismiss();
          }
        }
        this.fullName = this.postView.fullName;
        this.description= this.postView.description;
        this.providerType= this.postView.providerType;
        this.specialty= this.postView.specialty;
        this.postStatus= this.postView.postStatus;
        this.likeCount= this.postView.likeCount;
        this.parentPostContent= this.postView.parentPostContent;
        this.postAttachment =  this.postView.fileName;
       this.likedUsers=  this.postView.likedUsers;
        this.userDataId = this.postView.userId;
        this.profileImage = this.postView.profileImage;
        this.parentPostId = this.postView.parentPostId;
        this.fileType = this.postView.postFileType;
        this.fileExtension = this.postView.fileExtension;
        this.postFrom = this.postView.postFrom;
        this.postId = this.postView.postId;
        this.feedUrl = this.postView.feedUrl;
        this.feedContent = this.postView.feedContent;
        this.feedTitle = this.postView.feedTitle;
        this.feedAuthor =this.postView.feedAuthor;
        if(this.postFrom == "admin" || this.postFrom == "miniflux"){
          this.postFromData = "POCN";
          this.showAdmin = true;
        }
      //   if(this.feedContent != null){
      //   this.hideDetailContent = false;
      //   this.groupViewDetailLink = true;
      //   this.groupViewLink = false;
      //  }
      //  else{
      //   this.hideDetailContent = true;
      //  }
        let dt = this.postView.postDate+ 'Z';
        let date = new Date(dt);
        this.postDate = date;
        this.profileImgUrl = environment.postProfileImgUrl + this.userDataId + '.' + this.fileExtension + '?lastmod=' + Math.random();
        let postImageUrl = environment.postImgUrl + this.postAttachment + '?lastmod=' + Math.random();
        var encoded_url = btoa(postImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
        var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
         "/g:" + "no"  + "/" + encoded_url + "." + this.fileExtension;
         //console.log(path)
         var shaObj = new jsSHA("SHA-256", "BYTES")
         shaObj.setHMACKey(environment.imageProxyKey, "HEX");
         shaObj.update(this.hex2a(environment.imageProxySalt));
         shaObj.update(path);
        var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

        this.postImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
        const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        const isBase64 = base64RegExp.test(this.description);
        this.commentData = this.description;

        if(isBase64 == true){
          this.description= decodeURIComponent(escape(window.atob(this.description)))
        }
        else{
          this.description = this.description;
        }
        if(this.parentPostContent){
          let descriptionContentData = this.parentPostContent.replace('==*', '');
          console.log(descriptionContentData);

          if(descriptionContentData.includes('Check out my new Group')){
            let startPos = this.parentPostContent.indexOf('==>') + 1;
            let endPos = this.parentPostContent.indexOf('==>',startPos);
            let textDesc = this.parentPostContent.substring(startPos,endPos)
            this.newContentDescription = textDesc.replace('=>', '');
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(this.newContentDescription)
            if(isBase64 == true){
              this.newContentDescription= decodeURIComponent(escape(window.atob(this.newContentDescription)))
            }
            else{
              this.newContentDescription = this.newContentDescription;
            }
            // let urlContentData =descriptionContentData.slice(
            //   descriptionContentData.indexOf('/') + 1,
            //   descriptionContentData.lastIndexOf('Check out my new Group'),
            // );
            // this.urlContent =urlContentData.slice(urlContentData.lastIndexOf('/') + 1).replace('==>', '');
            let data= descriptionContentData.substring(0, descriptionContentData.indexOf("==>"))
            this.urlContent = data.split("/").pop();
          }
          else{
            let startPos = this.parentPostContent.indexOf('==>') + 1;
            let endPos = this.parentPostContent.indexOf('==>',startPos);
            let textDesc = this.parentPostContent.substring(startPos,endPos)
            this.newContentDescription = textDesc.replace('=>', '');
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(this.parentPostContent)
            if(isBase64 == true){
              this.newContentDescription= decodeURIComponent(escape(window.atob(this.parentPostContent)))
            }
            else{
//let descData = btoa(unescape(encodeURIComponent(this.parentPostContent )));
				this.newContentDescription = this.parentPostContent//decodeURIComponent(escape(window.atob(this.parentPostContent)))
            }
            // let urlContentData =descriptionContentData.slice(
            //   descriptionContentData.indexOf('/') + 1,
            //   descriptionContentData.lastIndexOf('==*+ '),
            // );
            // this.urlContent =urlContentData.slice(urlContentData.lastIndexOf('/') + 1).replace('==>', '');
            let data= descriptionContentData.substring(0, descriptionContentData.indexOf("==>"))
            this.urlContent = data.split("/").pop();
          }
         // console.log(this.url.replace('==>', ''))
          let  groupLinkdata = descriptionContentData.split(':-');
          this.descDataContentLink = groupLinkdata[0];
          console.log(this.descDataContentLink);

          if(descriptionContentData.includes(environment.groupLink + '/group-detail/') ){
            this.groupViewContentLink = false;
            this.groupLinkContentUrl = environment.groupLink + '/group-detail/' + this.urlContent;
          }else if(descriptionContentData.includes(environment.groupLink + '/groups/')){
             this.groupViewContentLink = false;
           this.groupLinkContentUrl = environment.groupLink + '/groups/' + this.urlContent;
           }
          // else if(descriptionContentData.includes(environment.groupLink + '/group-details-view/')){
          //   this.groupViewContentLink = false;
          //   this.groupLinkContentUrl = environment.groupLink + '/group-details-view/' + this.urlContent;
          // }
          else{
            this.groupLinkContentUrl = '';
            this.groupViewContentLink = true;
          }
        }
      //description data
        let descriptionData = this.description.replace('==*', '');
        console.log(descriptionData)
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if(descriptionData.includes('Check out my new Group')){
          let startPos = this.description.indexOf('==>') + 1;
          let endPos = this.description.indexOf('==>',startPos);
          let textDesc = this.description.substring(startPos,endPos)
          this.newDescription = textDesc.replace('=>', '');
          const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          const isBase64 = base64RegExp.test(this.newDescription)
          if(isBase64 == true){
            this.newDescription= decodeURIComponent(escape(window.atob(this.newDescription)))
          }
          else{
            this.newDescription = this.newDescription;
          }
          let urlData =descriptionData.slice(
            descriptionData.indexOf('/') + 1,
            descriptionData.lastIndexOf('Check out my new Group'),
          );
          this.url =urlData.slice(urlData.lastIndexOf('/') + 1).replace('==>', '');
        }
      //    else if(this.description.match(urlRegex)) {
      //     const matches = this.description.match(urlRegex);
      //     const firstUrl = this.description.match(/https?:\/\/[^\s]+/);
      //     this.description = firstUrl ? this.description.replace(firstUrl[0], '') : this.description;
      //     console.log(matches)
      //     this.urlMeta = matches;
      //     console.log( this.urlMeta)
      //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
      //    const isBase64 = base64RegExp.test(this.description)
      //    if(isBase64 == true){
      //     console.log(this.description)

      //      this.description= decodeURIComponent(escape(window.atob(this.description)))
      //    }
      //    else{
      //     console.log(this.description)

      //      this.description = this.description;
      //    }
      //     this.getLinkPreviewData(this.urlMeta[0]);
      //     // this.getLinkPreview(this.urlMeta[0])
      //     // .subscribe(preview => {
      //     //   this.preview = preview;
      //     //   if (!this.preview.title) {
      //     //     this.title = this.preview.url;
      //     //   }
      //     //   this.hideLinkPreview = true;
      //     // }, error => {
      //     //   console.log("error")
      //     //   this.hideLinkPreview = false;
      //     //   this.preview.url = this.urlMeta;
      //     //   this.preview.title = this.preview.url;
      //     // });
      // }
        else{
          let startPos = this.description.indexOf('==>') + 1;
          let endPos = this.description.indexOf('==>',startPos);
          let textDesc = this.description.substring(startPos,endPos)
         this.newDescription = textDesc.replace('=>', '');
         const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
         const isBase64 = base64RegExp.test(this.newDescription)
         if(isBase64 == true){
           this.newDescription= decodeURIComponent(escape(window.atob(this.newDescription)))
         }
         else{
           this.newDescription = this.newDescription;
         }
        //   let urlData =descriptionData.slice(
        //     descriptionData.indexOf('/') + 1,
        //     descriptionData.lastIndexOf('==>'),
        //   );
        //   let testUrl =descriptionData.split("/").pop();
        //   this.url = testUrl.split("==>").pop();
        //  // this.url =urlData.slice(urlData.lastIndexOf('==>') );
        //  // this.url = lastUrl.replace('==>', '');
        //   console.log(descriptionData.split("/").pop().split("==>").pop())
        //   console.log(this.url)
         let data= descriptionData.substring(0, descriptionData.indexOf("==>"))
         this.url = data.split("/").pop();
        }

        let  groupLinkdata = descriptionData.split(':-');
        this.descDataLink = groupLinkdata[0];
        if(descriptionData.includes(environment.groupLink + '/group-detail/') ){
          this.groupViewLink = false;
          this.groupLinkUrl = environment.groupLink + '/group-detail/' + this.url;
        } else if(descriptionData.includes(environment.groupLink + '/groups/') ){
          this.groupViewLink = false;
          this.groupLinkUrl = environment.groupLink + '/groups/' + this.url;
        }
        // else if(descriptionData.includes(environment.groupLink + '/group-details-view/')){
        //   this.groupViewLink = false;
        //   this.groupLinkUrl = environment.groupLink + '/group-details-view/' + this.url;
        // }
        else{
          this.groupLinkUrl = '';

          this.groupViewLink = true;
        }
        // let  groupLinkdata = this.description.split('-');
        // if(groupLinkdata){
        //   this.groupViewLink = false;
        //   this.description =groupLinkdata[0];
        // }
        // else{
        //   this.groupViewLink = true;
        //   this.description = this.description;
        // }
          if(this.likedUsers.includes(this.userId)){
            this.showUnLikePost = "like";
          }
          else{
            this.showUnLikePost = "unLike";
          }
          if((this.fileType == 'image/png') || (this.fileType == 'image/jpg') || (this.fileType =='image/jpeg')){
            this.imageType = false;
            this.videoType = true;
            this.audioType = true;
          }
          else if((this.fileType == 'video/mpeg') || (this.fileType == 'video/mpg' )|| (this.fileType =='video/mp4') || (this.fileType =='video/quicktime')){
            this.videoType = false;
            this.imageType= true;
            this.audioType = true;
          }
          else if((this.fileType == 'audio/mpeg') || (this.fileType == 'audio/wave' )|| (this.fileType =='audio/mp3')){
              this.videoType = true;
              this.imageType = true;
              this.audioType = false;
          }
          else{
            this.videoType = true;
            this.imageType = true;
            this.audioType = true;
          }
      })
    }
  else{

    if(this.loading.isLoading){
      this.loading.dismiss();
      this.goToPost();

    }
    else{
      this.goToPost();
    }
  }
  }
  getParentPosts(parentPostId){
      this._pocnService.getDetailPocnPosts(parentPostId).subscribe(({ data }) => {
        this.postView = JSON.parse(JSON.stringify(data['pocnPosts'].nodes[0]));
        this.fullName = this.postView.fullName;
        this.description= this.postView.description;
        this.providerType= this.postView.providerType;
        this.specialty= this.postView.specialty;
        this.postStatus= this.postView.postStatus;
        this.likeCount= this.postView.likeCount;
        this.parentPostContent= this.postView.parentPostContent;
        this.postAttachment =  this.postView.fileName;
        this.likedUsers=  this.postView.likedUsers;
        this.userDataId = this.postView.userId;
        this.userId = this._pocnLocalStorageManager.getData("userId");
        this.profileImage = this.postView.profileImage;
        this.parentPostId = this.postView.parentPostId;
        this.fileExtension = this.postView.fileExtension;
        let dt = this.postView.postDate+ 'Z';
        let date = new Date(dt);
        this.postDate = date;
        this.postFrom = this.postView.postFrom;

          if(this.likedUsers.length == 0){
            this.showUnLikePost = "unLike";
          }
          else{
            this.showUnLikePost = "like";
          }
          let content = this.postView.postFileType;
          this.profileImgUrl = environment.postProfileImgUrl + this.userDataId + '.' + this.fileExtension + '?lastmod=' + Math.random();
          let postImageUrl = environment.postImgUrl + this.postAttachment + '?lastmod=' + Math.random();
          var encoded_url = btoa(postImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
          var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
           "/g:" + "no"  + "/" + encoded_url + "." + this.fileExtension;
           //console.log(path)
           var shaObj = new jsSHA("SHA-256", "BYTES")
           shaObj.setHMACKey(environment.imageProxyKey, "HEX");
           shaObj.update(this.hex2a(environment.imageProxySalt));
           shaObj.update(path);
          var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
          this.postImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
          const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          const isBase64 = base64RegExp.test(this.description);
          this.commentData = this.description;

          if(isBase64 == true){
            this.description= decodeURIComponent(escape(window.atob(this.description)))
          }
          else{
            this.description = this.description;
          }
          if(this.postFrom == "admin"){
            console.log(this.postFrom)
            this.postFromData = "POCN";
            this.showAdmin = true;
          }
          if(this.parentPostContent){
            let descriptionContentData = this.parentPostContent.replace('==*', '');
            console.log(descriptionContentData);

            if(descriptionContentData.includes('Check out my new Group')){
              let startPos = this.parentPostContent.indexOf('==>') + 1;
              let endPos = this.parentPostContent.indexOf('==>',startPos);
              let textDesc = this.parentPostContent.substring(startPos,endPos)
             this.newContentDescription = textDesc.replace('=>', '');
             const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
             const isBase64 = base64RegExp.test(this.newContentDescription)
             if(isBase64 == true){
               this.newContentDescription= decodeURIComponent(escape(window.atob(this.newContentDescription)))
             }
             else{
               this.newContentDescription = this.newContentDescription;
             }
              let urlContentData =descriptionContentData.slice(
                descriptionContentData.indexOf('/') + 1,
                descriptionContentData.lastIndexOf('Check out my new Group'),
              );
              this.urlContent =urlContentData.slice(urlContentData.lastIndexOf('/') + 1).replace('==>', '');
              console.log(this.urlContent);
            }
            else{
              let startPos = this.parentPostContent.indexOf('==>') + 1;
              let endPos = this.parentPostContent.indexOf('==>',startPos);
              let textDesc = this.parentPostContent.substring(startPos,endPos)
              this.newContentDescription = textDesc.replace('=>', '');
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              if(isBase64 == true){
                this.newContentDescription= decodeURIComponent(escape(window.atob(this.parentPostContent)))
              }
              else{
                this.newContentDescription = this.parentPostContent;
              }
            //decodeURIComponent(escape(window.atob(this.parentPostContent)))
            //  const isBase64 = base64RegExp.test(this.newContentDescription)
            //  if(isBase64 == true){
            //    this.newContentDescription= decodeURIComponent(escape(window.atob(this.newContentDescription)))
            //  }
            //  else{
            //    this.newContentDescription = this.newContentDescription;
            //  }
              // let urlContentData =this.parentPostContent.slice(
              //   this.parentPostContent.indexOf('/') + 1,
              //   this.parentPostContent.lastIndexOf('==*+ '),
              // );
              // this.urlContent =urlContentData.slice(urlContentData.lastIndexOf('/') + 1).replace('==>', '');
              let data= descriptionContentData.substring(0, descriptionContentData.indexOf("==>"))
              this.urlContent = data.split("/").pop();
            }
           // console.log(this.url.replace('==>', ''))

            console.log(this.url)
            let  groupLinkdata = descriptionContentData.split(':-');
            this.descDataContentLink = groupLinkdata[0];
            console.log(this.descDataContentLink)

            if(descriptionContentData.includes(environment.groupLink + '/group-detail/') ){
              console.log(3432)
              this.groupViewContentLink = false;
              this.groupLinkContentUrl = environment.groupLink + '/group-detail/' + this.urlContent;
            }else if(descriptionContentData.includes(environment.groupLink + '/groups/') ){
              this.groupViewContentLink = false;
              this.groupLinkContentUrl = environment.groupLink + '/groups/' + this.urlContent;
            }
            // else if(descriptionContentData.includes(environment.groupLink + '/group-details-view/')){
            //   this.groupViewContentLink = false;
            //   this.groupLinkContentUrl = environment.groupLink + '/group-details-view/' + this.urlContent;
            // }
            else{
              this.groupLinkContentUrl = '';
              this.groupViewDataContentLink = false;

              //this.groupViewContentLink = true;
            }
          }
  //description data
          let descriptionData = this.description.replace('==*', '');
          console.log(descriptionData)
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          if(descriptionData.includes('Check out my new Group')){
            let startPos = this.description.indexOf('==>') + 1;
            let endPos = this.description.indexOf('==>',startPos);
            let textDesc = this.description.substring(startPos,endPos)
           this.newDescription = textDesc.replace('=>', '')
            let urlData =descriptionData.slice(
              descriptionData.indexOf('/') + 1,
              descriptionData.lastIndexOf('Check out my new Group'),
            );
            this.url =urlData.slice(urlData.lastIndexOf('/') + 1).replace('==>', '');
          }
        //    else if(this.description.match(urlRegex)) {
        //     let  trimDescription = this.description;
        //     const matches = this.description.match(urlRegex);
        //     const firstUrl = this.description.match(/https?:\/\/[^\s]+/);
        //     this.description = firstUrl ? this.description.replace(firstUrl[0], '') : this.description;
        //     console.log(matches)
        //     this.urlMeta = matches;
        //     console.log( this.urlMeta)
        //     this.getLinkPreview(this.urlMeta[0])
        //     .subscribe(preview => {
        //       this.preview = preview;
        //       if (!this.preview.title) {
        //         this.title = this.preview.url;
        //       }
        //       this.hideLinkPreview = true;
        //     }, error => {
        //       console.log("error")
        //       this.description =  trimDescription;
        //       this.hideLinkPreview = false;
        //       this.preview.url = this.urlMeta;
        //       this.preview.title = this.preview.url;
        //     });
        // }
          else{
            let startPos = this.description.indexOf('==>') + 1;
            let endPos = this.description.indexOf('==>',startPos);
            let textDesc = this.description.substring(startPos,endPos)
           this.newDescription = textDesc.replace('=>', '')
            // let urlData =this.description.slice(
            //   this.description.indexOf('/') + 1,
            //   this.description.lastIndexOf('==*+ '),
            // );
            // this.url =urlData.slice(urlData.lastIndexOf('/') + 1).replace('==>', '');
            const isBase64 = base64RegExp.test(this.newDescription)
         if(isBase64 == true){
           this.newDescription= decodeURIComponent(escape(window.atob(this.newDescription)))
         }
         else{
           this.newDescription = this.newDescription;
         }
            let data= descriptionData.substring(0, descriptionData.indexOf("==>"))
            this.url = data.split("/").pop();

          }
          let  groupLinkdata = descriptionData.split(':-');
          this.descDataLink = groupLinkdata[0];

          if(descriptionData.includes(environment.groupLink + '/group-detail/') ){
            this.groupViewLink = false;
            this.groupLinkUrl = environment.groupLink + '/group-detail/' + this.url;
          }
         else if(descriptionData.includes(environment.groupLink + '/groups/') ){
            this.groupViewLink = false;
            this.groupLinkUrl = environment.groupLink + '/groups/' + this.url;
          }
          // else if(descriptionData.includes(environment.groupLink + '/group-details-view/')){
          //   this.groupViewLink = false;
          //   this.groupLinkUrl = environment.groupLink + '/group-details-view/' + this.url;
          // }
          else{
            this.groupLinkUrl = '';

            this.groupViewLink = true;
          }
          if((content == 'image/png') || (content == 'image/jpg') || (content =='image/jpeg')){
            this.imageType = false;
            this.videoType = true;
            this.audioType = true;
          }
          else if((content == 'video/mpeg') || (content == 'video/mpg' )|| (content =='video/mp4') || (content =='video/quicktime')){
            this.videoType = false;
            this.imageType= true;
            this.audioType = true;
          }
          else if((content == 'audio/mpeg') || (content == 'audio/wave' )|| (content =='audio/mp3')){
              this.videoType = true;
              this.imageType = true;
              this.audioType = false;
          }
          else{
            this.videoType = true;
            this.imageType = true;
            this.audioType = true;
          }
      })
  }
  likePost(likeStatus): void{
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      let  postLikeData = {
        accessToken:token,
        postId: this.postData.postId,
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
        ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        geoLocation: '',
        device: this.deviceType,
        channel: this.device.userAgent,
      }
      if(likeStatus == "liked"){
        this.likeCount++;
        this.showUnLikePost = "like";
        this.likedUsers.push(
          this._pocnLocalStorageManager.getData('userId'),
        )
      }
      else{
        this.likeCount --;
        this.showUnLikePost = "unLike";
          const index = this.likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
          this.likedUsers.splice(index,1)
      }
      // if(this.likedUsers.includes(this.userId)){
      //   this.showUnLikePost = "like";
      // }
      // else{
      //   this.showUnLikePost = "unLike";
      // }
      this._pocnService.likePost(postLikeData).subscribe(
        (response: LikePostResponse) => {
          if(response.data) {
            if(response.data.likePost.postStatusLikeResponse.status == "success") {
             // this.likeCount = response.data.likePost.postStatusLikeResponse.totalCount;
              this.likeStatus = response.data.likePost.postStatusLikeResponse.likeStatus;

              if(this.likeStatus == "True"){
                // this.likedUsers.push(
                //   this._pocnLocalStorageManager.getData('userId'),
                // )

                const spanName = "post-like-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                  postId: this.postData.postId,
              }
              const eventName = 'post like';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully liked post' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
               // this.getDetailPocnPosts();
              }
              else{
                // const index = this.likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
                // this.likedUsers.splice(index,1)
                const spanName = "post-unlike-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                  postId: this.postData.postId,
              }
              const eventName = 'post unlike';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully unliked post' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              //  this.getDetailPocnPosts();
              }

            }
          }
        }
      );
    }
  async deletePostPopover() {
    const popover = await this.popoverCtrl.create({
      component: DeletePostPopoverPage,
      cssClass: 'edit-modal',
      event,
      componentProps: {postId: this.postData.postId,
        groupData: this.refetchPost.groupData,
        groupId: this.refetchPost.groupId
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if(modalDataResponse && modalDataResponse.data == "delete"){
        this.router.navigateByUrl('/tablinks/post',{ state: {  postMsg: modalDataResponse.data} } );
      }
      else{
        if(modalDataResponse && modalDataResponse.data == "groupDelete"){
          this.router.navigateByUrl('group-detail/' + this.refetchPost.groupId,{ state: {  postDetailMsg: modalDataResponse.data} });
        }
      }
     });
    await popover.present();
  }
  async commentPopover(descData) {
    const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
    const isBase64 = base64RegExp.test(descData)
    if(isBase64 == true){
      descData = decodeURIComponent(escape(window.atob(descData)))
    }
    else{
      let descriptionData = descData.replace('==*', '')
          this.groupLinkdata = descriptionData.split(':-')
          if (this.groupLinkdata[1]) {
            let startPos = descData.indexOf('==>') + 1
            let endPos = descData.indexOf('==>', startPos)
            let textDesc = descData.substring(startPos, endPos)
            let newDescription = textDesc.replace('=>', '')
            descData= this.groupLinkdata[0]
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(newDescription)
            if(isBase64 == true){
              descData = decodeURIComponent(escape(window.atob(newDescription)))
            }
            else{
              descData  = newDescription;
            }
          }
    }
    const popover = await this.modalController.create({
      component: QuotePopoverPage,
      cssClass: 'quote-modal',
      componentProps: {postId: this.postData.postId,descData:descData
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {

      if(modalDataResponse && modalDataResponse.data == "success"){
        this.router.navigateByUrl('/tablinks/post',{ state: {  postMsg: modalDataResponse.data} } );
      }
    });
    await popover.present();
  }
  async basicProfileClick(userId) {
    let postData;
    postData = {
      userId: userId,
    }
    const popover = await this.modalController.create({
      component: PublicProfilePage,
      cssClass: 'public-profile-modal',
      componentProps: {
        'memberId': postData,
        'type': 'pocnUser'
      }
    });
    popover.onDidDismiss().then((modalDataResponse) => {
    });
    await popover.present();
  }
  async showSharePopover(postId) {
    //temporarily commented
    const popover = await this.popoverCtrl.create({
      component: PostSharePopoverPage,
      cssClass: 'edit-modal',
      event,
      componentProps: {postId: postId,
        // onClick: (type) => {
        // },
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if(modalDataResponse && modalDataResponse.data == 'connection'){
        this.showSharePostSuccess = false;
        this.content.scrollToTop(3000);
        setTimeout(function () {
          this.showSharePostSuccess = true;
          this.router.navigateByUrl('/tablinks/post',{ state: {  postMsg: 'pageDetail'} } );
        }.bind(this), 6500);
       // this.getDetailPocnPosts();
      //  this.router.navigate['/tablinks/post'];
      }
     });
    await popover.present();
  }
  goToPost(){

    setTimeout(() => {
     // let backMSg = JSON.parse(JSON.stringify(this.location.getState()));
     console.log(this.refetchPost)
     if(this.refetchPost.backMsg == "groupPage") {
      this.router.navigate(['/tablinks/groups']);
     }else if(this.refetchPost.postMsg == "profilePost"){
      this.router.navigateByUrl('/tablinks/my-profile',{ state: {  postMsg: 'pageDetail'} } );
     }else{
      this.router.navigateByUrl('/tablinks/post',{ state: {  postMsg: 'pageDetail'} } );
     }
   }, 1000)
    //this.router.navigate(['/tablinks/post'])
    //this.router.navigateByUrl('/tablinks/post',{ state: {  status: 'refetchPost'} } );
  }
  hex2a(hexx:any) {
    var hex = hexx.toString() //force conversion
    var str = ''
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    return str
  }
  onImgError(event,fileName){
    event.target.src = environment.postImgUrl + fileName + '?lastmod=' + Math.random();
  }
  onProfileImgError(event){
    event.target.src = "assets/images-pocn/group-default-thumbnail.svg";
  }
  groupUrl(type){
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  const userId = this._pocnLocalStorageManager.getData("userId");
  this.userId = userId;
  const groupId =  this.url.replace(' ', '');


  this._pocnService.getUserGroupDetail(token,groupId).subscribe(({ data }) => {

    this.grpDetails =  data['getUserGroupDetail'].data.filter((x) => {
      console.log(userId +'----------' + x.memberUserId.toLowerCase());
      if(x.memberUserId.toLowerCase() == userId){
       return x.roleId
      }
   });
   console.log(this.grpDetails);
 if(this.grpDetails.length >0){
  this.roleId = this.grpDetails[0].roleId;
 }
  else{
    this.roleId = 0;
  }
   console.log(this.roleId);
  //  if(this.roleId == "1" || this.roleId == "2"){
  //    this.router.navigate(['/group-details-edit/' + this.url]);
  //  }
  //  else{
  //   this.router.navigate(['/group-details-view/' + this.url]);
  //  }
  if(type == "postContent"){
    this.url = this.urlContent;
  }
  else{
    this.url = this.url;
  }
  if(this.groupLinkUrl.includes('/group-detail/' + groupId)){
    this._pocnService.getUserGroupMemberCheck(token,groupId).subscribe(({ data }) => {
      this.getUserCheck =  data['getUserGroupMemberCheck'];
      if((this.roleId == 1 || this.roleId == 2 ) && this.getUserCheck === "True"){
        console.log(this.groupLinkUrl);
        this.router.navigateByUrl('/group-detail/' + groupId,{ state: {  postDetailMsg: "editClose"} } );
      //this.router.navigate(['/group-details-edit/' + groupId]);
      }
      else{
        this.router.navigateByUrl('/group-details-view/' + groupId,{ state: {  postDetailMsg: "viewClose"} } );
      // this.router.navigate(['/group-details-view/' + groupId])
      }
       });

  }else if(this.groupLinkUrl.includes('/groups/' + groupId)){
    this.router.navigateByUrl('/groups/' + groupId,{ state: {  postDetailMsg: "viewClose"} } );
    // this.router.navigate(['/group-details-view/' + groupId])
  }
else if(this.groupLinkUrl.includes('/group-details-view/' + groupId)){
  this.router.navigateByUrl('/group-details-view/' + groupId,{ state: {  postDetailMsg: "viewClose"} } );
  // this.router.navigate(['/group-details-view/' + groupId])
}
  },
  (error) => {
      this.router.navigate(['/'])
  });
}
// getLinkPreview(link: string): Observable<any> {

//   const api = 'https://api.linkpreview.net/?key=385b793a618b1f864e5d6bcdab8d0cf0&q=' + link;
//   console.log(api)
//   return this.httpClient.get(api);
// }
 //getLinkPreviewData(url: string){
  //console.log(url);
  // generatePreview(url, (data: any) => {
  //   console.log(data);
  // });
  // const response = await fetch(url);
  // const html = await response.text();
  // const match = html.match(/<title>(.*?)<\/title>.*?<meta[^>]*name="description"[^>]*content="(.*?)".*?<img[^>]*src="(.*?)"/i);
  // console.log(response);

  // if (match) {
  //   return {
  //     title: match[1],
  //     description: match[2],
  //     image: match[3],
  //   };
  // } else {
  //   return null;
  // }
//}

}
