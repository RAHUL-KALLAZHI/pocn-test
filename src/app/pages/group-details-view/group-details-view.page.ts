import { Component, OnInit, ViewChild } from '@angular/core';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { AlertController, ModalController } from '@ionic/angular';
import { DeleteGroupConfirmPopoverPage } from "../delete-group-confirm-popover/delete-group-confirm-popover.page";
import { PopoverController} from "@ionic/angular";
import { Router ,ActivatedRoute,Params, NavigationEnd} from '@angular/router';
import { InviteGroupPagePage } from "../invite-group-page/invite-group-page.page";
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { GroupPostSharePopoverPage } from "../group-post-share-popover/group-post-share-popover.page";
import { GroupPublicProfilePage } from '../group-public-profile/group-public-profile.page';
import { IonContent } from '@ionic/angular';
import jsSHA from 'jssha';
import { Location } from '@angular/common';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { CreateRoomResponse} from './../../services/type';

@Component({
  selector: 'app-group-details-view',
  templateUrl: './group-details-view.page.html',
  styleUrls: ['./group-details-view.page.scss'],
})
export class GroupDetailsViewPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  profileImg = "assets/images-pocn/join-request.png";
  public groupTagLine;
  public groupData;
  groupIdData;
  ownerUserIdData;
  defaultImg ="assets/images-pocn/group-default-thumbnail.svg";
  imageUrl = environment.postProfileImgUrl;
  npRadio: boolean = true;
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
  public type;
  public specialty;
  public scope;
  grpDetails : any[];
  memberDetails : any[];
  groupRequestStatus;
  public groupScope;
  public memberInvite: boolean = false;
  requestJoinGrp: boolean = false;
  joinGrp: boolean = false;
  public showGrpDetails : boolean = false;
  public joinBtn: boolean = false;
  public canceljoinBtn: boolean = false;
  disableJoin: boolean = false;
  disableInvite: boolean = false;
  public therapeuticArea;
  public joinRequestEmptyMessage: boolean = false;
  tabType = 'posts';
  memberTotalCount;
  memberTotalCountOnly;
  membersCountLabel= 'Member';
  relatedGrpDetails : any[];
  adminUserId;
  userId;
  loggedInUserId;
  public adminView: boolean = false;
  showMemberData: boolean = false;
  leaveGrp: boolean = false;
  background = {
    backgroundImage:
      'url(assets/images-pocn/sky-bg.jpg)',
  };
  public groupId;
  public grpType: string;
  public currentUrl: string;
  postData: any;
  userAgent: any;
  userIp: string = '';
  deviceType: string = '';
  showPostSuccess: boolean = true;
  enrollment: any;
  leaveButton: boolean = false;
  showBanner: boolean = true;
  bannerFileName;
  bannerExtension;
  grpEditImageUrl;
  public refetchData;
  groupTablUrl;
  hideButtons: boolean = true;
  hideCloseButton: boolean = true;
  public hcpVerified : number;
  public phoneLinked: number;
  public verificationType: string;
  public userRoomData: string;
  geolocationPosition: string = '';
  constructor(
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private router: Router,
    private route: ActivatedRoute,
    public alertController: AlertController,
    public modalController: ModalController,
    private popoverCtrl: PopoverController,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    private location: Location,
    public telemetry: TelemetryService,
    ) {
      this.route.params.subscribe((params: Params) => {
        this.groupId = params.groupId;
        this.grpType = params.type;
      })
      router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.refetchData = this.location.getState();
          if(this.refetchData.tabMsg=="pendingTab" ){
           this.hideButtons = true;
          }
          // if(this.refetchData.groupMsg=="relatedGrp" ){
          //   console.log("hiii");
          //  this.hideCloseButton= true;
          // }
        };
      });
     // this.currentUrl = 'Check out my new Group' + ' ' +  window.location.protocol + "//" + window.location.host + window.location.pathname;
    // this.currentUrl = 'Check out my new Group' + ' ' +  environment.groupLink + this.router.url;
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
    let token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    if(token == "" || token == null){
      this.router.navigate(["/"]);
    }
    this.getUserGroupDetail();
    this.groupMembersListsCount();
    this.loadIp();
    this.getRelatedGroups();

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
//for fetching ipaddress
loadIp() {
  this.httpClient.get('https://jsonip.com').subscribe(
    (value:any) => {
      this.userIp = value.ip;
    },
    (error) => {
    }
  );

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
  getUserGroupDetail(){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    const userId = this._pocnLocalStorageManager.getData("userId");
    this.userId = userId;
    this.loggedInUserId = userId;
    const groupId = this.router.url.split('?')[0].split('/').pop();
    this.groupIdData = groupId;
    this._pocnService.getUserGroupDetail(token,this.groupId)?.subscribe(({ data }) => {
      this.grpDetails =  data['getUserGroupDetail'].data.filter((x) => {
        if(x.memberUserId.toLowerCase() == userId){
         return x.roleId
        }
     });
    //  if(this.grpDetails.length == 0){
    //    this.showGrpDetails = true;
    //  }
    //  else{
    //   this.showGrpDetails = false;
    //  }
     this.groupTagLine = data['getUserGroupDetail'].data[0].tagLine;
     this.groupDescription = data['getUserGroupDetail'].data[0].description;
     this.groupSpecialty = data['getUserGroupDetail'].data[0].specialty;
     this.groupTags = data['getUserGroupDetail'].data[0].tags;
     this.groupTherapeuticArea = data['getUserGroupDetail'].data[0].therapeuticArea;
     this.groupIcon = data['getUserGroupDetail'].data[0].groupIcon;
     this.groupBanner = data['getUserGroupDetail'].data[0].groupBanner;
     this.groupName = data['getUserGroupDetail'].data[0].name;
     this.memberInvite = data['getUserGroupDetail'].data[0].memberInvite;
     this.adminUserId = data['getUserGroupDetail'].data[0].ownerUserId;
     let ownerUserId = data['getUserGroupDetail'].data[0].ownerUserId;
     this.ownerUserIdData = ownerUserId;
     this.groupScope = data['getUserGroupDetail'].data[0].groupScope;
     this.scope = data['getUserGroupDetail'].data[0].scope;
     this.specialty = data['getUserGroupDetail'].data[0].specialty;
     this.type = data['getUserGroupDetail'].data[0].type;
     this.enrollment = data['getUserGroupDetail'].data[0].enrollment;
     this.therapeuticArea = data['getUserGroupDetail'].data[0].therapeuticArea;
     this.controlledGroup = data['getUserGroupDetail'].data[0].controlledGroup;
     this.bannerFileName = data['getUserGroupDetail'].data[0].bannerFileName;
     this.bannerExtension = data['getUserGroupDetail'].data[0].bannerExtension;
     let grpEditImageUrl = environment.grpImgUrl + this.bannerFileName + '.' + this.bannerExtension + '?lastmod=' + Math.random();

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

    //  this.getUserGroups();
    this.getUserGroupRequestStatus();

    },
    (error) => {
        this.router.navigate(['/'])
    });
   }

   async leaveGroup(){
     this.leaveButton = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    const groupId = this.router.url.split('?')[0].split('/').pop();
    let type = "remove";
    let ipAddressV4 =  this._pocnLocalStorageManager.getData("ipv4");
    let ipAddressV6 =  this._pocnLocalStorageManager.getData("ipv6");
    let device = this.deviceType;
    let channel =  this.device.userAgent;
    let geoLocation =  '';
    const popover = await this.modalController.create({
      component: DeleteGroupConfirmPopoverPage,
      cssClass: 'reject-modal',
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      this.leaveButton = false;
      if(modalDataResponse.data == 'confirm-delete'){
        this._pocnService.withdrawGroupJoinRequest(token,groupId,type,ipAddressV4,ipAddressV6,device,channel,geoLocation).subscribe(
          (response: any) => {
            if (response.data.withdrawGroupJoinRequest.groupStatusResponse.status === 'success') {
              //alert("You are no longer a member of this group" );
              const spanName = "leave-grp-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId
          }
          console.log(attributes);
          const eventName = 'leave group';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully leave group' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
              this.content.scrollToTop(3000);
              this.getUserGroupRequestStatus();
              this.leaveGrp= true;
              setTimeout(function () {
                this.leaveGrp= false;
              }.bind(this), 3000);
              this.router.navigate(['/tablinks/groups'])
              this.leaveButton = false;
            }
            else{
              const spanName = "leave-grp-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                groupUuid: this.groupId
            }
            console.log(attributes);
            const eventName = 'leave group';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to leave group' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
            }
          },
          (error) => {
              this.router.navigate(['/'])
          });
      }
      else{
        this.close('');
      }
    });
    await popover.present();
  }
  async close(data) {
    await this.popoverCtrl.dismiss(data);
  }
  joinGroupMethod(type){
    if(type=="Request to Join"){
      this.showGrpDetails == true ;
      this.disableJoin = true;
    }
    if(type=="Join"){
      this.showGrpDetails == false;
    }
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    // const groupId = this.router.url.split('?')[0].split('/').pop();
    let input = {
      groupId: this.groupId,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.device.userAgent,
      geoLocation: '',
    }
    this._pocnService.joinGroup(input,token).subscribe(
      (response: any) => {
        if (response.data.joinGroup.groupStatusResponse.status === 'success') {
          const spanName = "join-grp-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            groupUuid: this.groupId,
           
        }
        const eventName = 'join group';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully join grp' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
          if(this.controlledGroup === false){
            // this.content.scrollToTop(3000);
            // this.showAlert("Join Request Sent Successfully.");
            this.requestJoinGrp= true;
            setTimeout(function () {
              this.requestJoinGrp= false;
            }.bind(this), 3000);
          }
          else{
            // this.content.scrollToTop(3000);
            // this.showAlert("Joined Group Successfully.");
            this.joinGrp= true;
            setTimeout(function () {
              this.joinGrp= false;
            }.bind(this), 3000);
          }
          //this.joinBtn = false;
          //this.memberInvite = true;
          this.getUserGroupDetail();
          // this.getUserGroupRequestStatus();
          //this.groupMembersLists();
          //this.getUserGroups();

        }
        else{
          const spanName = "join-grp-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            groupUuid: this.groupId,
        }
        const eventName = 'join group';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to join grp' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
        }
      },
      (error) => {
        this.router.navigate(['/'])
      });
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
  async groupMembersLists(){
    const currentUserId = this._pocnLocalStorageManager.getData("userId");
    // const groupId = this.router.url.split('?')[0].split('/').pop();

    this._pocnService.groupMembersLists(this.groupId).subscribe(({ data }) => {
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
    const popover = await this.modalController.create({
      component: InviteGroupPagePage,
      cssClass: 'invite-group-modal',
      componentProps: {
        "groupId": this.groupId ,
      }
    });
    // popover.onDidDismiss().then((modalDataResponse) => {
    //   if(modalDataResponse.data == 'confirm-delete'){
    //     this._pocnService.withdrawGroupJoinRequest(token,groupId,type).subscribe(
    //       (response: any) => {
    //         if (response.data.withdrawJoinRequest.groupStatusResponse.status === 'success') {
    //           //alert("You are no longer a member of this group" );
    //           this.router.navigate(['/tablinks/groups'])
    //         }
    //       },
    //       (error) => {
    //           this.router.navigate(['/'])
    //       });
    //   }
    //   else{
    //     this.close('');
    //   }
    // });
    await popover.present();
  }
  groupMembersListsCount(){
    this._pocnService.groupMembersLists(this.groupId)?.subscribe(({ data }) => {
      this.memberDetails =  data['groupMembersLists'].nodes.filter((x) => {
        // if(x.memberUserId == userId){
         return x.roleId == 1
        // }
      })
      let activeMembers = data.groupMembersLists.nodes.filter(x => (x.status == 1 && x.roleId == 2));
      this.memberTotalCount = activeMembers.length;
      this.memberTotalCountOnly = activeMembers.length;
      this.membersList = activeMembers;
    });
  }
  getUserGroupRequestStatus(){
    if(this.refetchData.tabMsg=="pendingTab" ){
      this.hideButtons = true;
    }
    else{
      this.hideButtons = false;
    }
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getUserGroupRequestStatus(token,this.groupId).subscribe(({ data }) => {
      this.groupRequestStatus =  data['getUserGroupRequestStatus'].data;
      if(this.groupRequestStatus == "request-join"){
        this.disableJoin = true;
        this.showGrpDetails = true;
      }
      else if(this.groupRequestStatus == "joined"){
        this.showGrpDetails = false;
      }
      else if(this.groupRequestStatus == "invited"){
        this.disableInvite = true;
      }
      else{
        this.showGrpDetails = true;
        this.disableJoin = false;
      }
      })
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
        filter = userGroups.filter(x => x.groupUuid === this.groupId);
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
  async groupShareLists(groupName){
    // this.currentUrl =  groupName + ':-' + environment.groupLink + this.router.url ;
    var lastPart = this.router.url.split("/").pop();
    // this.currentUrl = groupName + ':-' + environment.groupLink + this.router.url;
     this.currentUrl = groupName + ':-' + environment.groupLink + '/group-detail/' + lastPart;
    const popover = await this.modalController.create({
        component: GroupPostSharePopoverPage,
        cssClass: 'invite-modal',
        componentProps: {
          'groupId' : this.groupId,
         'currentUrl' : this.currentUrl,
         'groupName' : groupName
        },
      });
      popover.onDidDismiss().then((modalDataResponse) => {
        if(modalDataResponse && modalDataResponse.data == 'success'){
          this.showPostSuccess = false;
          this.content.scrollToTop(3000);
          setTimeout(function () {
            this.showPostSuccess = true;
          }.bind(this), 3000);
        }

      });
     await popover.present();
  }
  hex2a(hexx:any) {
    var hex = hexx.toString() //force conversion
    var str = ''
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    return str
  }
  getRelatedGroups(){
    let accessToken = this._pocnLocalStorageManager.getData("pocnApiAccessToken")
     this._pocnService.relatedGroups(accessToken,this.groupId)?.subscribe(({ data }) => {
       this.relatedGrpDetails =  data['relatedGroups'].data;
       this.relatedGrpDetails = JSON.parse(JSON.stringify(data['relatedGroups'].data));
           this.relatedGrpDetails.forEach((field, index) => {
           let grpSubImageUrl = environment.grpImgUrl + field.bannerFileName   + '.' + field.bannerExtension + '?lastmod=' + Math.random();

           var encoded_url = btoa(grpSubImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
           var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
            "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
            //console.log(path)
            var shaObj = new jsSHA("SHA-256", "BYTES")
            shaObj.setHMACKey(environment.imageProxyKey, "HEX");
            shaObj.update(this.hex2a(environment.imageProxySalt));
            shaObj.update(path);
           var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

           field.grpSubImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
           });
     });
  }
  showGroupDetail(group){
    this.router.navigateByUrl('tablinks/groups/group-details-view/' + group.groupUuid,{ state: {  groupMsg: 'relatedGrp'} } );
    // this.router.navigate(['/group-details-view/' + group.groupUuid ]);
  }
  onImgError(event, fileName = '', extension = '') {
    // if (fileName != '' && fileName != null && extension != '' && extension != null) {
    //   event.target.src = environment.grpImgUrl + fileName + '.' + extension;
    // }
    // else {
    //  event.target.src = 'assets/images-pocn/group-defaultimage.svg'
    // }
    event.target.src = 'assets/images-pocn/white-group-default-thumbnail.svg'
  }
  onUserImgError(event){
    event.target.src = 'assets/images-pocn/group-default-thumbnail.svg'
  }
goToGroups(){
  history.back();
  // this.router.navigateByUrl('group-detail/' + this.groupId,{ state: {  groupMsg: 'groupEditDetail'} } );
}
closeUrl(){
  if(this.refetchData.groupMsg=="relatedGrp" ){
   history.back();
  }
  else{
 if(this.refetchData.tabMsg=="pendingTab" ){
    this.hideButtons = true;
    this.router.navigateByUrl('/tablinks/groups' ,{ state: {  tabMsg: 'groupPendingTab'} } );
  }else if(this.refetchData.postDetailMsg == "editClose" ){
    this.router.navigate(['/tablinks/post'])
  }
  else if(this.refetchData.postDetailMsg == "viewClose"){
    this.router.navigate(['/tablinks/post'])
  }
  else if(this.refetchData.tabMsg=="reccTab" ){
    this.hideButtons = true;
    this.router.navigateByUrl('/tablinks/groups' ,{ state: {  tabMsg: 'reccTab'} } );
  }
  else{
    this.router.navigateByUrl('/tablinks/groups' ,{ state: {  tabMsg: 'groupSubscribeTab'} } );
  }
}

}
async showPublicProfileModal(memberData, type) {
  const popover = await this.modalController.create({
    component: GroupPublicProfilePage,
    cssClass: 'public-profile-modal',
    componentProps: {
      'memberId': memberData,
      "type": type,
      "groupId": this.groupId ,
      onClick: (type) => {
        if(type == 'makeOwner'){
          // this.router.navigate(['/tablinks/groups']);'
          this.router.navigateByUrl('/tablinks/groups' ,{ state: {  tabMsg: 'groupManageTab'} } );
          popover.dismiss();
        }
      }
    }

  });
  popover.onDidDismiss().then((modalDataResponse) => {
    popover.dismiss();
    // if (modalDataResponse.data == 'makeOwner') {
    //   console.log("hiii",modalDataResponse);
    //   this.groupMembersListsCount();
    //   popover.dismiss();

    // }
    // if (modalDataResponse.data == 'remove') {
    //   this.groupMembersListsCount();
    //   popover.dismiss();

    // }
    // if (modalDataResponse.data == 'adminProfile') {
    //   this.groupMembersListsCount();
    //   popover.dismiss();

    // }
    // if (modalDataResponse.data == 'memebrInvite') {
    //   this.groupMembersListsData();
    //   popover.dismiss();

    // }
  });
  await popover.present();
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

