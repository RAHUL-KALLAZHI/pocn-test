import { Component, OnInit, ViewChild } from '@angular/core';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { Router ,ActivatedRoute,Params, NavigationEnd} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GroupPostPopoverPage } from "../group-post-popover/group-post-popover.page";
import { IonContent } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { PublicProfilePage } from '../public-profile/public-profile.page';
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LikePostResponse } from './../../services/type';
import { PopoverController } from "@ionic/angular";
import { DeletePostPopoverPage } from "../delete-post-popover/delete-post-popover.page";
import { QuoteGroupPopoverPage } from "../quote-group-popover/quote-group-popover.page";
import { Observable, ReplaySubject } from 'rxjs';
import jsSHA from 'jssha';
import { Location } from '@angular/common'
import { TelemetryService } from 'src/app/services/telemetry.service';
import { CreateRoomResponse } from './../../services/type';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.page.html',
  styleUrls: ['./group-detail.page.scss'],
})
export class GroupDetailPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  profileImg = "assets/images-pocn/join-request.png";
  public groupTagLine;
  public groupData;
  public getUserGrpDetail;
  groupIdData;
  public groupDescription;
  public groupSpecialty;
  public groupTags;
  public groupTherapeuticArea;
  public groupIcon;
  public groupBanner;
  public groupName;
  public controlledGroup;
  public membersList;
  public pendingMembers;
  public memberInvite: boolean = false;
  public joinBtn: boolean = false;
  public canceljoinBtn: boolean = false;
  public joinRequestEmptyMessage: boolean = false;
  tabType = 'posts';
  memberTotalCount;
  memberTotalCountOnly= 1;
  membersCountLabel= 'Member';
  adminUserId;
  loggedInUserId;
  userId;
 ownerUserIdData;
 roleId;
  public adminView: boolean = false;
  background = {
    backgroundImage:
      'url(assets/images-pocn/sky-bg.jpg)',
  };
  showPostSuccess: boolean = true;
  groupId: string;
  imageType: boolean[] = [];
  videoType: boolean[] = [];
  audioType: boolean[] = [];
  groupPostView: any;
  imageUrl = environment.postImgUrl;
  searchLoaderStatus: boolean = true;
  showSearchData: boolean = true;
  hideSearchData: boolean = false;
  postSearch: any=[];
  emptyShowResult: boolean = true;
  searchText;
  userIp = '';
  deviceType: string = '';
  geolocationPosition: string = '';
  userAgent: string;
  likeStatus: any;
  modalDataPost;
  showDeletePostSuccess: boolean = true;
  showPostData: boolean = true;
  showBanner: boolean = true;
  postFileName = "";
  fileSize: any;
  fileType: string;
  fileDate: string;
  idfileErrorStatus:boolean = false;
  errorMsg = '';
  postImageErrorMsg: boolean = false;
  postErrorMsg = '';
  resumeFileType = ["image/jpeg", "image/jpg", "image/png","image/PNG", "image/JPG", "image/JPEG"];
  postFileType;
  showImage;
  attachmentTypeContent ;
  showImageData;
  bannerFileName;
  bannerExtension;
  grpEditImageUrl;
  refetchPost;
  memberUserId;
  public hcpVerified : number;
  public phoneLinked: number;
  public verificationType: string;
  public userRoomData: string;
  showAdmin: boolean[] = [];
  groupViewLink: string;
  descriptionLink;
  groupLinkdata;
  groupLinkContentdata;
  viewLink: boolean = true
  classColor;
  hideLinkPreview: boolean = false;
  constructor(private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public alertController: AlertController,
    public modalController: ModalController,
    private route: ActivatedRoute,
    public loading: LoadingService,
    private httpClient: HttpClient,
    private popoverCtrl: PopoverController,
    private deviceService: DeviceDetectorService,
    private location: Location,
    public telemetry: TelemetryService,


    ) {
      this.route.params.subscribe((params: Params) => {
      this.groupId = params.groupId;
    })
    let currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.refetchPost = this.location.getState();
        if(this.refetchPost.groupMsg == "groupEditDetail"){
          this.getUserGroupDetail();
          this.pocnGroupPosts();
        }
        if(this.refetchPost.postDetailMsg == "groupDelete"){
          this.getUserGroupDetail();
          this.pocnGroupPosts();
        }
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
    this.loading.present();
    let token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    if(token == "" || token == null){
      this.router.navigate(["/"]);
    }
    this.getUserGroupDetail();
    this.pocnGroupPosts();
    //this.groupMembersLists();
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
  }
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
  getUserGroupDetail(){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    const userId = this._pocnLocalStorageManager.getData("userId");
    this.userId = userId;
    this.loggedInUserId = userId;
    const groupId = this.router.url.split('?')[0].split('/').pop();
    this.groupIdData = groupId;
    this._pocnService.getUserGroupDetail(token,groupId)?.subscribe(({ data }) => {
      if(this.loading.isLoading){
        this.loading.dismiss();
      }
      this.getUserGrpDetail = data['getUserGroupDetail'].data;
     this.groupTagLine = data['getUserGroupDetail'].data[0].tagLine;
     this.groupDescription = data['getUserGroupDetail'].data[0].description;
     this.groupSpecialty = data['getUserGroupDetail'].data[0].specialty;
     this.groupTags = data['getUserGroupDetail'].data[0].tags;
     this.groupTherapeuticArea = data['getUserGroupDetail'].data[0].therapeuticArea;
     this.groupIcon = data['getUserGroupDetail'].data[0].groupIcon;
     this.groupBanner = data['getUserGroupDetail'].data[0].groupBanner;
     this.groupName = data['getUserGroupDetail'].data[0].name;
     this.memberInvite = data['getUserGroupDetail'].data[0].memberInvite;
     let ownerUserId = data['getUserGroupDetail'].data[0].ownerUserId;
     this.ownerUserIdData = ownerUserId;
     this.controlledGroup = data['getUserGroupDetail'].data[0].controlledGroup;
     this.bannerFileName = data['getUserGroupDetail'].data[0].bannerFileName;
     this.bannerExtension = data['getUserGroupDetail'].data[0].bannerExtension;
     let grpEditImageUrl = environment.grpImgUrl + this.bannerFileName + '.' + this.bannerExtension + '?lastmod=' + Math.random();
     this.roleId = data['getUserGroupDetail'].data[0].roleId;
     this.memberUserId = data['getUserGroupDetail'].data[0].memberUserId;
     var encoded_url = btoa(grpEditImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
     var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
      "/g:" + "no"  + "/" + encoded_url + "." + this.bannerExtension;
      //console.log(path)
      var shaObj = new jsSHA("SHA-256", "BYTES")
      shaObj.setHMACKey(environment.imageProxyKey, "HEX");
      shaObj.update(this.hex2a(environment.imageProxySalt));
      shaObj.update(path);
     var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

     this.grpEditImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
     if(ownerUserId == userId) {   // admin login
       this.memberInvite = true;
       this.adminView = true;
     }
     if(this.groupBanner != ''){
       this.background = { backgroundImage:'url('+this.groupBanner+')'};
     }

     this.getUserGroups();

    },
    (error) => {
        this.router.navigate(['/'])
    });
   }
   getUserGroups(){
     const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
     const groupId = this.router.url.split('?')[0].split('/').pop();

     this._pocnService.getUserGroups(token).subscribe(({ data }) => {
       let userGroups = data['getUserGroups']['data'];
       if(userGroups.length<1){
         this.joinBtn = true;  // Not currently a member
         this.memberInvite = false;  // Not currently a member

       }
       else{
         let filter;
         filter = userGroups.filter(x => x.groupUuid === groupId);
         if(filter.length > 0){
           this.joinBtn = false;  // Already a member
         }
         else{
           this.joinBtn = true;  // Not currently a member
           this.memberInvite = false;
         }

       }

       this.groupMembersLists();

     });
   }

   groupMembersLists(){
     const currentUserId = this._pocnLocalStorageManager.getData("userId");
     const groupId = this.router.url.split('?')[0].split('/').pop();

     this._pocnService.groupMembersLists(groupId).subscribe(({ data }) => {
       let activeMembers = data.groupMembersLists.nodes.filter(x => x.status == 1)
       this.memberTotalCount = activeMembers.length;
       this.memberTotalCountOnly = activeMembers.length;
       if(this.memberTotalCount > 1){
         this.membersCountLabel = "Members";
         this.memberTotalCount = this.memberTotalCount + " Members"
       }
       else{
         this.membersCountLabel = "Member";
         this.memberTotalCount = this.memberTotalCount + " Member"
       }
       this.membersList = activeMembers;

       let activeMemberCheck = data.groupMembersLists.nodes.filter(x => x.status == 0 && x.memberUserId == currentUserId)
       if (activeMemberCheck.length > 0){
         this.canceljoinBtn = true;
         this.joinBtn = false;
       }
       else{
         //this.joinBtn = false;
         //this.canceljoinBtn = true;

       }


       // data to display in join requests section
           //console.log();
           let pendingMembers = data.groupMembersLists.nodes.filter(x => x.status == 0)

           this.pendingMembers = pendingMembers;
           if(this.pendingMembers.length < 1){
             this.joinRequestEmptyMessage = true

           }


     });
   }




   joinGroupMethod(){
     const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
     const groupId = this.router.url.split('?')[0].split('/').pop();
     let input = {
       groupId: groupId,
       ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
       ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
       device: this.deviceType,
       channel: this.device.userAgent,
       geoLocation: '',
     }
     this._pocnService.joinGroup(input,token).subscribe(
       (response: any) => {
         if (response.data.joinGroup.groupStatusResponse.status === 'success') {

           if(this.controlledGroup === false){
             this.showAlert("Join Request Sent Successfully.");
           }
           else{
             this.showAlert("Joined Group Successfully.");
           }
           //this.joinBtn = false;
           //this.memberInvite = true;
           this.getUserGroupDetail();
           //this.groupMembersLists();
           //this.getUserGroups();

         }
       },
       (error) => {
         this.router.navigate(['/'])
       });
   }
   leaveGroupMethod(){

     if(this.adminView === true){
       this.showAlert("You are the Admin of this group. Please assign someone as admin and leave." );
     }
   else{
     const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
     const groupId = this.router.url.split('?')[0].split('/').pop();
     let type = "remove";
     let ipAddressV4 =  this._pocnLocalStorageManager.getData("ipv4");
     let ipAddressV6 =  this._pocnLocalStorageManager.getData("ipv6");
     let device = this.deviceType;
     let channel =  this.device.userAgent;
     let geoLocation =  ''
     this.alertController.create({
       cssClass: 'my-alert',
       subHeader: 'Are you sure you want to exit from this group?',
       buttons: [
         {
           text: 'Cancel',
           role: 'cancel',
           cssClass: 'secondary',
           handler: (blah) => {
           }
         }, {
           text: 'Ok',
           handler: () => {
             this._pocnService.withdrawGroupJoinRequest(token,groupId,type,ipAddressV4,ipAddressV6,device,channel,geoLocation).subscribe(
               (response: any) => {
                 if (response.data.withdrawJoinRequest.groupStatusResponse.status === 'success') {
                   this.showAlert("You are no longer a member of this group" );
                   this.router.navigate(['/home'])

                 }
               },
               (error) => {
                   //console.log('there was an error sending the query', error);
                   this.router.navigate(['/'])
               });
           }
         }
       ]
     }).then(res => {
       res.present();
     });
   }


   }
   showAlert(message) {
    this.alertController.create({
      header: '               ',
      subHeader: message,
      message: '                ',
      buttons: ['OK']
    }).then(res => {
      res.present();
    });
}
showGroupDetailEdit(){
  let grpDetail = this.getUserGrpDetail.filter(x => x.memberUserId == this.userId)
  // if(this.ownerUserIdData == this.userId) {   // admin login
  if(grpDetail.length==0){
      this.router.navigateByUrl('tablinks/groups/group-details-view/' + this.groupIdData,{ state: {  postDetailMsg: this.refetchPost.postDetailMsg} } );

    //this.router.navigate(['/group-details-view/' + this.groupIdData ]);
  }
  else{
    if(grpDetail[0]['roleId'] == 1){
        this.router.navigateByUrl('tablinks/groups/group-details-edit/' + this.groupIdData,{ state: {  postDetailMsg: this.refetchPost.postDetailMsg} } );

     // this.router.navigate(['/group-details-edit/' + this.groupIdData]);
    }
    else{
        this.router.navigateByUrl('tablinks/groups/group-details-view/' + this.groupIdData,{ state: {  postDetailMsg: this.refetchPost.postDetailMsg} } );
      // console.log("hiiiielse");
      // this.router.navigate(['/group-details-view/' + this.groupIdData ]);
    }
  }
}
async postPopOver() {
  const popover = await this.modalController.create({
    component: GroupPostPopoverPage,
    cssClass: 'post-modal',
    componentProps: {
      'groupId' : this.groupId
    },
  });
  popover.onDidDismiss().then((modalDataResponse) => {
    if(modalDataResponse && modalDataResponse.data == 'success'){
      this.showPostSuccess = false;
      this.content.scrollToTop(3000);
      setTimeout(function () {
        this.showPostSuccess = true;
      }.bind(this), 3000);
      this.pocnGroupPosts();
    }
  });


  await popover.present();

}
// getLinkPreview(link: string): Observable<any> {
//   const api = 'https://api.linkpreview.net/?key=385b793a618b1f864e5d6bcdab8d0cf0&q=' + link;
//   console.log(api)
//   return this.httpClient.get(api);
// }
pocnGroupPosts(){
  // this.hideLinkPreview = false;
  this.showSearchData = true;
  this.groupPostView = [];
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  this._pocnService.getGroupPosts(this.groupId,token)?.subscribe(({ data }) => {
    let groupPostView = JSON.parse(JSON.stringify(data['getGroupPosts'].data));
    if(groupPostView == ''){
      this.showPostData = false;
    }
    else{
      this.showPostData = true;
    }
    if(this.loading.isLoading){
      this.loading.dismiss();
    }
    groupPostView.forEach((field, index) => {
        let dt = field.createdDate + 'Z';
        let date = new Date(dt);
        groupPostView[index].postDate = date;
        field.profileShareImgUrl =
        environment.postProfileImgUrl +
        field.userId +
        '.' +
        field.fileExtension +
        '?lastmod=' +
        Math.random()
        groupPostView[index].profileImgUrl = environment.postProfileImgUrl + field.originalPostUserId + '.' + field.originalFileExtension + '?lastmod=' + Math.random();
        let postImageUrl = environment.postImgUrl + groupPostView[index].fileName + '?lastmod=' + Math.random();
        var encoded_url = btoa(postImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
        var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
         "/g:" + "no"  + "/" + encoded_url + "." + groupPostView[index].originalFileExtension;
         //console.log(path)
         var shaObj = new jsSHA("SHA-256", "BYTES")
         shaObj.setHMACKey(environment.imageProxyKey, "HEX");
         shaObj.update(this.hex2a(environment.imageProxySalt));
         shaObj.update(path);
        var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
        groupPostView[index].postImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
        this.groupViewLink = environment.groupLink + '/group-details-edit/';

          //descrition
          let descriptionData = field.description.replace('==*', '')
          this.groupLinkdata = descriptionData.split(':-')
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          let trimDescription = field.description;
          if (this.groupLinkdata[1]) {
            let startPos = field.description.indexOf('==>') + 1
            let endPos = field.description.indexOf('==>', startPos)
            let textDesc = field.description.substring(startPos, endPos)
            let newDescription = textDesc.replace('=>', '')
            this.viewLink = false
            field.description = this.groupLinkdata[0]
            field.colorCss = 'faq';
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(newDescription)

            if(isBase64 == true){
              field.newDescription = decodeURIComponent(escape(window.atob(newDescription)))
            }
            else{
              field.newDescription = newDescription;
            }
          }
        //   else if(field.description.match(urlRegex)) {
        //     const matches = field.description.match(urlRegex);
        //     const firstUrl = field.description.match(/https?:\/\/[^\s]+/);
        //     field.description = firstUrl ? field.description.replace(firstUrl[0], '') : field.description;
        //     console.log(matches)
        //     field.urlMeta = matches;
        //     console.log( field.urlMeta)
        //     this.getLinkPreview(field.urlMeta[0])
        //     .subscribe(preview => {
        //       field.preview = preview;
        //       if (!field.preview.title) {
        //         field.title = field.preview.url;
        //       }
        //       this.hideLinkPreview = true;
        //     }, error => {
        //       field.description = trimDescription;
        //       this.hideLinkPreview = false;
        //       field.preview.url = field.urlMeta;
        //       field.preview.title = field.preview.url;
        //     });
        // }
        else {
            this.viewLink = true;
            field.colorCss = '';
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(field.description)
            if(isBase64 == true){
              field.description = decodeURIComponent(escape(window.atob(field.description)))
            }
            else{
              field.description = field.description;
            }
          }
          //parent content
          if (field.parentPostContent) {
            let descriptionContentData = field.parentPostContent.replace('==*','',
)
            this.groupLinkContentdata = descriptionContentData.split(':-')
            if (this.groupLinkContentdata[1]) {
              let startPos = field.parentPostContent.indexOf('==>') + 1
              let endPos = field.parentPostContent.indexOf('==>', startPos)
              let textDesc = field.parentPostContent.substring(startPos, endPos)
              let newDescription = textDesc.replace('=>', '')
              this.viewLink = false
              field.parentPostContent = this.groupLinkContentdata[0]
              field.colorCss = 'faq'
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              const isBase64 = base64RegExp.test(newDescription)
              if(isBase64 == true){
                field.newContentDescription = decodeURIComponent(escape(window.atob(newDescription)))
              }
              else{
                field.newContentDescription = newDescription;
              }
            } else {
              this.viewLink = true;
              field.colorCss = '';
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              const isBase64 = base64RegExp.test(field.parentPostContent)
              if(isBase64 == true){
                field.parentPostContent = decodeURIComponent(escape(window.atob(field.parentPostContent)))
              }
              else{
                field.parentPostContent = field.parentPostContent;
              }
            }
          }
          if (field.postFrom == 'admin') {
            field.postFromData = 'POCN'
            // this.showAdmin[i]= true;
          }
      if((field.postFileType == 'image/png') || (field.postFileType  == 'image/jpg' )|| (field.postFileType  =='image/jpeg')){
        this.imageType[index] = false;
        this.videoType[index] = true;
        this.audioType[index] = true;
      }
      else if((field.postFileType  == 'video/mpeg') || (field.postFileType  == 'video/mpg' )|| (field.postFileType  =='video/mp4') || (field.postFileType  =='video/quicktime')){
        this.videoType[index] = false;
        this.imageType[index] = true;
        this.audioType[index] = true;
      }
      else if((field.postFileType  == 'audio/mpeg') || (field.postFileType  == 'audio/wave' )|| (field.postFileType  =='audio/mp3')){
          this.videoType[index] = true;
          this.imageType[index] = true;
          this.audioType[index] = false;
      }
      else{
        this.videoType[index] = true;
        this.imageType[index] = true;
        this.audioType[index] = true;
      }
      this.groupPostView.push(field);
  });
  },
  (error) => {

    // if(this.loading.isLoading){
    //   this.loading.dismiss();
    // }
    // this._pocnLocalStorageManager.removeData("firstName");
    // this._pocnLocalStorageManager.removeData("lastName");
    // this._pocnLocalStorageManager.removeData("pocnApiAccessToken");
    // this._pocnLocalStorageManager.removeData("userEmail");
    // this._pocnLocalStorageManager.removeData("refreshToken");
    // this._pocnLocalStorageManager.removeData("tabName");
    // this._pocnLocalStorageManager.removeData("subTabName");
    // this._pocnLocalStorageManager.removeData("userId");
    // this.router.navigate(["/register"]);
  })
}
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
  this.router.navigateByUrl('tablinks/post/post-detail-page', { state: { postId: postId, backMsg:"groupPage", groupData:'groupDelete',
  groupId:this.groupId } });
}
hex2a(hexx:any) {
  var hex = hexx.toString() //force conversion
  var str = ''
  for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}
// onImgError(event,fileName){
//   event.target.src = environment.postImgUrl + fileName + '?lastmod=' + Math.random();
// }
// onImgError(event,fileName = '', extension = ''){
//   if(fileName !='' && fileName != null && extension!='' &&  extension!=null){
//    event.target.src = environment.grpImgUrl + fileName +'.' +extension;
//   }
// else{
//  event.target.src = 'assets/images-pocn/user-default.png'
// }
// }
onImgPostError(event,fileName){
if(fileName !='' && fileName != null){
    event.target.src = environment.postImgUrl + fileName + '?lastmod=' + Math.random();
   }
   else{
    event.target.src = 'assets/images-pocn/group-default-thumbnail.svg'
   }
}
onImgError(event,fileName){
  event.target.src = 'assets/images-pocn/group-default-banner.png'
  // if(fileName !='' && fileName != null){
  //   event.target.src = environment.postImgUrl + fileName + '?lastmod=' + Math.random();
  //  }
  //  else{
  //  event.target.src = 'assets/images-pocn/group-defaultimage.svg'
  //  }
}
likePost(postId,i,type,likeStatus): void{
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  let postLikeData = {
    accessToken: token,
    postId: postId,
    ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
    ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
    geoLocation: '',
    device: this.deviceType,
    channel: this.device.userAgent,
  }
    if(likeStatus == "liked"){
      if(type == 'viewPost') {
        this.groupPostView[i].likeCount ++;
        this.groupPostView[i].likedUsers.push(
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
      // const index = this.groupPostView[i].likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
      // this.groupPostView[i].likedUsers.splice(index,1)
      if(type == "viewPost") {
        this.groupPostView[i].likeCount --;
        const index = this.groupPostView[i].likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
        this.groupPostView[i].likedUsers.splice(index,1)
        } else{
          if(type == "searchPost") {
            this.postSearch[i].likeCount --;
            const index = this.postSearch[i].likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
            this.postSearch[i].likedUsers.splice(index,1)
         }
      }
    }
    this._pocnService.likePost(postLikeData).subscribe(
      (response: LikePostResponse) => {
        if(response.data) {
          if(response.data.likePost.postStatusLikeResponse.status == "success") {
            //this.groupPostView[i].likeCount = response.data.likePost.postStatusLikeResponse.totalCount;
            this.likeStatus = response.data.likePost.postStatusLikeResponse.likeStatus;
            if(this.likeStatus == "True"){
              const spanName = "group-post-like-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'group post like';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully liked post' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
             // this.groupPostView[i].likedUsers.push(this._pocnLocalStorageManager.getData("userId"));
            }
            else{
              if(this.likeStatus == "False" ){
                const spanName = "group-post-unlike-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'group post unlike';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully unliked post' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              //   const index = this.groupPostView[i].likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
              //  this.groupPostView[i].likedUsers.splice(index,1)
              }
            }
          }
        }
      }
    );
  }
  async commentPopover(postId,descData,groupUuid) {
    const popover = await this.modalController.create({
      component: QuoteGroupPopoverPage,
      cssClass: 'quote-modal',
      componentProps: {postId: postId,descData:descData,groupUuid:groupUuid
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if(modalDataResponse && modalDataResponse.data == 'success'){
        this.modalDataPost = modalDataResponse.data ;
        this.loading.present();
        this.showPostSuccess = false;
        this.content.scrollToTop(3000);
        setTimeout(function () {
          this.showPostSuccess = true;
        }.bind(this), 3500);
        // this.groupPostView = [];
        this.pocnGroupPosts();
      }
    });
    await popover.present();
  }

  async showSharePopover(postId) {
    //temporarily commented
    // const popover = await this.popoverCtrl.create({
    //   component: PostSharePopoverPage,
    //   cssClass: 'edit-modal',
    //   event,
    //   componentProps: {postId: postId,
    //     // onClick: (type) => {
    //     // },
    //   },
    // });
    // popover.onDidDismiss().then((modalDataResponse) => {
    //   if(modalDataResponse && modalDataResponse.data == 'connection'){
    //     this.showSharePostSuccess = false;
    //     this.content.scrollToTop(3000);
    //     setTimeout(function () {
    //       this.showSharePostSuccess = true;
    //     }.bind(this), 3500);
    //     this.groupPostView = [];
    //     this.getpocnPosts();
    //   }
    //  });
    // await popover.present();
  }
  async deletePostPopover(deletePostId) {
    const popover = await this.popoverCtrl.create({
      component: DeletePostPopoverPage,
      cssClass: 'edit-modal',
      event,
      componentProps: {postId: deletePostId,

        // onClick: (type) => {
        // },
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if(modalDataResponse && modalDataResponse.data == 'delete'){
        this.loading.present();

        this.showDeletePostSuccess = false;
        this.content.scrollToTop(3000);
        setTimeout(function () {
          this.showDeletePostSuccess = true;
        }.bind(this), 3500);
        this.pocnGroupPosts();
      }
     });
    await popover.present();
  }
  searchPostGroup(ev: any) {
    //Keyboard.hide();
    // this.hideLinkPreview = false;
    this.searchLoaderStatus = false;
    this.hideSearchData = true;
    let searchText = ev;
    let searchData = {
      accessToken:this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
      searchText: searchText,
      groupId: this.groupId
    }
    this._pocnService.searchPostGroup(searchData).subscribe(({ data }) => {
      //this.groupPostView = data['searchPost'].data;
      let postList = JSON.parse(JSON.stringify(data['searchPostGroup'].data));
        postList.forEach((pst, index) => {
        //console.log(i)
        let dt = pst.postDate + 'Z';
        let date = new Date(dt);
        pst.postDate = date;
        pst.profileImgUrl = environment.postProfileImgUrl + pst.userId + '.' + pst.fileExtension + '?lastmod=' + Math.random();
        let postImageUrl = environment.postImgUrl + pst.fileName + '?lastmod=' + Math.random();
        var encoded_url = btoa(postImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
        var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
         "/g:" + "no"  + "/" + encoded_url + "." + pst.fileExtension;
         //console.log(path)
         var shaObj = new jsSHA("SHA-256", "BYTES")
         shaObj.setHMACKey(environment.imageProxyKey, "HEX");
         shaObj.update(this.hex2a(environment.imageProxySalt));
         shaObj.update(path);
        var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

        pst.postImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
        this.groupViewLink = environment.groupLink + '/group-details-edit/';
        const urlRegex = /(https?:\/\/[^\s]+)/g;

          //descrition
          let descriptionData = pst.description.replace('==*', '')
          this.groupLinkdata = descriptionData.split(':-')
          if (this.groupLinkdata[1]) {
            let startPos = pst.description.indexOf('==>') + 1
            let endPos = pst.description.indexOf('==>', startPos)
            let textDesc = pst.description.substring(startPos, endPos)
            let newDescription = textDesc.replace('=>', '')
            this.viewLink = false
            pst.description = this.groupLinkdata[0]
            pst.colorCss = 'faq';
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(newDescription)
            if(isBase64 == true){
              pst.newDescription = decodeURIComponent(escape(window.atob(newDescription)))
            }
            else{
              pst.newDescription = newDescription;
            }
          }
        //   else if(pst.description.match(urlRegex)) {
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
        //     }, error => {
        //       this.hideLinkPreview = false;
        //       pst.preview.url = pst.urlMeta;
        //       pst.preview.title = pst.preview.url;
        //     });
        // }
        else {
            this.viewLink = true
            pst.colorCss = ''
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(pst.description)
            if(isBase64 == true){
              pst.description = decodeURIComponent(escape(window.atob(pst.description)))
            }
            else{
              pst.description = pst.description;
            }
          }
          //parent content
          if (pst.parentPostContent) {
            let descriptionContentData = pst.parentPostContent.replace('==*','',)
            this.groupLinkContentdata = descriptionContentData.split(':-')
            if (this.groupLinkContentdata[1]) {
              let startPos = pst.parentPostContent.indexOf('==>') + 1
              let endPos = pst.parentPostContent.indexOf('==>', startPos)
              let textDesc = pst.parentPostContent.substring(startPos, endPos)
              let newDescription = textDesc.replace('=>', '')
              this.viewLink = false
              pst.parentPostContent = this.groupLinkContentdata[0]
              pst.colorCss = 'faq'
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              const isBase64 = base64RegExp.test(newDescription)
              if(isBase64 == true){
                pst.newContentDescription = decodeURIComponent(escape(window.atob(newDescription)))
              }
              else{
                pst.newContentDescription = newDescription;
              }
            } else {
              this.viewLink = true
              pst.colorCss = '';
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              const isBase64 = base64RegExp.test(pst.parentPostContent)
              if(isBase64 == true){
                pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
              }
              else{
                pst.parentPostContent = pst.parentPostContent;
              }
            }
          }
          if (pst.postFrom == 'admin') {
            pst.postFromData = 'POCN'
            // this.showAdmin[i]= true;
          }
        if((pst.postFileType == 'image/png') || (pst.postFileType  == 'image/jpg' )|| (pst.postFileType  =='image/jpeg')){
          this.imageType[index] = false;
          this.videoType[index] = true;
          this.audioType[index] = true;
        }
        else if((pst.postFileType  == 'video/mpeg') || (pst.postFileType  == 'video/mpg' )|| (pst.postFileType  =='video/mp4') || (pst.postFileType  =='video/quicktime')){
          this.videoType[index] = false;
          this.imageType[index] = true;
          this.audioType[index] = true;
        }
        else if((pst.postFileType  == 'audio/mpeg') || (pst.postFileType  == 'audio/wave' )|| (pst.postFileType  =='audio/mp3')){
            this.videoType[index] = true;
            this.imageType[index] = true;
            this.audioType[index] = false;
        } else{
          this.videoType[index] = true;
          this.imageType[index] = true;
          this.audioType[index] = true;
        }
        this.postSearch.push(pst)
      })
      //console.log(this.postSearch)
      // this.groupPostView.forEach((field, index) => {
      //   let dt = field.postDate + 'Z';
      //   let date = new Date(dt);
      //   this.groupPostView[index].postDate = date;
      //   this.groupPostView[index].profileImgUrl = environment.postProfileImgUrl + field.userId + '.' + field.fileExtension + '?lastmod=' + Math.random();
      // //   let videoData = field;
      // // let content = videoData.postAttachment.substring(0, videoData.postAttachment.lastIndexOf(";") + 1);
      // if((field.postFileType == 'image/png') || (field.postFileType  == 'image/jpg' )|| (field.postFileType  =='image/jpeg')){
      //   this.imageType[index] = false;
      //   this.videoType[index] = true;
      //   this.audioType[index] = true;
      // }
      // else if((field.postFileType  == 'video/mpeg') || (field.postFileType  == 'video/mpg' )|| (field.postFileType  =='video/mp4') || (field.postFileType  =='video/quicktime')){
      //   this.videoType[index] = false;
      //   this.imageType[index] = true;
      //   this.audioType[index] = true;
      // }
      // else if((field.postFileType  == 'audio/mpeg') || (field.postFileType  == 'audio/wave' )|| (field.postFileType  =='audio/mp3')){
      //     this.videoType[index] = true;
      //     this.imageType[index] = true;
      //     this.audioType[index] = false;
      // }
      // else{
      //   this.videoType[index] = true;
      //   this.imageType[index] = true;
      //   this.audioType[index] = true;
      // }
      // });
      if(this.postSearch.length > 0 && searchText != ''){
        this.searchLoaderStatus = true;
        this.showSearchData = false;
        this.hideSearchData = true;
        this.emptyShowResult = true;
      } else if(this.postSearch.length == 0){
        this.searchLoaderStatus = true;
        this.showSearchData = true;
        this.hideSearchData = true;
        this.emptyShowResult = false;
      }
      else{
          this.searchLoaderStatus = true;
          this.postSearch = [];
		      this.pocnGroupPosts();
          this.showSearchData = true;
          this.hideSearchData = false;
          this.emptyShowResult = true;
      }
    })
  }
  onProfileImgError(event){
    event.target.src = "assets/images-pocn/group-default-thumbnail.svg";
  }
  convertToBase64(file : File) : Observable<string> {
    const result  = new ReplaySubject<any>(1);
    const reader  = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {result.next(reader.result)};
    return result;
  }
  goToGroups(){
    if(this.refetchPost.postDetailMsg == "editClose" ){
      this.router.navigate(['/tablinks/post'])
    }
    else{
      this.router.navigateByUrl('/tablinks/groups',{ state: {  groupMsg: 'groups'} } );
    }
   }
   patientConnectStatusCalls(type){
    this._pocnService.patientConnectStatusCalls(this._pocnLocalStorageManager.getData("userId").toUpperCase( )).subscribe(({ data }) => {
      if(data.patientConnectStatusCalls.nodes != ''){
        let setSuccess ;
        setSuccess = data.patientConnectStatusCalls.nodes[0];
        this.hcpVerified = setSuccess.hcpVerified;
        this.phoneLinked = setSuccess.phoneLinked;
        this.verificationType = setSuccess.verificationType;
        if(setSuccess.patientConnectRegistrationStatus == 1){
          if(type == 'audio'){
            this.router.navigate(['/dialer'])
          }
          else{
            this.goToVideoCall();
          }
        } else{
            // if(setSuccess.hcpVerified == 0 && setSuccess.phoneLinked == 1 &&  this.myUserDialerData.length > 0 && this.verificationType == 'Manual' ){
            //   this.router.navigate(['/dialer'])
            //   this.presentLoading();
            // } else{
              this.router.navigateByUrl('/connect', { state: { tabName: 'groups' , type: type} });
           // }
        }
      }
    })
  }

  goToVideoCall(){
    let createRoom: any;
    createRoom = {
            accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
            channel: this.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
            ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation:this.geolocationPosition,
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

}

