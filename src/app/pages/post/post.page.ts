import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { OverlayPopoverPage } from "../overlay-popover/overlay-popover.page";
import { ModalController } from '@ionic/angular';
import { CreateRoomResponse, LikePostResponse } from './../../services/type';
import { PostPopoverPage } from "../post-popover/post-popover.page";
import { PopoverController , Platform  } from "@ionic/angular";
import { PostSharePopoverPage } from "../post-share-popover/post-share-popover.page";
import { DeletePostPopoverPage } from "../delete-post-popover/delete-post-popover.page";
import { QuotePopoverPage} from "../quote-popover/quote-popover.page";
//import { Geolocation } from '@capacitor/geolocation';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PublicProfilePage } from '../public-profile/public-profile.page';
import { IonContent } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { LoadingService } from 'src/app/services/loading.service';
import { Keyboard } from '@capacitor/keyboard';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { IonInfiniteScroll } from '@ionic/angular';
import jsSHA from 'jssha';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Observable, ReplaySubject,throwError  } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  @ViewChild(IonContent) content: IonContent
  public myUserDialerData: any[]
  public hcpVerified: number
  public phoneLinked: number
  public verificationType: string
  userId: string
  token: string
  public userRoomData: string
  grpErrorIconMsg
  grpErrorBannerMsg
  grpErrorMsg
  userIp = ''
  deviceType: string = ''
  geolocationPosition: string = ''
  userAgent: string
  showPostSuccess: boolean = true
  count: number = 0
  postView: any = []
  defaultPostView: any = [];
  profileImg = 'assets/images-pocn/group-default-thumbnail.svg'
  imgExten = '?lastmod=' + Math.random()
  date: any
  imageType: boolean[] = []
  videoType: boolean[] = []
  audioType: boolean[] = []
  showSharePostSuccess: boolean = true
  showDeletePostSuccess: boolean = true
  disableLike: boolean = false
  enableLike: boolean = true
  backButtonSubscription
  likeStatus: any
  totalCount: any
  likedPost: boolean = true
  unlikedPost: boolean = true
  searchText
  searchData
  modalDataPost
  userAttachedData
  showSearchData: boolean = true
  hideSearchData: boolean = false
  userAttcahedData: any
  contentData: any
  userProfileImages: any
  emptyShowResult: boolean = true
  searchLoaderStatus: boolean = true
  PostCommentData
  imageUrl = environment.postImgUrl
  profileImgUrl
  profileShareImgUrl
  refetchPost
  previousUrl
  postSearch: any = []
  showAdmin: boolean[] = []
  groupViewLink: string
  descriptionLink
  groupLinkdata
  groupLinkContentdata

  viewLink: boolean = true
  classColor
  public searchTextData: string = ''
  userPostLimit: number = 0
  connectionPostLimit: number = 0
  publishPostLimit: number = 0
  groupPostLimit: number = 0
  otherPostLimit: number = 0
  userSearchPostLimit: number = 0
  connectionSearchPostLimit: number = 0
  publishSearchPostLimit: number = 0
  groupSearchPostLimit: number = 0
  otherSearchPostLimit: number = 0
  userDataFlag: boolean = false
  groupDataFlag: boolean = false
  connectionDataFlag: boolean = false
  publishDataFlag: boolean = false
  public progress = 0
  setScrollBar: boolean = false
  defaultPostFlag: boolean = false;
  viewPreviousIcon: boolean= true;
  safeUrl: any;
  metaData: any;
  showConNotification: boolean= false;
  showNotification: boolean= false;
  notificationName;
  countData;
  conNotificationData;
  requestorCount;
  requestorNames;
  notificationData;
  errorMessage = '';
  hideLinkPreview: boolean= false;
  public connectStatus;
  public groupData;
  descDataLink;
  constructor(
    private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    private popoverCtrl: PopoverController,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    public loadingController: LoadingController,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    public loading: LoadingService,
    private location:Location,
    public telemetry: TelemetryService,

    ) {
      this._pocnService.getIpAddress();
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
       let currentUrl = this.router.url;
      router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
        this.refetchPost = this.location.getState();
      if(this.refetchPost.postMsg == "success"){
        this.showPostSuccess = false;
        this.userPostLimit = 0
        this.connectionPostLimit = 0
        this.publishPostLimit = 0
        this.groupPostLimit = 0
        this.otherPostLimit = 0
        this.postView = [];
        this.getpocnPosts();
        this.content.scrollToTop(3000);
        setTimeout(function () {
          this.showPostSuccess = true;
        }.bind(this), 6500);
      }
      if(this.refetchPost.postMsg == "delete"){
        this.showDeletePostSuccess = false;
        this.userPostLimit = 0
        this.connectionPostLimit = 0
        this.publishPostLimit = 0
        this.groupPostLimit = 0
        this.otherPostLimit = 0
        this.postView = [];
        this.getpocnPosts();
        this.content.scrollToTop(3000);
        setTimeout(function () {
          this.showDeletePostSuccess = true;
        }.bind(this), 6500);
      }
      if(this.refetchPost.postMsg == "sharePost"){
       // this.showSharePostSuccess = false;
        this.content.scrollToTop(3000);
        this.userPostLimit = 0
        this.connectionPostLimit = 0
        this.publishPostLimit = 0
        this.groupPostLimit = 0
        this.otherPostLimit = 0
        this.postView = [];
        this.getpocnPosts();
        // setTimeout(function () {
        //   this.showSharePostSuccess = true;
        // }.bind(this), 6500);
      }
      if(this.refetchPost.postMsg == "pageDetail"){
        console.log("test")
        this.userPostLimit = 0
        this.connectionPostLimit = 0
        this.publishPostLimit = 0
        this.groupPostLimit = 0
        this.otherPostLimit = 0
        this.postView = [];
        this.getpocnPosts();
      }
        // this.getpocnPosts();
      }
    })
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
    if (this.token == '' || this.token == null) {
      this.router.navigate(['/'])
    }
    this.getDefaultPost();
    this.patientConnectStatusCalls();
    this.refetchPost = this.location.getState()
    // this.getUserProfile();
    // this.getDialerCaller();
    // if(this.isMobile == true){
    //   this.deviceType = "Mobile"
    //   }
    //   else if(this.isTablet == true){
    //   this.deviceType = "Tablet"
    //   }
    //   else if(this.isDesktop == true){
    //   this.deviceType = "Desktop"
    //   }
    //   else{
    //   this.deviceType = "Unknown"
    //   }
    //   this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();
    //   this.getPosition();
    //   this.loadIp();
    //   this.loading.present();
    //   this.getpocnPosts();
  }
  getMetaData(url: string) {
   // const appId = "a5e235de-359b-46f7-becb-1841896d8aca";
    // console.log(url[0])
    // this.fetchUrl(url[0]).subscribe((html) => {
    //   console.log(111111111111)
    //   const metaTags = this.extractMetaTags(html);

    //   const preview = {
    //     title: metaTags['og:title'] || metaTags['twitter:title'] || '',
    //     description: metaTags['og:description'] || metaTags['twitter:description'] || '',
    //     image: metaTags['og:image'] || metaTags['twitter:image'] || '',
    //     url: url[0]
    //   };

    //   console.log(preview);
    // });
//     const apiUrl = `https://www.linkedin.com/voyager/api/urlPreview?url=${url[0]}`;
// console.log(apiUrl)
//     this.httpClient.get(apiUrl).subscribe((response: any) => {
//       console.log(response)
//       this.metaData = {
//         title: response.title,
//         description: response.description,
//         image: response.images[0].url,
//         url: response.resolvedUrl
//       };
//       console.log(this.metaData)
//     });
  // this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url[0]);
   //this.postSearch.push(this.safeUrl )
    // this.httpClient.get(url[0], { responseType: 'text' }).subscribe((response: string) => {
    //   const match = response.match(/<img.+?src=["'](.+?)["']/);
    //   console.log(match)

    //   if (match) {
    //     this.imageUrl = match[1];
    //     console.log(this.imageUrl)
    //   }
    // });
    // let headers = new HttpHeaders();
    // headers = headers.append('Access-Control-Allow-Headers', '*');
    // headers = headers.append('Access-Control-Allow-Methods', '*');
    // headers = headers.append('Access-Control-Allow-Origin', '*');
    // headers = headers.append('Access-Control-Allow-Credentials', true);
    // const options = {
    //   headers: headers,
    //   reportProgress: true,
    //   responseType: 'json',
    // };
    // return this.httpClient.head(url, <HttpOptions>options);
   // return this.httpClient.get(`https://opengraph.io/api/1.1/site/${url}?app_id=${appId}	`);
  }
  // fetchUrl(url: string): Observable<any> {
  //   return this.httpClient.get(url, { responseType: 'text' });
  // }
  extractMetaTags(html: string): any {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const metaTags = doc.getElementsByTagName('meta');

    const metaTagValues = {};
    for (let i = 0; i < metaTags.length; i++) {
      const metaTag = metaTags[i];
      const property = metaTag.getAttribute('property');
      const content = metaTag.getAttribute('content');

      if (property && content) {
        metaTagValues[property] = content;
      }
    }

    return metaTagValues;
  }

  onIonInfinite(ev) {
    // setTimeout(() => {
    console.log('Done')
    ev.target.complete()
    this.setScrollBar = true
    if (this.searchTextData === '') {
      if (this.userPostLimit > 0) {
        this.getpocnPosts()
      } else if (this.connectionPostLimit > 0) {
        this.getConnectionPosts()
      } else if (this.publishPostLimit > 0) {
        this.getPublishPosts()
      } else if (this.groupPostLimit > 0) {
        this.getGroupPosts()
      } else if (this.otherPostLimit > 0) {
        this.getOtherPosts()
      }
    } else {
      this.searchPosts(this.searchTextData)
    }
    // }, 3000)
  }

  public getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
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
  // getUserProfile() {
  //   //let profileImageArray = [];
  //   this._pocnService.getUserProfile(this.token).subscribe(({ data }) => {
  //   this.userId = data['getUserFullProfile'].data['userBasicProfile']['userId'];
  //   // this.userProfileImages = data['getUserFullProfile'].data['userImageProfile'];
  //   // if(profileImageArray.length > 0){
  //   //   this.profileImg = profileImageArray[profileImageArray.length-1].fileContent;
  //   // }
  //   // },
  //   //   (error) => {
  //   //       this.router.navigate(['/'])
  //     });
  // }
  providerUserInfos(){
   this.userId = this._pocnLocalStorageManager.getData("userId")
  }
  getDialerCaller() {
      this._pocnService.getDialerCaller(this.token).subscribe(({ data }) => {
      this.myUserDialerData = data['getDialerCaller'].data;
    })
  }
  patientConnectStatusCalls(){
    this._pocnService.patientConnectStatusCalls(this._pocnLocalStorageManager.getData("userId").toUpperCase( )).subscribe(({ data }) => {
      if(data.patientConnectStatusCalls.nodes != ''){
        let setSuccess ;
        setSuccess = data.patientConnectStatusCalls.nodes[0];
        this.hcpVerified = setSuccess.hcpVerified;
        this.phoneLinked = setSuccess.phoneLinked;
        this.verificationType = setSuccess.verificationType;
        this.connectStatus = setSuccess.patientConnectRegistrationStatus == 1;
        // if(setSuccess.patientConnectRegistrationStatus == 1){
        //   if(type == 'audio'){
        //     this.router.navigate(['/dialer'])
        //   }
        //   else{
        //     this.goToVideoCall();
        //   }
        // } else{
        //     // if(setSuccess.hcpVerified == 0 && setSuccess.phoneLinked == 1 &&  this.myUserDialerData.length > 0 && this.verificationType == 'Manual' ){
        //     //   this.router.navigate(['/dialer'])
        //     //   this.presentLoading();
        //     // } else{
        //       this.router.navigateByUrl('/connect', { state: { tabName: 'post' , type: type} });
        //    // }
        // }
      }
    })
  }
  statusConnectCalls(type){
    localStorage.removeItem('typeConnect');
    localStorage.setItem(
      "typeConnect",
      type
    );
    if (this.connectStatus == 1) {
      if(type == "audio"){
        this.router.navigate(['/dialer']);
      }else{
        this.goToVideoCall();
      }
  }else {
    this.router.navigateByUrl('/connect', { state: { tabName: 'post' , type: type} });
  }
}
  goToVideoCall(){
    let createRoom: any;
    createRoom = {
            accessToken: this.token,
            channel: this.device.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation:'',
          }
    this._pocnService.createRoom(createRoom).subscribe(
      (response: CreateRoomResponse) => {
        if(response.data.createRoom.updateConnectionResponse.status === 'success') {
          this.userRoomData = response.data.createRoom.updateConnectionResponse.data;
          const spanName = "connect-call-create-room-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail")
          }
          const eventName = 'connect video call create room';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully room created in video call' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
        }
        this.router.navigateByUrl('/dialer2', { state: { userDataId: this.userRoomData} });
    });

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

  //for deafault post view
  getDefaultPost(){
    this.loading.present();

    this.defaultPostFlag = true;
    let token = this._pocnLocalStorageManager.getData('pocnApiAccessToken')
    let i = this.postView.length
    this._pocnService
      .getDefaultPost(token)
      ?.subscribe(({ data }) => {
        this.setScrollBar = false
        console.log('user', data)
        if (this.loading.isLoading) {
          this.loading.dismiss()
        }
        console.log(data['getDefaultPost'].data)
        let postList = []
        console.log(postList)
        if (data['getDefaultPost'].data != null) {
          postList = JSON.parse(JSON.stringify(data['getDefaultPost'].data))
          // if (postList.length > 0 && this.userPostLimit == 0) {
          //   this.userDataFlag = true
          //   this.postView = []
          // }
          // this.userPostLimit = this.userPostLimit + postList.length
        }
        console.log(this.userPostLimit)

        postList.forEach((pst, index) => {
          //console.log(i)
          let dt = pst.createdDate + 'Z'
          let date = new Date(dt)
          pst.createdDate = date
          pst.profileImgUrl =
            environment.postProfileImgUrl +
            pst.originalPostUserId +
            '.' +
            pst.originalFileExtension +
            '?lastmod=' +
            Math.random()
          pst.profileShareImgUrl =
            environment.postProfileImgUrl +
            pst.userId +
            '.' +
            pst.fileExtension +
            '?lastmod=' +
            Math.random()
          let postImageUrl =
            environment.postImgUrl + pst.fileName + '?lastmod=' + Math.random()
          var encoded_url = btoa(postImageUrl)
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
          var path =
            '/rs:' +
            'fit' +
            ':' +
            '300' +
            ':' +
            '400' +
            ':' +
            0 +
            '/g:' +
            'no' +
            '/' +
            encoded_url +
            '.' +
            pst.fileExtension
          //console.log(path)
          var shaObj = new jsSHA('SHA-256', 'BYTES')
          shaObj.setHMACKey(environment.imageProxyKey, 'HEX')
          shaObj.update(this.hex2a(environment.imageProxySalt))
          shaObj.update(path)
          var hmac = shaObj
            .getHMAC('B64')
            .toString()
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
          pst.postImageUrl =
            environment.imageProxyUrl +
            '/' +
            hmac +
            path +
            '?lastmod=' +
            Math.random()
          this.groupViewLink = environment.groupLink + '/group-details-edit/';
          pst.commentDescData = pst.description;

          //descrition
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          // let descriptionData = pst.description.replace('==*', '')
          // this.groupLinkdata = descriptionData.split(':-');
          // if (this.groupLinkdata[1]) {
          //   let startPos = pst.description.indexOf('==>') + 1
          //   let endPos = pst.description.indexOf('==>', startPos)
          //   let textDesc = pst.description.substring(startPos, endPos)
          //   let newDescription = textDesc.replace('=>', '')
          //   this.viewLink = false
          //   pst.description = this.groupLinkdata[0]
          //   pst.colorCss = 'faq'
          //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //   const isBase64 = base64RegExp.test(newDescription)
          //   if(isBase64 == true){
          //     pst.newDescription= decodeURIComponent(escape(window.atob(newDescription)))
          //   }
          //   else{
          //     pst.newDescription = newDescription;
          //   }
          // }
        //   else if(pst.description.match(urlRegex)) {
        //     let trimDescription = pst.description
        //     const matches = pst.description.match(urlRegex);
        //     const firstUrl = pst.description.match(/https?:\/\/[^\s]+/);
        //     pst.description = firstUrl ? pst.description.replace(firstUrl[0], '') : pst.description;
        //     console.log(matches)
        //     pst.urlMeta = matches;
        //     console.log( pst.urlMeta)
        //     this.getLinkPreview(pst.urlMeta[0])
        //     .subscribe(preview => {
        //       pst.preview = preview;
        //       if (!pst.preview.title) {
        //         pst.title = pst.preview.url;
        //       }
        //      // pst.hideLinkPreview = false;

        //       pst.errorStatus = 'null';
        //     }, error => {
        //       console.log("error")
        //       pst.description = trimDescription;
        //       this.hideLinkPreview = false;
        //       console.log(this.hideLinkPreview )
        //       pst.errorStatus = "Too many requests / rate limit exceeded. Please try again";
        //       pst.preview.url = pst.urlMeta;
        //       pst.preview.title = pst.preview.url;
        //     });
        //     pst.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl( pst.urlMeta[0]);
        // }
        //  else {
        //     this.viewLink = true
        //     pst.colorCss = '';
        //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //     const isBase64 = base64RegExp.test(pst.description)
        //     if(isBase64 == true){
        //       pst.description= decodeURIComponent(escape(window.atob(pst.description)))
        //     }
        //     else{
        //       pst.description =  pst.description;
        //     }
        //   }
          //parent content
          // if (pst.parentPostContent) {
          //   let descriptionContentData = pst.parentPostContent.replace(
          //     '==*',
          //     '',
          //   )
          //   this.groupLinkContentdata = descriptionContentData.split(':-')
          //   if (this.groupLinkContentdata[1]) {
          //     let startPos = pst.parentPostContent.indexOf('==>') + 1
          //     let endPos = pst.parentPostContent.indexOf('==>', startPos)
          //     let textDesc = pst.parentPostContent.substring(startPos, endPos)
          //     let newDescription = textDesc.replace('=>', '')
          //     this.viewLink = false
          //     pst.parentPostContent = this.groupLinkContentdata[0]
          //     pst.colorCss = 'faq'
          //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //     const isBase64 = base64RegExp.test(newDescription)
          //     if(isBase64 == true){
          //       pst.newContentDescription= decodeURIComponent(escape(window.atob(newDescription)))
          //     }
          //     else{
          //       pst.newContentDescription =  newDescription;
          //     }
          //   } else {
          //     this.viewLink = true
          //     pst.colorCss = '';
          //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //     const isBase64 = base64RegExp.test(pst.parentPostContent)
          //     if(isBase64 == true){
          //       pst.parentPostContent= decodeURIComponent(escape(window.atob(pst.parentPostContent)))
          //     }
          //     else{
          //       pst.parentPostContent =  pst.parentPostContent;
          //     }
          //   }
          // }

           //descrption
        const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        const isBase64 = base64RegExp.test(pst.description);
        console.log( pst.description)
        if(isBase64 == true){
          console.log( pst.description)
          pst.newDescription = decodeURIComponent(escape(window.atob( pst.description)));
          console.log( pst.newDescription)
          let descriptionData = pst.newDescription.replace('==*', '');
          this.groupLinkdata = descriptionData.split(':-');
          if (this.groupLinkdata[1]) {
            let startPos = pst.newDescription.indexOf('==>') + 1
            let endPos = pst.newDescription.indexOf('==>', startPos)
            let textDesc = pst.newDescription.substring(startPos, endPos)
            let newDescription = textDesc.replace('=>', '')
            this.viewLink = false
            pst.newDescriptionLink = this.groupLinkdata[0]
              pst.newDescription = newDescription
            console.log(pst.newDescription)
            pst.colorCss = 'faq'
          }
          else {
            this.viewLink = true;
            pst.colorCss = '';
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(pst.description)
            if(isBase64 == true){

              pst.newDescription = decodeURIComponent(escape(window.atob(pst.description)))
            }
            else{

              pst.newDescription  = pst.description;
            }
          }
        }
        // else{
        //   pst.newDescription  = pst.description;
        // }
      // else {
      //     this.viewLink = true
      //     pst.colorCss = ''
      //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
      //     const isBase64 = base64RegExp.test(pst.description )
      //     if(isBase64 == true){
      //       pst.description  = decodeURIComponent(escape(window.atob(pst.description )))
      //     }
      //     else{
      //       pst.description  = pst.description ;
      //     }
      //   }
        //parent content
        if (pst.parentPostContent) {
          const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
         const isBase64 = base64RegExp.test(pst.parentPostContent);
        console.log( pst.parentPostContent)
        if(isBase64 == true){
          console.log( pst.parentPostContent)
          pst.newContentDescription = decodeURIComponent(escape(window.atob( pst.parentPostContent)));
          console.log( pst.newContentDescription)
          let descriptionContentData = pst.newContentDescription.replace('==*', '');
          this.groupLinkContentdata = descriptionContentData.split(':-');
          if (this.groupLinkContentdata[1]) {
            let startPos = pst.newContentDescription.indexOf('==>') + 1
            let endPos = pst.newContentDescription.indexOf('==>', startPos)
            let textDesc = pst.newContentDescription.substring(startPos, endPos)
            let newContentDescription = textDesc.replace('=>', '')
            this.viewLink = false
            pst.newDescriptionLink = this.groupLinkContentdata[0]
            pst.newContentDescription = newContentDescription
            console.log(pst.newContentDescription)
            pst.colorCss = 'faq'
          }
          else {
            this.viewLink = true
            pst.colorCss = '';
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(pst.parentPostContent)
            if(isBase64 == true){
              pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
            }
            else{
              pst.parentPostContent  = pst.parentPostContent;
            }
          }
        }
        // else{
        //   pst.parentPostContent   = pst.parentPostContent ;
        // }
      }
          if (pst.postFrom == 'admin' || pst.postFrom == 'miniflux') {
            console.log(pst.postFrom)
            pst.postFromData = 'POCN'
            // this.showAdmin[i]= true;
          }
          if (
            pst.postFileType == 'image/png' ||
            pst.postFileType == 'image/jpg' ||
            pst.postFileType == 'image/jpeg'
          ) {
            this.imageType[i] = false
            this.videoType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'video/mpeg' ||
            pst.postFileType == 'video/mpg' ||
            pst.postFileType == 'video/mp4' ||
            pst.postFileType == 'video/quicktime'
          ) {
            this.videoType[i] = false
            this.imageType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'audio/mpeg' ||
            pst.postFileType == 'audio/wave' ||
            pst.postFileType == 'audio/mp3'
          ) {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = false
          } else {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = true
          }
          i = i + 1
          this.defaultPostView.push(pst);
          console.log( this.defaultPostView)

        })
        // console.log(data['getMyPost'].data)

        // if (data['getMyPost'].data == null || postList.length < 5) {
        //   console.log(postList)
        //   this.getConnectionPosts()
        // }
      })
  }
  //for user limit post view
  getpocnPosts() {
    // this.hideLinkPreview = false;
    this.viewPreviousIcon = true;
    let token = this._pocnLocalStorageManager.getData('pocnApiAccessToken')
    let i = this.postView.length
    this._pocnService
      .getUserMyPost(token, this.userPostLimit)
      .subscribe(({ data }) => {
        this.setScrollBar = false
        console.log('user', data)
        if (this.loading.isLoading) {
          this.loading.dismiss()
        }
        console.log(data['getMyPost'].data)
        let postList = []
        console.log(postList)
        if (data['getMyPost'].data != null) {
          postList = JSON.parse(JSON.stringify(data['getMyPost'].data))
          if (postList.length > 0 && this.userPostLimit == 0) {
            this.userDataFlag = true
            this.postView = []
          }
          this.userPostLimit = this.userPostLimit + postList.length
        }
        console.log(this.userPostLimit)

        postList.forEach((pst, index) => {
          //console.log(i)
          let dt = pst.createdDate + 'Z'
          let date = new Date(dt)
          pst.createdDate = date
          pst.profileImgUrl =
            environment.postProfileImgUrl +
            pst.originalPostUserId +
            '.' +
            pst.originalFileExtension +
            '?lastmod=' +
            Math.random()
          pst.profileShareImgUrl =
            environment.postProfileImgUrl +
            pst.userId +
            '.' +
            pst.fileExtension +
            '?lastmod=' +
            Math.random()
          let postImageUrl =
            environment.postImgUrl + pst.fileName + '?lastmod=' + Math.random()
          var encoded_url = btoa(postImageUrl)
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
          var path =
            '/rs:' +
            'fit' +
            ':' +
            '300' +
            ':' +
            '400' +
            ':' +
            0 +
            '/g:' +
            'no' +
            '/' +
            encoded_url +
            '.' +
            pst.fileExtension
          //console.log(path)
          var shaObj = new jsSHA('SHA-256', 'BYTES')
          shaObj.setHMACKey(environment.imageProxyKey, 'HEX')
          shaObj.update(this.hex2a(environment.imageProxySalt))
          shaObj.update(path)
          var hmac = shaObj
            .getHMAC('B64')
            .toString()
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
          pst.postImageUrl =
            environment.imageProxyUrl +
            '/' +
            hmac +
            path +
            '?lastmod=' +
            Math.random();

          this.groupViewLink = environment.groupLink + '/group-details-edit/';
          pst.commentDescData = pst.description;

          //descrition
          const urlRegex = /(https?:\/\/[^\s]+)/g;

          // let descriptionData = pst.description.replace('==*', '')
          // this.groupLinkdata = descriptionData.split(':-')
          // if (this.groupLinkdata[1]) {
          //   let startPos = pst.description.indexOf('==>') + 1
          //   let endPos = pst.description.indexOf('==>', startPos)
          //   let textDesc = pst.description.substring(startPos, endPos)
          //   let newDescription = textDesc.replace('=>', '')
          //   this.viewLink = false;
          //   pst.description = this.groupLinkdata[0];
          //   pst.colorCss = 'faq';
          //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //   const isBase64 = base64RegExp.test(newDescription)
          //   if(isBase64 == true){
          //     pst.newDescription= decodeURIComponent(escape(window.atob(newDescription)))
          //   }
          //   else{
          //     pst.newDescription =  pst.newDescription;
          //   }
          // }
        //    else if(pst.description.match(urlRegex)) {
        //     let trimDescription = pst.description
        //     const matches = pst.description.match(urlRegex);
        //     const firstUrl = pst.description.match(/https?:\/\/[^\s]+/);
        //     pst.description = firstUrl ? pst.description.replace(firstUrl[0], '') : pst.description;
        //     console.log(matches)
        //     pst.urlMeta = matches;
        //     console.log( pst.urlMeta)
        //     this.getLinkPreview(pst.urlMeta[0])
        //     .subscribe(preview => {
        //       pst.preview = preview;
        //       if (!pst.preview.title) {
        //         pst.title = pst.preview.url;
        //       }
        //       this.hideLinkPreview = true;

        //       pst.errorStatus = 'null';
        //     }, error => {
        //       console.log("error")
        //       pst.description = trimDescription;
        //       this.hideLinkPreview = false;
        //       pst.errorStatus = "Too many requests / rate limit exceeded. Please try again";
        //       pst.preview.url = pst.urlMeta;
        //       pst.preview.title = pst.preview.url;
        //     });
        //     pst.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl( pst.urlMeta[0]);
        // }
        // else {
        //     this.viewLink = true
        //     pst.colorCss = ''
        //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //     const isBase64 = base64RegExp.test(pst.description)
        //     if(isBase64 == true){
        //       pst.description= decodeURIComponent(escape(window.atob(pst.description)))
        //     }
        //     else{
        //       pst.description =  pst.description;
        //     }
        //   }
          //parent content
          // if (pst.parentPostContent) {
          //   let descriptionContentData = pst.parentPostContent.replace(
          //     '==*',
          //     '',
          //   )
          //   this.groupLinkContentdata = descriptionContentData.split(':-')
          //   if (this.groupLinkContentdata[1]) {
          //     let startPos = pst.parentPostContent.indexOf('==>') + 1
          //     let endPos = pst.parentPostContent.indexOf('==>', startPos)
          //     let textDesc = pst.parentPostContent.substring(startPos, endPos)
          //     let newDescription = textDesc.replace('=>', '')
          //     this.viewLink = false
          //     pst.parentPostContent = this.groupLinkContentdata[0]
          //     pst.colorCss = 'faq';
          //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //     const isBase64 = base64RegExp.test(newDescription)
          //     if(isBase64 == true){
          //       pst.newContentDescription= decodeURIComponent(escape(window.atob(newDescription)))
          //     }
          //     else{
          //       pst.newContentDescription =  newDescription;
          //     }
          //   } else {
          //     this.viewLink = true
          //     pst.colorCss = '';
          //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //     const isBase64 = base64RegExp.test(pst.parentPostContent)
          //     if(isBase64 == true){
          //       pst.parentPostContent= decodeURIComponent(escape(window.atob(pst.parentPostContent)))
          //     }
          //     else{
          //       pst.parentPostContent =  pst.parentPostContent;
          //     }
          //   }
          // }
           //descrption
        const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        const isBase64 = base64RegExp.test(pst.description);
        console.log( pst.description)
        if(isBase64 == true){
          console.log( pst.description)
          pst.newDescription = decodeURIComponent(escape(window.atob( pst.description)));
          console.log( pst.newDescription)
          let descriptionData = pst.newDescription.replace('==*', '');
          this.groupLinkdata = descriptionData.split(':-');
          if (this.groupLinkdata[1]) {
            let startPos = pst.newDescription.indexOf('==>') + 1
            let endPos = pst.newDescription.indexOf('==>', startPos)
            let textDesc = pst.newDescription.substring(startPos, endPos)
            let newDescription = textDesc.replace('=>', '')
            this.viewLink = false
            pst.newDescriptionLink = this.groupLinkdata[0]
            pst.newDescription = newDescription
            console.log(pst.newDescription)
            pst.colorCss = 'faq'
          }
          else {
            this.viewLink = true;
            pst.colorCss = '';
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(pst.description)
            if(isBase64 == true){
              pst.newDescription = decodeURIComponent(escape(window.atob(pst.description)))
            }
            else{
              pst.newDescription  = pst.description;
            }
          }
        }
        // else{
        //   pst.newDescription  = pst.description;
        // }
      // else {
      //     this.viewLink = true
      //     pst.colorCss = ''
      //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
      //     const isBase64 = base64RegExp.test(pst.description )
      //     if(isBase64 == true){
      //       pst.description  = decodeURIComponent(escape(window.atob(pst.description )))
      //     }
      //     else{
      //       pst.description  = pst.description ;
      //     }
      //   }
        //parent content
        if (pst.parentPostContent) {
          const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
         const isBase64 = base64RegExp.test(pst.parentPostContent);
        console.log( pst.parentPostContent)
        if(isBase64 == true){
          console.log( pst.parentPostContent)
          pst.newContentDescription = decodeURIComponent(escape(window.atob( pst.parentPostContent)));
          console.log( pst.newContentDescription)
          let descriptionContentData = pst.newContentDescription.replace('==*', '');
          this.groupLinkContentdata = descriptionContentData.split(':-');
          if (this.groupLinkContentdata[1]) {
            let startPos = pst.newContentDescription.indexOf('==>') + 1
            let endPos = pst.newContentDescription.indexOf('==>', startPos)
            let textDesc = pst.newContentDescription.substring(startPos, endPos)
            let newContentDescription = textDesc.replace('=>', '')
            this.viewLink = false
            pst.newDescriptionLink = this.groupLinkContentdata[0]
            pst.newContentDescription = newContentDescription
            console.log(pst.newContentDescription)
            pst.colorCss = 'faq'
          }
          else {
            this.viewLink = true
            pst.colorCss = '';
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(pst.parentPostContent)
            if(isBase64 == true){
              pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
            }
            else{
              pst.parentPostContent  = pst.parentPostContent;
            }
          }
        }
        // else{
        //   pst.parentPostContent   = pst.parentPostContent ;
        // }
      }
          if (pst.postFrom == 'admin'  || pst.postFrom == 'miniflux') {
            console.log(pst.postFrom)
            pst.postFromData = 'POCN'
            // this.showAdmin[i]= true;
          }
          if (
            pst.postFileType == 'image/png' ||
            pst.postFileType == 'image/jpg' ||
            pst.postFileType == 'image/jpeg'
          ) {
            this.imageType[i] = false
            this.videoType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'video/mpeg' ||
            pst.postFileType == 'video/mpg' ||
            pst.postFileType == 'video/mp4' ||
            pst.postFileType == 'video/quicktime'
          ) {
            this.videoType[i] = false
            this.imageType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'audio/mpeg' ||
            pst.postFileType == 'audio/wave' ||
            pst.postFileType == 'audio/mp3'
          ) {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = false
          } else {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = true
          }
          i = i + 1
          this.postView.push(pst)
        })
        console.log(data['getMyPost'].data)

        if (data['getMyPost'].data == null || postList.length < 5) {
          console.log(postList)
          this.getConnectionPosts()
        }
      })
  }
  //for connection limit post view
  getConnectionPosts() {
    // this.hideLinkPreview = false;
    this.viewPreviousIcon = true;
    let token = this._pocnLocalStorageManager.getData('pocnApiAccessToken')
    let i = this.postView.length
    this._pocnService
      .getConnectionMyPost(token, this.connectionPostLimit)
      .subscribe(({ data }) => {
        this.setScrollBar = false
        console.log('connection', data)
        this.userPostLimit = 0
        if (this.loading.isLoading) {
          //console.log("test")
          this.loading.dismiss()
        }
        let postList = []
        console.log(postList)
        if (data['getMyPost'].data != null) {
          postList = JSON.parse(JSON.stringify(data['getMyPost'].data))
          if (postList.length > 0) {
            this.connectionDataFlag = true
            if (this.userDataFlag == false && this.connectionPostLimit == 0) {
              this.postView = []
            }
          }
          this.connectionPostLimit = this.connectionPostLimit + postList.length
        }
        postList.forEach((pst, index) => {
          //console.log(i)
          let dt = pst.createdDate + 'Z'
          let date = new Date(dt)
          pst.createdDate = date
          pst.profileImgUrl =
            environment.postProfileImgUrl +
            pst.originalPostUserId +
            '.' +
            pst.originalFileExtension +
            '?lastmod=' +
            Math.random()
          pst.profileShareImgUrl =
            environment.postProfileImgUrl +
            pst.userId +
            '.' +
            pst.fileExtension +
            '?lastmod=' +
            Math.random()
          let postImageUrl =
            environment.postImgUrl + pst.fileName + '?lastmod=' + Math.random()
          var encoded_url = btoa(postImageUrl)
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
          var path =
            '/rs:' +
            'fit' +
            ':' +
            '300' +
            ':' +
            '400' +
            ':' +
            0 +
            '/g:' +
            'no' +
            '/' +
            encoded_url +
            '.' +
            pst.fileExtension
          //console.log(path)
          var shaObj = new jsSHA('SHA-256', 'BYTES')
          shaObj.setHMACKey(environment.imageProxyKey, 'HEX')
          shaObj.update(this.hex2a(environment.imageProxySalt))
          shaObj.update(path)
          var hmac = shaObj
            .getHMAC('B64')
            .toString()
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')

          pst.postImageUrl =
            environment.imageProxyUrl +
            '/' +
            hmac +
            path +
            '?lastmod=' +
            Math.random()
          this.groupViewLink = environment.groupLink + '/group-details-edit/';
          pst.commentDescData = pst.description;

          //descrition
          // const urlRegex = /(https?:\/\/[^\s]+)/g;
          // let descriptionData = pst.description.replace('==*', '')
          // this.groupLinkdata = descriptionData.split(':-')
          // if (this.groupLinkdata[1]) {
          //   let startPos = pst.description.indexOf('==>') + 1
          //   let endPos = pst.description.indexOf('==>', startPos)
          //   let textDesc = pst.description.substring(startPos, endPos)
          //   let newDescription = textDesc.replace('=>', '')
          //   this.viewLink = false
          //   pst.description = this.groupLinkdata[0]
          //   pst.colorCss = 'faq';
          //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //   const isBase64 = base64RegExp.test(newDescription)
          //   if(isBase64 == true){
          //     pst.newDescription= decodeURIComponent(escape(window.atob(newDescription)))
          //   }
          //   else{
          //     pst.newDescription =  newDescription;
          //   }
          // }
        //   else if(pst.description.match(urlRegex)) {
        //     let trimDescription = pst.description
        //     const matches = pst.description.match(urlRegex);
        //     const firstUrl = pst.description.match(/https?:\/\/[^\s]+/);
        //     pst.description = firstUrl ? pst.description.replace(firstUrl[0], '') : pst.description;
        //     console.log(matches)
        //     pst.urlMeta = matches;
        //     console.log( pst.urlMeta)
        //     this.getLinkPreview(pst.urlMeta[0])
        //     .subscribe(preview => {
        //       pst.preview = preview;
        //       if (!pst.preview.title) {
        //         pst.title = pst.preview.url;
        //       }
        //       this.hideLinkPreview = true;
        //       pst.errorStatus = 'null';
        //     }, error => {
        //       console.log("error")
        //       pst.description = trimDescription;
        //       this.hideLinkPreview = false;
        //       pst.errorStatus = "Too many requests / rate limit exceeded. Please try again";
        //       pst.preview.url = pst.urlMeta;
        //       pst.preview.title = pst.preview.url;
        //     });
        //     pst.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl( pst.urlMeta[0]);
        // }
        // else {
        //     this.viewLink = true
        //     pst.colorCss = ''
        //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //     const isBase64 = base64RegExp.test(pst.description)
        //     if(isBase64 == true){
        //       pst.description= decodeURIComponent(escape(window.atob(pst.description)))
        //     }
        //     else{
        //       pst.description =  pst.description;
        //     }
        //   }

         //descrption
         const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
         const isBase64 = base64RegExp.test(pst.description);
         console.log( pst.description)
         if(isBase64 == true){
           console.log( pst.description)
           pst.newDescription = decodeURIComponent(escape(window.atob( pst.description)));
           console.log( pst.newDescription)
           let descriptionData = pst.newDescription.replace('==*', '');
           this.groupLinkdata = descriptionData.split(':-');
           if (this.groupLinkdata[1]) {
             let startPos = pst.newDescription.indexOf('==>') + 1
             let endPos = pst.newDescription.indexOf('==>', startPos)
             let textDesc = pst.newDescription.substring(startPos, endPos)
             let newDescription = textDesc.replace('=>', '')
             this.viewLink = false
             pst.newDescriptionLink = this.groupLinkdata[0]
              pst.newDescription = newDescription
             console.log(pst.newDescription)
             pst.colorCss = 'faq'
           }
           else {
             this.viewLink = true;
             pst.colorCss = '';
             const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
             const isBase64 = base64RegExp.test(pst.description)
             if(isBase64 == true){
               pst.newDescription = decodeURIComponent(escape(window.atob(pst.description)))
             }
             else{
               pst.newDescription  = pst.description;
             }
           }
         }
        //  else{
        //    pst.newDescription  = pst.description;
        //  }
       // else {
       //     this.viewLink = true
       //     pst.colorCss = ''
       //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
       //     const isBase64 = base64RegExp.test(pst.description )
       //     if(isBase64 == true){
       //       pst.description  = decodeURIComponent(escape(window.atob(pst.description )))
       //     }
       //     else{
       //       pst.description  = pst.description ;
       //     }
       //   }
         //parent content
         if (pst.parentPostContent) {
           const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          const isBase64 = base64RegExp.test(pst.parentPostContent);
         console.log( pst.parentPostContent)
         if(isBase64 == true){
           console.log( pst.parentPostContent)
           pst.newContentDescription = decodeURIComponent(escape(window.atob( pst.parentPostContent)));
           console.log( pst.newContentDescription)
           let descriptionContentData = pst.newContentDescription.replace('==*', '');
           this.groupLinkContentdata = descriptionContentData.split(':-');
           if (this.groupLinkContentdata[1]) {
             let startPos = pst.newContentDescription.indexOf('==>') + 1
             let endPos = pst.newContentDescription.indexOf('==>', startPos)
             let textDesc = pst.newContentDescription.substring(startPos, endPos)
             let newContentDescription = textDesc.replace('=>', '')
             this.viewLink = false
             pst.newDescriptionLink = this.groupLinkContentdata[0]
             pst.newContentDescription = newContentDescription
             console.log(pst.newContentDescription)
             pst.colorCss = 'faq'
           }
           else {
             this.viewLink = true
             pst.colorCss = '';
             const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
             const isBase64 = base64RegExp.test(pst.parentPostContent)
             if(isBase64 == true){
               pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
             }
             else{
               pst.parentPostContent  = pst.parentPostContent;
             }
           }
         }
        //  else{
        //    pst.parentPostContent   = pst.parentPostContent ;
        //  }
       }
          //parent content
          // if (pst.parentPostContent) {
          //   let descriptionContentData = pst.parentPostContent.replace(
          //     '==*',
          //     '',
          //   )
          //   this.groupLinkContentdata = descriptionContentData.split(':-')
          //   if (this.groupLinkContentdata[1]) {
          //     let startPos = pst.parentPostContent.indexOf('==>') + 1
          //     let endPos = pst.parentPostContent.indexOf('==>', startPos)
          //     let textDesc = pst.parentPostContent.substring(startPos, endPos)
          //     let newDescription = textDesc.replace('=>', '')
          //     this.viewLink = false
          //     pst.parentPostContent = this.groupLinkContentdata[0]
          //     pst.colorCss = 'faq'
          //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //     const isBase64 = base64RegExp.test(newDescription)
          //     if(isBase64 == true){
          //       pst.newContentDescription = decodeURIComponent(escape(window.atob(newDescription)))
          //     }
          //     else{
          //       pst.newContentDescription =  newDescription;
          //     }
          //   } else {
          //     this.viewLink = true
          //     pst.colorCss = ''
          //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //     const isBase64 = base64RegExp.test(pst.parentPostContent)
          //     if(isBase64 == true){
          //       pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
          //     }
          //     else{
          //       pst.parentPostContent =  pst.parentPostContent;
          //     }
          //   }
          // }

          if (pst.postFrom == 'admin' || pst.postFrom == 'miniflux') {
            console.log(pst.postFrom)
            pst.postFromData = 'POCN'
            // this.showAdmin[i]= true;
          }
          if (
            pst.postFileType == 'image/png' ||
            pst.postFileType == 'image/jpg' ||
            pst.postFileType == 'image/jpeg'
          ) {
            this.imageType[i] = false
            this.videoType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'video/mpeg' ||
            pst.postFileType == 'video/mpg' ||
            pst.postFileType == 'video/mp4' ||
            pst.postFileType == 'video/quicktime'
          ) {
            this.videoType[i] = false
            this.imageType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'audio/mpeg' ||
            pst.postFileType == 'audio/wave' ||
            pst.postFileType == 'audio/mp3'
          ) {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = false
          } else {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = true
          }
          i = i + 1
          this.postView.push(pst)
        })
        if (data['getMyPost'].data == null || postList.length < 5) {
          this.getPublishPosts()
        }
      })
  }
  //for group limit post view
  getGroupPosts() {
    // this.hideLinkPreview = false;
  this.viewPreviousIcon = true;
    let token = this._pocnLocalStorageManager.getData('pocnApiAccessToken')
    let i = this.postView.length
    this._pocnService
      .getGroupMyPost(token, this.groupPostLimit)
      .subscribe(({ data }) => {
        this.setScrollBar = false
        console.log('group', data)
        this.publishPostLimit = 0
        if (this.loading.isLoading) {
          this.loading.dismiss()
        }
        let postList = []
        console.log(postList)
        if (data['getMyPost'].data != null) {
          postList = JSON.parse(JSON.stringify(data['getMyPost'].data))
          if (postList.length > 0) {
            this.groupDataFlag = true
            if ( this.connectionDataFlag == false && this.userDataFlag == false && this.publishDataFlag == false && this.groupPostLimit == 0) {
              this.postView = []
            }
          }
          this.groupPostLimit = this.groupPostLimit + postList.length
        }
        postList.forEach((pst, index) => {
          //console.log(i)
          let dt = pst.createdDate + 'Z'
          let date = new Date(dt)
          pst.createdDate = date
          pst.profileImgUrl =
            environment.postProfileImgUrl +
            pst.originalPostUserId +
            '.' +
            pst.originalFileExtension +
            '?lastmod=' +
            Math.random()
          pst.profileShareImgUrl =
            environment.postProfileImgUrl +
            pst.userId +
            '.' +
            pst.fileExtension +
            '?lastmod=' +
            Math.random()
          let postImageUrl =
            environment.postImgUrl + pst.fileName + '?lastmod=' + Math.random()
          var encoded_url = btoa(postImageUrl)
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
          var path =
            '/rs:' +
            'fit' +
            ':' +
            '300' +
            ':' +
            '400' +
            ':' +
            0 +
            '/g:' +
            'no' +
            '/' +
            encoded_url +
            '.' +
            pst.fileExtension
          //console.log(path)
          var shaObj = new jsSHA('SHA-256', 'BYTES')
          shaObj.setHMACKey(environment.imageProxyKey, 'HEX')
          shaObj.update(this.hex2a(environment.imageProxySalt))
          shaObj.update(path)
          var hmac = shaObj
            .getHMAC('B64')
            .toString()
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
          pst.postImageUrl =
            environment.imageProxyUrl +
            '/' +
            hmac +
            path +
            '?lastmod=' +
            Math.random()
          this.groupViewLink = environment.groupLink + '/group-details-edit/';
          pst.commentDescData = pst.description;

          //descrition
          // const urlRegex = /(https?:\/\/[^\s]+)/g;
          // let descriptionData = pst.description.replace('==*', '')
          // this.groupLinkdata = descriptionData.split(':-')
          // if (this.groupLinkdata[1]) {
          //   let startPos = pst.description.indexOf('==>') + 1
          //   let endPos = pst.description.indexOf('==>', startPos)
          //   let textDesc = pst.description.substring(startPos, endPos)
          //   let newDescription = textDesc.replace('=>', '')
          //   this.viewLink = false
          //   pst.description = this.groupLinkdata[0]
          //   pst.colorCss = 'faq'
          //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //     const isBase64 = base64RegExp.test(newDescription)
          //     if(isBase64 == true){
          //       pst.newDescription = decodeURIComponent(escape(window.atob(newDescription)))
          //     }
          //     else{
          //       pst.newDescription =  newDescription;
          //     }
          // }
        //   else if(pst.description.match(urlRegex)) {
        //     let trimDescription = pst.description
        //     const matches = pst.description.match(urlRegex);
        //     const firstUrl = pst.description.match(/https?:\/\/[^\s]+/);
        //     pst.description = firstUrl ? pst.description.replace(firstUrl[0], '') : pst.description;
        //     console.log(matches)
        //     pst.urlMeta = matches;
        //     console.log( pst.urlMeta)
        //     this.getLinkPreview(pst.urlMeta[0])
        //     .subscribe(preview => {
        //       pst.preview = preview;
        //       if (!pst.preview.title) {
        //         pst.title = pst.preview.url;
        //       }
        //       this.hideLinkPreview = true;
        //       pst.errorStatus = 'null';
        //     }, error => {
        //       console.log("error")
        //       pst.description = trimDescription;
        //       this.hideLinkPreview = false;
        //       pst.errorStatus = "Too many requests / rate limit exceeded. Please try again";
        //       pst.preview.url = pst.urlMeta;
        //       pst.preview.title = pst.preview.url;
        //     });
        //     pst.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl( pst.urlMeta[0]);
        // }
        // else {
        //     this.viewLink = true
        //     pst.colorCss = ''
        //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //     const isBase64 = base64RegExp.test(pst.description)
        //     if(isBase64 == true){
        //       pst.description = decodeURIComponent(escape(window.atob(pst.description)))
        //     }
        //     else{
        //       pst.description =  pst.description;
        //     }
        //   }
        //descrption
        const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          const isBase64 = base64RegExp.test(pst.description);
          console.log( pst.description)
          if(isBase64 == true){
            console.log( pst.description)
            pst.newDescription = decodeURIComponent(escape(window.atob( pst.description)));
            console.log( pst.newDescription)
            let descriptionData = pst.newDescription.replace('==*', '');
            this.groupLinkdata = descriptionData.split(':-');
            if (this.groupLinkdata[1]) {
              let startPos = pst.newDescription.indexOf('==>') + 1
              let endPos = pst.newDescription.indexOf('==>', startPos)
              let textDesc = pst.newDescription.substring(startPos, endPos)
              let newDescription = textDesc.replace('=>', '')
              this.viewLink = false
              pst.newDescriptionLink = this.groupLinkdata[0]
              pst.newDescription = newDescription
              console.log(pst.newDescription)
              pst.colorCss = 'faq'
            }
            else {
              this.viewLink = true;
              pst.colorCss = '';
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              const isBase64 = base64RegExp.test(pst.description)
              if(isBase64 == true){
                pst.newDescription = decodeURIComponent(escape(window.atob(pst.description)))
              }
              else{
                pst.newDescription  = pst.description;
              }
            }
          }
          // else{
          //   pst.newDescription  = pst.description;
          // }
        // else {
        //     this.viewLink = true
        //     pst.colorCss = ''
        //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //     const isBase64 = base64RegExp.test(pst.description )
        //     if(isBase64 == true){
        //       pst.description  = decodeURIComponent(escape(window.atob(pst.description )))
        //     }
        //     else{
        //       pst.description  = pst.description ;
        //     }
        //   }
          //parent content
          if (pst.parentPostContent) {
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
           const isBase64 = base64RegExp.test(pst.parentPostContent);
          console.log( pst.parentPostContent)
          if(isBase64 == true){
            console.log( pst.parentPostContent)
            pst.newContentDescription = decodeURIComponent(escape(window.atob( pst.parentPostContent)));
            console.log( pst.newContentDescription)
            let descriptionContentData = pst.newContentDescription.replace('==*', '');
            this.groupLinkContentdata = descriptionContentData.split(':-');
            if (this.groupLinkContentdata[1]) {
              let startPos = pst.newContentDescription.indexOf('==>') + 1
              let endPos = pst.newContentDescription.indexOf('==>', startPos)
              let textDesc = pst.newContentDescription.substring(startPos, endPos)
              let newContentDescription = textDesc.replace('=>', '')
              this.viewLink = false
              pst.newDescriptionLink = this.groupLinkContentdata[0]
              pst.newContentDescription = newContentDescription
              console.log(pst.newContentDescription)
              pst.colorCss = 'faq'
            }
            else {
              this.viewLink = true
              pst.colorCss = '';
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              const isBase64 = base64RegExp.test(pst.parentPostContent)
              if(isBase64 == true){
                pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
              }
              else{
                pst.parentPostContent  = pst.parentPostContent;
              }
            }
          }
          // else{
          //   pst.parentPostContent   = pst.parentPostContent ;
          // }
        }
          //parent content
          // if (pst.parentPostContent) {
          //   let descriptionContentData = pst.parentPostContent.replace(
          //     '==*',
          //     '',
          //   )
          //   this.groupLinkContentdata = descriptionContentData.split(':-')
          //   if (this.groupLinkContentdata[1]) {
          //     let startPos = pst.parentPostContent.indexOf('==>') + 1
          //     let endPos = pst.parentPostContent.indexOf('==>', startPos)
          //     let textDesc = pst.parentPostContent.substring(startPos, endPos)
          //     let newDescription = textDesc.replace('=>', '')
          //     this.viewLink = false
          //     pst.parentPostContent = this.groupLinkContentdata[0]
          //     pst.colorCss = 'faq';
          //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //     const isBase64 = base64RegExp.test(newDescription)
          //     if(isBase64 == true){
          //       pst.newContentDescription = decodeURIComponent(escape(window.atob(newDescription)))
          //     }
          //     else{
          //       pst.newContentDescription = newDescription;
          //     }
          //   } else {
          //     this.viewLink = true;
          //     pst.colorCss = '';
          //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //     const isBase64 = base64RegExp.test(pst.parentPostContent)
          //     if(isBase64 == true){
          //       pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
          //     }
          //     else{
          //       pst.parentPostContent = pst.parentPostContent;
          //     }
          //   }
          // }
          if (pst.postFrom == 'admin' || pst.postFrom == 'miniflux') {
            console.log(pst.postFrom)
            pst.postFromData = 'POCN'
            // this.showAdmin[i]= true;
          }
          if (
            pst.postFileType == 'image/png' ||
            pst.postFileType == 'image/jpg' ||
            pst.postFileType == 'image/jpeg'
          ) {
            this.imageType[i] = false
            this.videoType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'video/mpeg' ||
            pst.postFileType == 'video/mpg' ||
            pst.postFileType == 'video/mp4' ||
            pst.postFileType == 'video/quicktime'
          ) {
            this.videoType[i] = false
            this.imageType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'audio/mpeg' ||
            pst.postFileType == 'audio/wave' ||
            pst.postFileType == 'audio/mp3'
          ) {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = false
          } else {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = true
          }
          i = i + 1
          this.postView.push(pst)
        })
        if (data['getMyPost'].data == null || postList.length < 5) {
          this.getOtherPosts()
        }
      })
  }
  //for publish limit post view
  getPublishPosts() {
    // this.hideLinkPreview = false;
    this.viewPreviousIcon = true;
    let token = this._pocnLocalStorageManager.getData('pocnApiAccessToken')
    let i = this.postView.length
    this._pocnService
      .getPublishMyPost(token, this.publishPostLimit)
      .subscribe(({ data }) => {
        this.setScrollBar = false
        console.log('publish', data)
        this.connectionPostLimit = 0
        if (this.loading.isLoading) {
          //console.log("test")
          this.loading.dismiss()
        }
        let postList = []
        if (data['getMyPost'].data != null) {
          postList = JSON.parse(JSON.stringify(data['getMyPost'].data))
          if (postList.length > 0) {
            this.publishDataFlag = true
            if (
              this.connectionDataFlag == false && this.userDataFlag == false &&
              this.publishPostLimit == 0
            ) {
              this.postView = []
            }
          }
          this.publishPostLimit = this.publishPostLimit + postList.length
        }
        postList.forEach((pst, index) => {
          //console.log(i)
          let dt = pst.createdDate + 'Z'
          let date = new Date(dt)
          pst.createdDate = date
          pst.profileImgUrl =
            environment.postProfileImgUrl +
            pst.originalPostUserId +
            '.' +
            pst.originalFileExtension +
            '?lastmod=' +
            Math.random()
          pst.profileShareImgUrl =
            environment.postProfileImgUrl +
            pst.userId +
            '.' +
            pst.fileExtension +
            '?lastmod=' +
            Math.random()
          let postImageUrl =
            environment.postImgUrl + pst.fileName + '?lastmod=' + Math.random()
          var encoded_url = btoa(postImageUrl)
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
          var path =
            '/rs:' +
            'fit' +
            ':' +
            '300' +
            ':' +
            '400' +
            ':' +
            0 +
            '/g:' +
            'no' +
            '/' +
            encoded_url +
            '.' +
            pst.fileExtension
          //console.log(path)
          var shaObj = new jsSHA('SHA-256', 'BYTES')
          shaObj.setHMACKey(environment.imageProxyKey, 'HEX')
          shaObj.update(this.hex2a(environment.imageProxySalt))
          shaObj.update(path)
          var hmac = shaObj
            .getHMAC('B64')
            .toString()
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
          pst.postImageUrl =
            environment.imageProxyUrl +
            '/' +
            hmac +
            path +
            '?lastmod=' +
            Math.random()
          this.groupViewLink = environment.groupLink + '/group-details-edit/';
          pst.commentDescData = pst.description;

          //descrition
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          // let descriptionData = pst.description.replace('==*', '')
          // this.groupLinkdata = descriptionData.split(':-')
          // if (this.groupLinkdata[1]) {
          //   let startPos = pst.description.indexOf('==>') + 1
          //   let endPos = pst.description.indexOf('==>', startPos)
          //   let textDesc = pst.description.substring(startPos, endPos)
          //   let newDescription = textDesc.replace('=>', '')
          //   this.viewLink = false
          //   pst.description = this.groupLinkdata[0]
          //   pst.colorCss = 'faq'
          //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //   const isBase64 = base64RegExp.test(newDescription)
          //   if(isBase64 == true){
          //     pst.newDescription = decodeURIComponent(escape(window.atob(newDescription)))
          //   }
          //   else{
          //     pst.newDescription = newDescription;
          //   }
          // }
        //   else if(pst.description.match(urlRegex)) {
        //     let trimDescription = pst.description
        //     const matches = pst.description.match(urlRegex);
        //     const firstUrl = pst.description.match(/https?:\/\/[^\s]+/);
        //     pst.description = firstUrl ? pst.description.replace(firstUrl[0], '') : pst.description;
        //     console.log(matches)
        //     pst.urlMeta = matches;
        //     console.log( pst.urlMeta)
        //     this.getLinkPreview(pst.urlMeta[0])
        //     .subscribe(preview => {
        //       pst.preview = preview;
        //       if (!pst.preview.title) {
        //         pst.title = pst.preview.url;
        //       }
        //       this.hideLinkPreview = true;
        //       pst.errorStatus = 'null';
        //     }, error => {
        //       console.log("error")
        //       pst.description = trimDescription;
        //       this.hideLinkPreview = false;
        //       pst.errorStatus = "Too many requests / rate limit exceeded. Please try again";
        //       pst.preview.url = pst.urlMeta;
        //       pst.preview.title = pst.preview.url;
        //     });
        //     pst.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl( pst.urlMeta[0]);
        // }
        //description
        const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          const isBase64 = base64RegExp.test(pst.description);
          console.log( pst.description)
          if(isBase64 == true){
            console.log( pst.description)
            pst.newDescription = decodeURIComponent(escape(window.atob( pst.description)));
            console.log( pst.newDescription)
            let descriptionData = pst.newDescription.replace('==*', '');
            this.groupLinkdata = descriptionData.split(':-');
            if (this.groupLinkdata[1]) {
              let startPos = pst.newDescription.indexOf('==>') + 1
              let endPos = pst.newDescription.indexOf('==>', startPos)
              let textDesc = pst.newDescription.substring(startPos, endPos)
              let newDescription = textDesc.replace('=>', '')
              this.viewLink = false
              pst.newDescriptionLink = this.groupLinkdata[0]
              pst.newDescription = newDescription
              console.log(pst.newDescription)
              pst.colorCss = 'faq'
            }
            else {
              this.viewLink = true;
              pst.colorCss = '';
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              const isBase64 = base64RegExp.test(pst.description)
              if(isBase64 == true){
                pst.newDescription = decodeURIComponent(escape(window.atob(pst.description)))
              }
              else{
                pst.newDescription  = pst.description;
              }
            }
          }
          // else{
          //   pst.newDescription  = pst.description;
          // }
        // else {
        //     this.viewLink = true
        //     pst.colorCss = ''
        //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //     const isBase64 = base64RegExp.test(pst.description )
        //     if(isBase64 == true){
        //       pst.description  = decodeURIComponent(escape(window.atob(pst.description )))
        //     }
        //     else{
        //       pst.description  = pst.description ;
        //     }
        //   }
          //parent content
          if (pst.parentPostContent) {
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
           const isBase64 = base64RegExp.test(pst.parentPostContent);
          console.log( pst.parentPostContent)
          if(isBase64 == true){
            console.log( pst.parentPostContent)
            pst.newContentDescription = decodeURIComponent(escape(window.atob( pst.parentPostContent)));
            console.log( pst.newContentDescription)
            let descriptionContentData = pst.newContentDescription.replace('==*', '');
            this.groupLinkContentdata = descriptionContentData.split(':-');
            if (this.groupLinkContentdata[1]) {
              let startPos = pst.newContentDescription.indexOf('==>') + 1
              let endPos = pst.newContentDescription.indexOf('==>', startPos)
              let textDesc = pst.newContentDescription.substring(startPos, endPos)
              let newContentDescription = textDesc.replace('=>', '')
              this.viewLink = false
              pst.newDescriptionLink = this.groupLinkContentdata[0]
            pst.newContentDescription = newContentDescription
              console.log(pst.newContentDescription)
              pst.colorCss = 'faq'
            }
            else {
              this.viewLink = true
              pst.colorCss = '';
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              const isBase64 = base64RegExp.test(pst.parentPostContent)
              if(isBase64 == true){
                pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
              }
              else{
                pst.parentPostContent  = pst.parentPostContent;
              }
            }
          }
          // else{
          //   pst.parentPostContent   = pst.parentPostContent ;
          // }
            // let descriptionContentData = pst.parentPostContent.replace(
            //   '==*',
            //   '',
            // )
            // this.groupLinkContentdata = descriptionContentData.split(':-')
            // if (this.groupLinkContentdata[1]) {
            //   let startPos = pst.parentPostContent.indexOf('==>') + 1
            //   let endPos = pst.parentPostContent.indexOf('==>', startPos)
            //   let textDesc = pst.parentPostContent.substring(startPos, endPos)
            //   let newDescription = textDesc.replace('=>', '')
            //   this.viewLink = false
            //   pst.parentPostContent = this.groupLinkContentdata[0]
            //   pst.colorCss = 'faq'
            //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            //   const isBase64 = base64RegExp.test(newDescription )
            //   if(isBase64 == true){
            //     pst.newContentDescription = decodeURIComponent(escape(window.atob(newDescription)))
            //   }
            //   else{
            //     pst.newContentDescription  = newDescription;
            //   }
            // } else {
            //   this.viewLink = true
            //   pst.colorCss = ''
            //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            //   const isBase64 = base64RegExp.test(pst.parentPostContent )
            //   if(isBase64 == true){
            //     pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
            //   }
            //   else{
            //     pst.parentPostContent  = pst.parentPostContent;
            //   }
            // }
          }
          if (pst.postFrom == 'admin' || pst.postFrom == 'miniflux') {
            console.log(pst.postFrom)
            pst.postFromData = 'POCN'
            // this.showAdmin[i]= true;
          }
          if (
            pst.postFileType == 'image/png' ||
            pst.postFileType == 'image/jpg' ||
            pst.postFileType == 'image/jpeg'
          ) {
            this.imageType[i] = false
            this.videoType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'video/mpeg' ||
            pst.postFileType == 'video/mpg' ||
            pst.postFileType == 'video/mp4' ||
            pst.postFileType == 'video/quicktime'
          ) {
            this.videoType[i] = false
            this.imageType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'audio/mpeg' ||
            pst.postFileType == 'audio/wave' ||
            pst.postFileType == 'audio/mp3'
          ) {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = false
          } else {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = true
          }
          i = i + 1
          this.postView.push(pst)
        })
        if (data['getMyPost'].data == null || postList.length < 5) {
          this.getGroupPosts()
        }
      })
  }
  //for other limit post view
  getOtherPosts() {

    // this.hideLinkPreview = false;

    this.viewPreviousIcon = true;
    let token = this._pocnLocalStorageManager.getData('pocnApiAccessToken')
    let i = this.postView.length
    this._pocnService
      .getOtherMyPost(token, this.otherPostLimit)
      .subscribe(({ data }) => {
        this.setScrollBar = false
        console.log('other', data)
        this.groupPostLimit = 0
        if (this.loading.isLoading) {
          //console.log("test")
          this.loading.dismiss()
        }
        let postList = []
        if (data['getMyPost'].data != null) {
          postList = JSON.parse(JSON.stringify(data['getMyPost'].data))
          if (postList.length > 0) {
            if (this.connectionDataFlag == false && this.userDataFlag == false && this.publishDataFlag == false && this.groupDataFlag == false && this.otherPostLimit == 0) {
              this.postView = [];
            }
          }
          this.otherPostLimit = this.otherPostLimit + postList.length
        }

        postList.forEach((pst, index) => {
          //console.log(i)
          let dt = pst.createdDate + 'Z'
          let date = new Date(dt)
          pst.createdDate = date
          pst.profileImgUrl =
            environment.postProfileImgUrl +
            pst.originalPostUserId +
            '.' +
            pst.originalFileExtension +
            '?lastmod=' +
            Math.random()
          pst.profileShareImgUrl =
            environment.postProfileImgUrl +
            pst.userId +
            '.' +
            pst.fileExtension +
            '?lastmod=' +
            Math.random()
          let postImageUrl =
            environment.postImgUrl + pst.fileName + '?lastmod=' + Math.random()
          var encoded_url = btoa(postImageUrl)
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
          var path =
            '/rs:' +
            'fit' +
            ':' +
            '300' +
            ':' +
            '400' +
            ':' +
            0 +
            '/g:' +
            'no' +
            '/' +
            encoded_url +
            '.' +
            pst.fileExtension
          //console.log(path)
          var shaObj = new jsSHA('SHA-256', 'BYTES')
          shaObj.setHMACKey(environment.imageProxyKey, 'HEX')
          shaObj.update(this.hex2a(environment.imageProxySalt))
          shaObj.update(path)
          var hmac = shaObj
            .getHMAC('B64')
            .toString()
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
          pst.postImageUrl =
            environment.imageProxyUrl +
            '/' +
            hmac +
            path +
            '?lastmod=' +
            Math.random()
          this.groupViewLink = environment.groupLink + '/group-details-edit/';
          pst.commentDescData = pst.description;
          //descrition
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          // let descriptionData = pst.description.replace('==*', '')
          // this.groupLinkdata = descriptionData.split(':-')
          // if (this.groupLinkdata[1]) {
          //   let startPos = pst.description.indexOf('==>') + 1
          //   let endPos = pst.description.indexOf('==>', startPos)
          //   let textDesc = pst.description.substring(startPos, endPos)
          //   let newDescription = textDesc.replace('=>', '')
          //   this.viewLink = false
          //   pst.description = this.groupLinkdata[0]
          //   pst.colorCss = 'faq'
          //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          //   const isBase64 = base64RegExp.test(newDescription)
          //   if(isBase64 == true){
          //     pst.newDescription = decodeURIComponent(escape(window.atob(newDescription)))
          //   }
          //   else{
          //     pst.newDescription  = newDescription;
          //   }
          // }
          const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          const isBase64 = base64RegExp.test(pst.description);
          console.log( pst.description)
          if(isBase64 == true){
            console.log( pst.description)
            pst.newDescription = decodeURIComponent(escape(window.atob( pst.description)));
            console.log( pst.newDescription)
            let descriptionData = pst.newDescription.replace('==*', '');
            this.groupLinkdata = descriptionData.split(':-');
            if (this.groupLinkdata[1]) {
              let startPos = pst.newDescription.indexOf('==>') + 1
              let endPos = pst.newDescription.indexOf('==>', startPos)
              let textDesc = pst.newDescription.substring(startPos, endPos)
              let newDescription = textDesc.replace('=>', '')
              this.viewLink = false
              pst.newDescriptionLink = this.groupLinkdata[0]
              pst.newDescription = newDescription
              console.log(pst.newDescription)
              pst.colorCss = 'faq'
            }
            else {
              this.viewLink = true;
              pst.colorCss = '';
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              const isBase64 = base64RegExp.test(pst.description)
              if(isBase64 == true){
                pst.newDescription = decodeURIComponent(escape(window.atob(pst.description)))
              }
              else{
                pst.newDescription  = pst.description;
              }
            }
          }
          // else{
          //   pst.newDescription  = pst.description;
          // }
        //   else if(pst.description.match(urlRegex)) {
        //     let trimDescription = pst.description
        //     const matches = pst.description.match(urlRegex);
        //     const firstUrl = pst.description.match(/https?:\/\/[^\s]+/);
        //     pst.description = firstUrl ? pst.description.replace(firstUrl[0], '') : pst.description;
        //     console.log(matches)
        //     pst.urlMeta = matches;
        //     console.log( pst.urlMeta)
        //     this.getLinkPreview(pst.urlMeta[0])
        //     .subscribe(preview => {
        //       pst.preview = preview;
        //       if (!pst.preview.title) {
        //         pst.title = pst.preview.url;
        //       }
        //       this.hideLinkPreview = true;
        //       pst.errorStatus = 'null';
        //     }, error => {
        //       console.log("error")
        //       pst.description = trimDescription;
        //       this.hideLinkPreview = false;
        //       pst.errorStatus = "Too many requests / rate limit exceeded. Please try again";
        //       pst.preview.url = pst.urlMeta;
        //       pst.preview.title = pst.preview.url;
        //     });
        //     pst.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl( pst.urlMeta[0]);
        // }

          //parent content
          if (pst.parentPostContent) {
          const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
           const isBase64 = base64RegExp.test(pst.parentPostContent);
          console.log( pst.parentPostContent)
          if(isBase64 == true){
            console.log( pst.parentPostContent)
            pst.newContentDescription = decodeURIComponent(escape(window.atob( pst.parentPostContent)));
            console.log( pst.newContentDescription)
            let descriptionContentData = pst.newContentDescription.replace('==*', '');
            this.groupLinkContentdata = descriptionContentData.split(':-');
            if (this.groupLinkContentdata[1]) {
              let startPos = pst.newContentDescription.indexOf('==>') + 1
              let endPos = pst.newContentDescription.indexOf('==>', startPos)
              let textDesc = pst.newContentDescription.substring(startPos, endPos)
              let newContentDescription = textDesc.replace('=>', '')
              this.viewLink = false
              pst.newContentDescription = newContentDescription;
              pst.newDescriptionLink = this.groupLinkContentdata[0]
              console.log(pst.newContentDescription)
              pst.colorCss = 'faq'
            }
            else {
              this.viewLink = true
              pst.colorCss = '';
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              const isBase64 = base64RegExp.test(pst.parentPostContent)
              if(isBase64 == true){
                pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
              }
              else{
                pst.parentPostContent  = pst.parentPostContent;
              }
            }
          }
          // else{
          //   pst.parentPostContent   = pst.parentPostContent ;
          // }
            // let descriptionContentData = pst.parentPostContent.replace(
            //   '==*',
            //   '',
            // )
            // this.groupLinkContentdata = descriptionContentData.split(':-')
            // if (this.groupLinkContentdata[1]) {
            //   let startPos = pst.parentPostContent.indexOf('==>') + 1
            //   let endPos = pst.parentPostContent.indexOf('==>', startPos)
            //   let textDesc = pst.parentPostContent.substring(startPos, endPos)
            //   let newDescription = textDesc.replace('=>', '')
            //   this.viewLink = false
            //   pst.parentPostContent = this.groupLinkContentdata[0]
            //   pst.colorCss = 'faq';
            //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            //   const isBase64 = base64RegExp.test(newDescription)
            //   if(isBase64 == true){
            //     pst.newContentDescription = decodeURIComponent(escape(window.atob(newDescription)))
            //   }
            //   else{
            //     pst.newContentDescription  = newDescription;
            //   }
            // } else {
            //   this.viewLink = true
            //   pst.colorCss = '';
            //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            //   const isBase64 = base64RegExp.test(pst.parentPostContent)
            //   if(isBase64 == true){
            //     pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
            //   }
            //   else{
            //     pst.parentPostContent  = pst.parentPostContent;
            //   }
            // }
          }
          if (pst.postFrom == 'admin' || pst.postFrom == 'miniflux') {
            console.log(pst.postFrom)
            pst.postFromData = 'POCN'
            // this.showAdmin[i]= true;
          }
          if (
            pst.postFileType == 'image/png' ||
            pst.postFileType == 'image/jpg' ||
            pst.postFileType == 'image/jpeg'
          ) {
            this.imageType[i] = false
            this.videoType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'video/mpeg' ||
            pst.postFileType == 'video/mpg' ||
            pst.postFileType == 'video/mp4' ||
            pst.postFileType == 'video/quicktime'
          ) {
            this.videoType[i] = false
            this.imageType[i] = true
            this.audioType[i] = true
          } else if (
            pst.postFileType == 'audio/mpeg' ||
            pst.postFileType == 'audio/wave' ||
            pst.postFileType == 'audio/mp3'
          ) {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = false
          } else {
            this.videoType[i] = true
            this.imageType[i] = true
            this.audioType[i] = true
          }
          i = i + 1
        this.postView.push(pst);
        if(pst.length < 5 ){
          this.setScrollBar = false;
        }
       // this.defaultPostView.push(pst);
        })
      })
  }
  //   getpocnPosts1() {
  //    this.showSearchData = true;
  //     this._pocnService.pocnPosts().subscribe(({ data }) => {
  //     this.postView = JSON.parse(JSON.stringify(data['pocnPosts'].nodes));
  //     if(this.loading.isLoading){
  //       this.loading.dismiss();
  //     }
  //     this.postView.forEach((field, index) => {
  //         let dt = field.postDate + 'Z';
  //         let date = new Date(dt);
  //         this.postView[index].postDate = date;
  //         this.postView[index].profileImgUrl = environment.postProfileImgUrl + field.userId + '.' + field.fileExtension + '?lastmod=' + Math.random();

  //       if((field.postFileType == 'image/png') || (field.postFileType  == 'image/jpg' )|| (field.postFileType  =='image/jpeg')){
  //         this.imageType[index] = false;
  //         this.videoType[index] = true;
  //         this.audioType[index] = true;
  //       }
  //       else if((field.postFileType  == 'video/mpeg') || (field.postFileType  == 'video/mpg' )|| (field.postFileType  =='video/mp4') || (field.postFileType  =='video/quicktime')){
  //         this.videoType[index] = false;
  //         this.imageType[index] = true;
  //         this.audioType[index] = true;
  //       }
  //       else if((field.postFileType  == 'audio/mpeg') || (field.postFileType  == 'audio/wave' )|| (field.postFileType  =='audio/mp3')){
  //           this.videoType[index] = true;
  //           this.imageType[index] = true;
  //           this.audioType[index] = false;
  //       }
  //       else{
  //         this.videoType[index] = true;
  //         this.imageType[index] = true;
  //         this.audioType[index] = true;
  //       }
  //   });
  //   },
  //   (error) => {

  //     if(this.loading.isLoading){
  //       this.loading.dismiss();
  //     }
  //     this._pocnLocalStorageManager.removeData("firstName");
  //     this._pocnLocalStorageManager.removeData("lastName");
  //     this._pocnLocalStorageManager.removeData("pocnApiAccessToken");
  //     this._pocnLocalStorageManager.removeData("userEmail");
  //     this._pocnLocalStorageManager.removeData("refreshToken");
  //     this._pocnLocalStorageManager.removeData("tabName");
  //     this._pocnLocalStorageManager.removeData("subTabName");
  //     this._pocnLocalStorageManager.removeData("userId");
  //     this.router.navigate(["/register"]);
  //   })
  // }
  // pocnRefetchPosts() {
  //   this.showSearchData = true;
  //    this._pocnService.pocnRefetchPosts().subscribe(({ data }) => {
  //    this.postView = JSON.parse(JSON.stringify(data['pocnPosts'].nodes));

  //    if(this.loading.isLoading){
  //      this.loading.dismiss();
  //    }
  //    this.postView.forEach((field, index) => {
  //     let dt = field.postDate + 'Z';
  //     let date = new Date(dt);
  //     this.postView[index].postDate = date;
  //     //  let videoData = field;
  //     //  let content = videoData.postAttachment.substring(0, videoData.postAttachment.lastIndexOf(";") + 1);
  //      if((field.postFileType == 'image/png') || (field.postFileType  == 'image/jpg' )|| (field.postFileType  =='image/jpeg')){
  //       this.imageType[index] = false;
  //       this.videoType[index] = true;
  //       this.audioType[index] = true;
  //     }
  //     else if((field.postFileType  == 'video/mpeg') || (field.postFileType  == 'video/mpg' )|| (field.postFileType  =='video/mp4') || (field.postFileType  =='video/quicktime')){
  //       this.videoType[index] = false;
  //       this.imageType[index] = true;
  //       this.audioType[index] = true;
  //     }
  //     else if((field.postFileType  == 'audio/mpeg') || (field.postFileType  == 'audio/wave' )|| (field.postFileType  =='audio/mp3')){
  //         this.videoType[index] = true;
  //         this.imageType[index] = true;
  //         this.audioType[index] = false;
  //     }
  //     else{
  //       this.videoType[index] = true;
  //       this.imageType[index] = true;
  //       this.audioType[index] = true;
  //     }
  //  });
  //  },
  //  (error) => {

  //    if(this.loading.isLoading){
  //      this.loading.dismiss();
  //    }
  //    this._pocnLocalStorageManager.removeData("firstName");
  //    this._pocnLocalStorageManager.removeData("lastName");
  //    this._pocnLocalStorageManager.removeData("pocnApiAccessToken");
  //    this._pocnLocalStorageManager.removeData("userEmail");
  //    this._pocnLocalStorageManager.removeData("refreshToken");
  //    this._pocnLocalStorageManager.removeData("tabName");
  //    this._pocnLocalStorageManager.removeData("subTabName");
  //    this._pocnLocalStorageManager.removeData("userId");
  //    this.router.navigate(["/register"]);
  //  })
  // }
  //navigate to dialer screen
  async presentLoading() {
    const popover = await this.modalController.create({
      component: OverlayPopoverPage,
      cssClass: 'overlay-modal',
    })
    popover.onDidDismiss().then((modalDataResponse) => {
      this.router.navigate(['/tablinks/my-profile'])
    })
    await popover.present()
  }

  async postPopOver() {
    const popover = await this.modalController.create({
      component: PostPopoverPage,
      cssClass: 'post-modal',
    })
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse && modalDataResponse.data == 'success') {
        this.showPostSuccess = false
        this.content.scrollToTop(3000)
        setTimeout(
          function () {
            this.showPostSuccess = true
          }.bind(this),
          3000,
        )

        this.postView = []
        this.userPostLimit = 0
        this.connectionPostLimit = 0
        this.publishPostLimit = 0
        this.groupPostLimit = 0
        this.otherPostLimit = 0
        this.getpocnPosts()
      }
    })

    await popover.present()
  }
  async showSharePopover(postId) {
    // console.log(postId)
    // //temporarily commented
    const popover = await this.popoverCtrl.create({
      component: PostSharePopoverPage,
      cssClass: 'edit-modal',
      event,
      componentProps: {
        postId: postId,
        // onClick: (type) => {
        // },
      },
    })
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse && modalDataResponse.data == 'connection') {
        this.showSharePostSuccess = false
        this.content.scrollToTop(3000)
        setTimeout(
          function () {
            this.showSharePostSuccess = true
          }.bind(this),
          8000,
        )
        this.postView = [];
        this.userPostLimit = 0;
        this.connectionPostLimit = 0;
        this.publishPostLimit = 0;
        this.groupPostLimit = 0;
        this.otherPostLimit = 0;
        this.getpocnPosts()
      }
    })
    await popover.present()
  }
  async deletePostPopover(deletePostId) {
    const popover = await this.popoverCtrl.create({
      component: DeletePostPopoverPage,
      cssClass: 'edit-modal',
      event,
      componentProps: {
        postId: deletePostId,
        // onClick: (type) => {
        // },
      },
    })
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse && modalDataResponse.data == 'delete') {
        this.loading.present()

        this.showDeletePostSuccess = false
        this.content.scrollToTop(3000)
        setTimeout(
          function () {
            this.showDeletePostSuccess = true
          }.bind(this),
          6500,
        )
        this.postView = [];
        this.userPostLimit = 0;
        this.connectionPostLimit = 0;
        this.publishPostLimit = 0;
        this.groupPostLimit = 0;
        this.otherPostLimit = 0;
        this.getpocnPosts();
      }
    })
    await popover.present()
  }
  async commentPopover(postId, descData, index) {
    const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
    const isBase64 = base64RegExp.test(descData)
    if(isBase64 == true){
      let descDecodeData;
      descDecodeData = decodeURIComponent(escape(window.atob(descData)))
      let descriptionData = descDecodeData.replace('==*', '')
      this.groupLinkdata = descriptionData.split(':-')
      if (this.groupLinkdata[1]) {
        let startPos = descDecodeData.indexOf('==>') + 1
        let endPos = descDecodeData.indexOf('==>', startPos)
        let textDesc = descDecodeData.substring(startPos, endPos)
        let newDescription = textDesc.replace('=>', '')
        this.viewLink = false;
        this.descDataLink= this.groupLinkdata[0];
        descData = newDescription;
        this.groupData = "faq";
        // const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        // const isBase64 = base64RegExp.test(newDescription)
        // if(isBase64 == true){
        //   descData = decodeURIComponent(escape(window.atob(newDescription)))
        // }
        // else{
        //   descData  = newDescription;
        // }
      }
      else{
        descData = descDecodeData;
        this.groupData = "faq";
      }
      //descData = decodeURIComponent(escape(window.atob(descData)))
    }
    // else{
    //   console.log("dertr")

    // }
    const popover = await this.modalController.create({
      component: QuotePopoverPage,
      cssClass: 'quote-modal',
      componentProps: { postId: postId, descData: descData,  groupData:this.groupData , descDataLink: this.descDataLink },
    })
    descData = '';
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse && modalDataResponse.data == 'success') {
        this.modalDataPost = modalDataResponse.data
        this.loading.present()
        this.showPostSuccess = false
        this.content.scrollToTop(3000)
        setTimeout(
          function () {
            this.showPostSuccess = true
          }.bind(this),
          6500,
        )
        this.postView = [];
        this.userPostLimit = 0;
        this.connectionPostLimit = 0;
        this.publishPostLimit = 0;
        this.groupPostLimit = 0;
        this.otherPostLimit = 0;
        this.getpocnPosts();
      }
    })
    await popover.present()
  }
  searchPosts(ev: any) {
    //Keyboard.hide();
   this.setScrollBar =false;
    this.searchLoaderStatus = false
    this.hideSearchData = true
    let searchText = ev
    this.searchTextData = searchText
    let searchData = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      searchText: searchText,
      offsetVal: this.postSearch.length,
    }
    this._pocnService.searchPost(searchData).subscribe(({ data }) => {
      let postList = JSON.parse(JSON.stringify(data['searchPost'].data))
      let i = this.postSearch.length
      //console.log(this.postSearch)
      postList.forEach((pst, index) => {
        let dt = pst.postDate + 'Z'
        let date = new Date(dt)
        pst.postDate = date
        pst.profileImgUrl =
          environment.postProfileImgUrl +
          pst.userId +
          '.' +
          pst.fileExtension +
          '?lastmod=' +
          Math.random()
        let postImageUrl =
          environment.postImgUrl + pst.fileName + '?lastmod=' + Math.random()
        var encoded_url = btoa(postImageUrl)
          .replace(/=/g, '')
          .replace(/\//g, '_')
          .replace(/\+/g, '-')
        var path =
          '/rs:' +
          'fit' +
          ':' +
          '300' +
          ':' +
          '400' +
          ':' +
          0 +
          '/g:' +
          'no' +
          '/' +
          encoded_url +
          '.' +
          pst.fileExtension
        var shaObj = new jsSHA('SHA-256', 'BYTES')
        shaObj.setHMACKey(environment.imageProxyKey, 'HEX')
        shaObj.update(this.hex2a(environment.imageProxySalt))
        shaObj.update(path)
        var hmac = shaObj
          .getHMAC('B64')
          .toString()
          .replace(/=/g, '')
          .replace(/\//g, '_')
          .replace(/\+/g, '-')
        pst.postImageUrl =
          environment.imageProxyUrl +
          '/' +
          hmac +
          path +
          '?lastmod=' +
          Math.random()
        this.groupViewLink = environment.groupLink + '/group-details-edit/'
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        // let descriptionData = pst.description.replace('==*', '')
        // this.groupLinkdata = descriptionData.split(':-')
        // if (this.groupLinkdata[1]) {
        //   let startPos = pst.description.indexOf('==>') + 1
        //   let endPos = pst.description.indexOf('==>', startPos)
        //   let textDesc = pst.description.substring(startPos, endPos)
        //   let newDescription = textDesc.replace('=>', '')
        //   this.viewLink = false
        //   pst.description = this.groupLinkdata[0]
        //   pst.colorCss = 'faq'
        //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //   const isBase64 = base64RegExp.test(newDescription)
        //   if(isBase64 == true){
        //     pst.newDescription = decodeURIComponent(escape(window.atob(newDescription)))
        //   }
        //   else{
        //     pst.newDescription  = newDescription;
        //   }
        // }
      //   else if(pst.description.match(urlRegex)) {
      //     let trimDescription = pst.description;
      //       const matches = pst.description.match(urlRegex);
      //       const firstUrl = pst.description.match(/https?:\/\/[^\s]+/);
      //       pst.description = firstUrl ? pst.description.replace(firstUrl[0], '') : pst.description;
      //       console.log(matches)
      //       pst.urlMeta = matches;
      //       console.log( pst.urlMeta)
      //       this.getLinkPreview(pst.urlMeta[0])
      //       .subscribe(preview => {
      //         pst.preview = preview;
      //         if (!pst.preview.title) {
      //           pst.title = pst.preview.url;
      //         }
      //         pst.errorStatus = 'null';
      //       }, error => {
      //         console.log("error")
      //         pst.description = trimDescription;
      //         this.hideLinkPreview = true;
      //         pst.errorStatus = "Too many requests / rate limit exceeded. Please try again";
      //         pst.preview.url = pst.urlMeta;
      //         pst.preview.title = pst.preview.url;
      //       });
      // //       this.getLinkPreview(pst.urlMeta[0])
      // // .subscribe(
      // //   preview => {
      // //     pst.preview = preview;
      // //     this.errorMessage = '';
      // //   },
      // //   error => {
      // //     pst.preview = null;
      // //     this.errorMessage = error;
      // //   }
      // // );
      //       pst.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl( pst.urlMeta[0]);

      //       // this.getMetaData(pstUrl).subscribe((data: any) => {
      //       //   console.log(data)
      //       //   pst.previewImage = data.openGraph.image;
      //       // });
      //    // });
      //   }
      // );
            //pst.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl( pst.urlMeta[0]);

            // this.getMetaData(pstUrl).subscribe((data: any) => {
            //   console.log(data)
            //   pst.previewImage = data.openGraph.image;
            // });
         // });
       // }
        // else {
        //   this.viewLink = true
        //   pst.colorCss = ''
        //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //   const isBase64 = base64RegExp.test(pst.description)
        //   if(isBase64 == true){
        //     pst.description = decodeURIComponent(escape(window.atob(pst.description)))
        //   }
        //   else{
        //     pst.description = pst.description;
        //   }
        // }
        //parent content
        // if (pst.parentPostContent) {
        //   let descriptionContentData = pst.parentPostContent.replace('==*', '')
        //   this.groupLinkContentdata = descriptionContentData.split(':-')
        //   if (this.groupLinkContentdata[1]) {
        //     let startPos = pst.parentPostContent.indexOf('==>') + 1
        //     let endPos = pst.parentPostContent.indexOf('==>', startPos)
        //     let textDesc = pst.parentPostContent.substring(startPos, endPos)
        //     let newDescription = textDesc.replace('=>', '')
        //     this.viewLink = false
        //     pst.parentPostContent = this.groupLinkContentdata[0]
        //     pst.colorCss = 'faq'
        //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //     const isBase64 = base64RegExp.test(newDescription)
        //     if(isBase64 == true){
        //       pst.newContentDescription = decodeURIComponent(escape(window.atob(newDescription)))
        //     }
        //     else{
        //       pst.newContentDescription = newDescription;
        //     }
        //   } else {
        //     this.viewLink = true;
        //     pst.colorCss = '';
        //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //     const isBase64 = base64RegExp.test(pst.parentPostContent)
        //     if(isBase64 == true){
        //       pst.parentPostContent= decodeURIComponent(escape(window.atob(pst.parentPostContent)))
        //     }
        //     else{
        //       pst.parentPostContent =  pst.parentPostContent;
        //     }
        //   }
        // }

         //descrption
         const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
         const isBase64 = base64RegExp.test(pst.description);
         console.log( pst.description)
         if(isBase64 == true){
           console.log( pst.description)
           pst.newDescription = decodeURIComponent(escape(window.atob( pst.description)));
           console.log( pst.newDescription)
           let descriptionData = pst.newDescription.replace('==*', '');
           this.groupLinkdata = descriptionData.split(':-');
           if (this.groupLinkdata[1]) {
             let startPos = pst.newDescription.indexOf('==>') + 1
             let endPos = pst.newDescription.indexOf('==>', startPos)
             let textDesc = pst.newDescription.substring(startPos, endPos)
             let newDescription = textDesc.replace('=>', '')
             this.viewLink = false
             pst.newDescriptionLink = this.groupLinkdata[0]
             pst.newDescription = newDescription
             console.log(pst.newDescription)
             pst.colorCss = 'faq'
           }
           else {
             this.viewLink = true;
             pst.colorCss = '';
             const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
             const isBase64 = base64RegExp.test(pst.description)
             if(isBase64 == true){
               pst.newDescription = decodeURIComponent(escape(window.atob(pst.description)))
             }
            //  else{
            //    pst.newDescription  = pst.description;
            //  }
           }
         }
        //  else{
        //    pst.newDescription  = pst.description;
        //  }
       // else {
       //     this.viewLink = true
       //     pst.colorCss = ''
       //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
       //     const isBase64 = base64RegExp.test(pst.description )
       //     if(isBase64 == true){
       //       pst.description  = decodeURIComponent(escape(window.atob(pst.description )))
       //     }
       //     else{
       //       pst.description  = pst.description ;
       //     }
       //   }
         //parent content
         if (pst.parentPostContent) {
           const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          const isBase64 = base64RegExp.test(pst.parentPostContent);
         console.log( pst.parentPostContent)
         if(isBase64 == true){
           console.log( pst.parentPostContent)
           pst.newContentDescription = decodeURIComponent(escape(window.atob( pst.parentPostContent)));
           console.log( pst.newContentDescription)
           let descriptionContentData = pst.newContentDescription.replace('==*', '');
           this.groupLinkContentdata = descriptionContentData.split(':-');
           if (this.groupLinkContentdata[1]) {
             let startPos = pst.newContentDescription.indexOf('==>') + 1
             let endPos = pst.newContentDescription.indexOf('==>', startPos)
             let textDesc = pst.newContentDescription.substring(startPos, endPos)
             let newContentDescription = textDesc.replace('=>', '')
             this.viewLink = false
             pst.newDescriptionLink = this.groupLinkContentdata[0]
             pst.newContentDescription = newContentDescription
             console.log(pst.newContentDescription)
             pst.colorCss = 'faq'
           }
           else {
             this.viewLink = true
             pst.colorCss = '';
             const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
             const isBase64 = base64RegExp.test(pst.parentPostContent)
             if(isBase64 == true){
               pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
             }
            //  else{
            //    pst.parentPostContent  = pst.parentPostContent;
            //  }
           }
         }
        //  else{
        //    pst.parentPostContent   = pst.parentPostContent ;
        //  }
       }
        if(pst.postFrom == "miniflux" || pst.postFrom == "admin") {
          pst.postFromData = 'POCN'
        }
        if (
          pst.postFileType == 'image/png' ||
          pst.postFileType == 'image/jpg' ||
          pst.postFileType == 'image/jpeg'
        ) {
          this.imageType[i] = false
          this.videoType[i] = true
          this.audioType[i] = true
        } else if (
          pst.postFileType == 'video/mpeg' ||
          pst.postFileType == 'video/mpg' ||
          pst.postFileType == 'video/mp4' ||
          pst.postFileType == 'video/quicktime'
        ) {
          this.videoType[i] = false
          this.imageType[i] = true
          this.audioType[i] = true
        } else if (
          pst.postFileType == 'audio/mpeg' ||
          pst.postFileType == 'audio/wave' ||
          pst.postFileType == 'audio/mp3'
        ) {
          this.videoType[i] = true
          this.imageType[i] = true
          this.audioType[i] = false
        } else {
          this.videoType[i] = true
          this.imageType[i] = true
          this.audioType[i] = true
        }
        i = i + 1
        this.postSearch.push(pst)
      })
      if (this.postSearch.length > 0 && searchText != '') {
       this.viewPreviousIcon = false;
        this.searchLoaderStatus = true
        this.showSearchData = false
        this.hideSearchData = true
        this.emptyShowResult = true
      } else if (this.postSearch.length == 0 || this.postSearch == null) {
       this.viewPreviousIcon = false;
        this.searchLoaderStatus = true
        this.showSearchData = true
        this.hideSearchData = true
        this.emptyShowResult = false
      } else {

       this.viewPreviousIcon = false;
        this.searchLoaderStatus = true;
        this.searchTextData = '';
        this.postView = [];
        this.postSearch = [];
        this.userPostLimit = 0;
        this.connectionPostLimit = 0;
        this.publishPostLimit = 0;
        this.groupPostLimit = 0;
        this.otherPostLimit = 0;
        this.getpocnPosts();
        this.showSearchData = true;
        this.hideSearchData = false;
        this.emptyShowResult = true;
      }
    })
  }
  // getLinkPreview(link: string): Observable<any> {
  //   // const apiUrl = 'https://api.linkpreview.net';
  //   // const apiKey = '385b793a618b1f864e5d6bcdab8d0cf0';

  //   // const headers = new HttpHeaders({
  //   //   'Content-Type': 'application/json',
  //   //   'X-Api-Key': apiKey
  //   // });
  //   // return this.httpClient.post<any>(apiUrl, { link }, { headers })
  //   // .pipe(
  //   //   map(response => {
  //   //     // Extract the link preview data from the response
  //   //     const data = response.data;
  //   //     const preview = {
  //   //       title: data.title,
  //   //       description: data.description,
  //   //       image: data.image,
  //   //       url: data.url
  //   //     };
  //   //     return preview;
  //   //   }),
  //   //   catchError(error => {
  //   //     // Handle rate limiting errors
  //   //     if (error.status === 429) {
  //   //       const resetTime = error.headers.get('X-RateLimit-Reset');
  //   //       const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  //   //       const errorMessage = `API rate limit exceeded. Please try again in ${retryAfter} seconds.`;
  //   //       return throwError(errorMessage);
  //   //     }
  //   //     // Handle other errors
  //   //     const errorMessage = `An error occurred: ${error.message}`;
  //   //     return throwError(errorMessage);
  //   //   })
  //   // );
  //   const api = 'https://api.linkpreview.net/?key=385b793a618b1f864e5d6bcdab8d0cf0&q=' + link;
  //   console.log(api)
  //   return this.httpClient.get(api);
  // }
async basicProfileClick(userId) {
  let postData;
  postData = {
    userId: userId,
  }
  const popover = await this.modalController.create({
    // component: PostPublicProfilePage,
    // cssClass: 'post-profile-modal',
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
postDetailNavigate(postId){
  //this.router.navigate(['/post-detailpage'])
  this.router.navigateByUrl('tablinks/post/post-detail-page', { state: { postId: postId } });
}

likePost(postId,i,type, likeStatus): void{
const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  let  postLikeData = {
    accessToken:token,
    postId: postId,
    ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
    geoLocation: '',
    device: this.deviceType,
    channel: this.device.userAgent,
  }
  if(likeStatus == "liked"){
    if(type == 'viewPost') {
      this.postView[i].likeCount ++;
      this.postView[i].likedUsers.push(
        this._pocnLocalStorageManager.getData('userId'),
      )
    } else {
      if(type == 'searchPost') {
        this.postSearch[i].likeCount ++;
        this.postSearch[i].likedUsers.push(
          this._pocnLocalStorageManager.getData('userId'),
        )
      }
    }
  }
  else{
    // const index = this.postView[i].likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
    // this.postView[i].likedUsers.splice(index,1)
    if(type == "viewPost") {
      this.postView[i].likeCount --;
      const index = this.postView[i].likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
      this.postView[i].likedUsers.splice(index,1)
      } else{
        if(type == "searchPost") {
          this.postSearch[i].likeCount --;
          const index = this.postSearch[i].likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
          this.postSearch[i].likedUsers.splice(index,1)
          console.log(this.postSearch[i].likedUsers)
       }
    }
  }

  this._pocnService.likePost(postLikeData).subscribe(
    (response: LikePostResponse) => {
      if(response.data) {
        if(response.data.likePost.postStatusLikeResponse.status == "success") {
        //  if(type == "viewPost") {
        //   this.postView[i].likeCount = response.data.likePost.postStatusLikeResponse.totalCount;
        //  }
        //  else{
        //   if(type == "searchPost") {
        //     this.postSearch[i].likeCount = response.data.likePost.postStatusLikeResponse.totalCount;
        //   }
        //  }
          this.likeStatus = response.data.likePost.postStatusLikeResponse.likeStatus;
          if(this.likeStatus == "True"){
            // this.getpocnPosts();
            const spanName = "post-like-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData('userId'),
                firstName: this._pocnLocalStorageManager.getData('firstName'),
                lastName: this._pocnLocalStorageManager.getData('lastName'),
                userEmail: this._pocnLocalStorageManager.getData('userEmail'),
                postId: postId,
              }
              const eventName = 'post like'
              const event = {
                userEmail: this._pocnLocalStorageManager.getData('userEmail'),
                status: 'success',
                message: 'successfully liked post',
              }
              this.telemetry
                .sendTrace(spanName, attributes, eventName, event)
                .then((result: string) => {
                  this.telemetry.parentTrace = result
                })
              // if (type == 'viewPost') {
              //   this.postView[i].likedUsers.push(
              //     this._pocnLocalStorageManager.getData('userId'),
              //   )
              // } else {
              //   if (type == 'searchPost') {
              //     this.postSearch[i].likedUsers.push(
              //       this._pocnLocalStorageManager.getData('userId'),
              //     )
              //   }
              // }
          }
          else{
            if(this.likeStatus == "False" ){
              this.showSearchData = false;
              // if(type == "viewPost") {
              //   const index = this.postView[i].likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
              //   this.postView[i].likedUsers.splice(index,1)
              //   } else{
              //     if(type == "searchPost") {
              //       const index = this.postSearch[i].likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
              //       this.postSearch[i].likedUsers.splice(index,1)
              //    }
              // }
              const spanName = "post-unlike-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                  postId: postId,
              }
              const eventName = 'post unlike';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully unliked post' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
            }
          }
        }
      }
    }
  );
}
  ionViewDidEnter() {
    this.userPostLimit = 0;
    this.connectionPostLimit = 0;
    this.publishPostLimit = 0;
    this.groupPostLimit = 0;
    this.otherPostLimit = 0;
    //this.loading.present();
    //this.getDefaultPost();
    // this.getOtherPosts();
    this.getpocnPosts();
    this.refetchPost = this.location.getState();
    if (this.refetchPost.refetchPost == 'refetchPost') {
    }
    this.PostCommentData = this.location.getState()
    if (this.PostCommentData.postMsg == 'success') {
      this.showPostSuccess = false;
      //this.content.scrollToTop(3000);
      setTimeout(
        function () {
          this.showPostSuccess = true;
        }.bind(this),
        3000,
      )
    }
    this.token = this._pocnLocalStorageManager.getData('pocnApiAccessToken')
    this.location.getState();
    this.providerUserInfos();
    this.getMyConnectionsRequestNotification();
    this.getDialerCaller();
    this.postView = [];
    if (this.isMobile == true) {
      this.deviceType = 'Mobile'
    } else if (this.isTablet == true) {
      this.deviceType = 'Tablet'
    } else if (this.isDesktop == true) {
      this.deviceType = 'Desktop'
    } else {
      this.deviceType = 'Unknown'
    }
    this.userAgent =
      this.detectBrowserName() + ',' + this.detectBrowserVersion()
    // this.getPosition();
    this.loadIp()
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(
      10,
      () => {},
    )
  }
  goToPost(){
    this.viewPreviousIcon = false;
    this.searchText = '';
    this.searchPosts(this.searchText);
  }
  getMyConnectionsRequestNotification(){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getMyConnectionsRequestNotification(token)?.subscribe(({ data }) => {
      this.notificationData = data['getMyConnectionsRequestNotification'].data;
      this.requestorCount = data['getMyConnectionsRequestNotification'].data.requestorCount;
      this.requestorNames = data['getMyConnectionsRequestNotification'].data.requestorNames;
      if(this.requestorCount == 0){
       this.showNotification = false;
      }
       if(this.requestorCount == 1 || this.requestorCount == 2){
        this.showNotification = true;
      }
       if(this.requestorCount > 2){
        this.showConNotification = true;
        this.conNotificationData = this.requestorNames.split(',');
        this.countData = this.requestorCount-2;
        this.notificationName = this.conNotificationData[0] + ',' +this.conNotificationData[1];
       }

    });
  }
  dismiss(){
    console.log("hiii");
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.updateMyConnectionsRequestNotification(token).subscribe(({ data }) => {
      console.log("hiii",data);
      this.showNotification = false;
      this.showConNotification = false;
    })
  }
}
