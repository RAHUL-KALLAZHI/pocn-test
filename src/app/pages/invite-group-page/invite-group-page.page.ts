import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { PublicProfilePage } from '../public-profile/public-profile.page';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { environment } from 'src/environments/environment';
import { MdmGroupsProfilePage } from '../mdm-groups-profile/mdm-groups-profile.page';
import { GroupPublicProfilePage } from '../group-public-profile/group-public-profile.page';
import { IonContent } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-invite-group-page',
  templateUrl: './invite-group-page.page.html',
  styleUrls: ['./invite-group-page.page.scss'],
})
export class InviteGroupPagePage implements OnInit {
  @Input() groupId: string;
  userData: any[] = [];
  defaultImg ="assets/images-pocn/group-default-thumbnail.svg";
  eventUserId: any[] = [];
  searchText: string = '';
  public searchData : any[];
  pocnStatusMessage = false;
  searchLoaderStatus:boolean = false;
  showSearch = false;
  public mdmConnection: any[];
  mdmStatusMessage = false;
  showMdmUser = false;
  showPocnUser = false;
  clickType;
  count: number = 1;
countData;
imageUrl = environment.postProfileImgUrl;
mdmCount : number = 1;
@ViewChild(IonContent) content: IonContent;
  constructor(
    private router:Router,
    private modalController: ModalController,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public telemetry: TelemetryService,
    ) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "invite-group-popover";
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
    this.providerUserInfos();
  }
  async close() {
    await this.modalController.dismiss();
  }
  providerUserInfos(){
    this._pocnService.pocnUserListInfos().subscribe(({ data }) => {
     this.userData = data['providerUserInfos']['nodes'];
      console.log(this.userData)
    });
  }
  async basicProfileClick(userId){
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
  setCheck(event: Event) {
    // this.eventUserId = event;
     this.eventUserId.push(event);

     console.log(this.eventUserId);

   }
   searchUserData(searchText){
    console.log('hi')
    this.searchText = searchText;
    this.showMdmUser = false;
    this.showPocnUser = false;
    this.searchLoaderStatus = true;
    const pageNumber = 1;
    const itemsPerPage = 10;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getRegisteredUsersGroup(token,searchText,pageNumber,itemsPerPage,this.groupId).subscribe(({ data }) => {
      this.searchData = data['getRegisteredUsersGroup']['appConnection'];
      const spanName = "invite-registerd-user-group-btn";
      let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          searchText:this.searchText 
      }
      console.log(attributes);
      const eventName = 'invite registerd user group';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully invite registerd user in group' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
      console.log(this.searchData);
      this.getMdmUsersGroup(searchText);
      if (this.searchData == null || this.searchData.length === 0 ) {
        this.pocnStatusMessage = true;

      }
      else{
        this.showSearch = true;
        this.pocnStatusMessage = false;
       }
    });
  }
  getMdmUsersGroup(searchText) {
    console.log(searchText)
    this.searchLoaderStatus = true;
    this.pocnStatusMessage = false;
    this.searchText = searchText;
    this.showSearch = true;
    const pageNumber = 1;
    const itemsPerPage = 10;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getMdmUsersGroup(token, searchText, pageNumber, itemsPerPage,this.groupId).subscribe(({ data }) => {
      console.log(data)
     this.mdmConnection = data['getMdmUsersGroup']['mdmConnection'];
    //  this.mdmTotalCount = data['getMdmUsersConnection']['totalCount'];
    const spanName = "invite-mdm-user-group-btn";
      let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          searchText:this.searchText 
      }
      console.log(attributes);
      const eventName = 'invite mdm user group';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully invite mdm user in group' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
      this.searchLoaderStatus = false;
      if (this.mdmConnection == null || this.mdmConnection.length === 0) {
        this.mdmStatusMessage = true;
        // this.showSearch = true;
      }
      else {
        this.mdmStatusMessage = false;
      }
    });
  }
  moreClick(type): void {
    this.clickType = type;
    // this.showPocnUser = true;
    this.showMdmUser = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this.searchLoaderStatus = true;
    this.pocnStatusMessage = false;
    this.showSearch = true;
    const pageNumber = ++this.count;
    this.countData = pageNumber;
    const itemsPerPage = 10;
    this._pocnService.getRegisteredUsersGroup(token, this.searchText, pageNumber, itemsPerPage,this.groupId).subscribe(({ data }) => {
      this.searchData = data['getRegisteredUsersGroup']['appConnection'];
      this.searchLoaderStatus = false;
      if (this.searchData == null || this.searchData.length === 0) {
        this.pocnStatusMessage = true;

      }
      else {
        this.pocnStatusMessage = false;
      }
    });
  }
  async showMdmMemberProfile(arg, type) {
    if (arg['userId'] != null) {
     // this.showPublicProfileModal(arg, type);
    }
    else {
      const popover = await this.modalController.create({
        component: MdmGroupsProfilePage,
        cssClass: 'public-profile-modal',
        componentProps: {
          'memberId': arg,
          "type": type,
          "groupId": this.groupId ,
        }
        //   onClick: (type) => {
        //     if(type == 'search'){
        //       this.searchClick(this.searchText,this.connectionTabType);
        //       popover.dismiss();
        //     }
        
      });
      popover.onDidDismiss().then((modalDataResponse) => {
        console.log("hiii", modalDataResponse.data );
        if( modalDataResponse.data == 'search'){
          console.log("hiiiifff");
          console.log(this.searchText);
          this.searchUserData(this.searchText);
        }

      });
      await popover.present();
   }
  }
 
  moreMdmClick(type): void {
    this.clickType = type;
    this.showPocnUser = true;
    // this.showMdmUser = true;
    this.searchLoaderStatus = true;
    this.pocnStatusMessage = false;
    this.searchText = this.searchText;
    this.showSearch = true;
    const pageNumber = ++this.mdmCount;
    this.countData = pageNumber;
    const itemsPerPage = 10;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getMdmUsersGroup(token, this.searchText, pageNumber, itemsPerPage,this.groupId).subscribe(({ data }) => {
     console.log(data)
      this.mdmConnection = data['getMdmUsersGroup']['mdmConnection'];
      this.searchLoaderStatus = false;
      if (this.mdmConnection == null || this.mdmConnection.length === 0) {
        this.mdmStatusMessage = true;
        // this.showSearch = true;
      }
      else {
        this.mdmStatusMessage = false;
      }
    });
  }
  shareGroupPost(){

  }
  async showPublicProfileModal(memberData, type) {
    const popover = await this.modalController.create({
      component: GroupPublicProfilePage,
      cssClass: 'public-profile-modal',
      componentProps: {
        'memberId': memberData,
        "type": type,
        "groupId": this.groupId ,
      }
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if( modalDataResponse.data == 'inviteGrp'){
        console.log("hiiiifff");
        console.log(this.searchText);
        this.searchUserData(this.searchText);
      }
    });
    await popover.present();
  }
  backClose(type){
    console.log(type);
  // if(type == 'network'){
    if(this.count ==1 && this.mdmCount ==1 && this.clickType===undefined){
      this.showSearch = false;
      // this.showRecSearch = false;
    }
    if(this.mdmCount ==0 && this.clickType == 'mdm'){
      this.showMdmUser = false;
      this.showSearch = false;
    }
    if(this.count ==0 && this.clickType == 'pocn'){
      this.showPocnUser = false;
      this.showSearch = false;
    }
   if(this.mdmCount !=0 && this.clickType == 'mdm'){
    this.moreMdmBackClick(this.clickType,type)
   }
   if(this.count !=0 && this.clickType == 'pocn'){
    this.moreBackClick(this.clickType,type)
   }
  }
  moreBackClick(type,tab): void {
    this.clickType = type;
    // this.showPocnUser = true;
    this.showMdmUser = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this.searchLoaderStatus = true;
    this.pocnStatusMessage = false;
    // if(tab == 'network'){
    //   this.showSearch = true;
    //   // this.showRecSearch = false;
    // }
    // else{
    //   // this.showRecSearch = true
    //   this.showSearch = false;
    // }
    const pageNumber = --this.count;
    // this.countData = pageNumber;
    // console.log(pageNumber);
    const itemsPerPage = 10;
    this._pocnService.getRegisteredUsersGroup(token,this.searchText,pageNumber,itemsPerPage,this.groupId).subscribe(({ data }) => {
      this.searchData = data['getRegisteredUsersGroup']['appConnection'];
      this.searchLoaderStatus = false;
      if (this.searchData == null || this.searchData.length === 0) {
        this.pocnStatusMessage = true;

      }
      if(this.searchData != null || this.searchData.length != 0) {
        this.pocnStatusMessage = false;
      }
      // if(this.count ==0 && tab == 'network'){
      //   this.showSearch = false;
      // }
      if(this.count ==0){
        this.showSearch = false;
        this.showPocnUser = false;
        this.showMdmUser = false;
      }
    });
  }
  moreMdmBackClick(type,tab): void {
    this.clickType = type;
    this.showPocnUser = true;
    // this.showMdmUser = true;
    this.searchLoaderStatus = true;
    this.pocnStatusMessage = false;
    this.searchText = this.searchText;
    const pageNumber = --this.mdmCount;
    const itemsPerPage = 10;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getMdmUsersGroup(token, this.searchText, pageNumber, itemsPerPage,this.groupId).subscribe(({ data }) => {
     this.mdmConnection = data['getMdmUsersGroup']['mdmConnection'];
      this.searchLoaderStatus = false;
      if (this.mdmConnection == null || this.mdmConnection.length === 0) {
        this.mdmStatusMessage = true;
        this.showSearch = true;
      }
      if(this.mdmConnection != null || this.mdmConnection.length != 0) {
        this.mdmStatusMessage = false;
      }
      // if(this.mdmCount ==0 && tab == 'network'){
      //   this.showSearch = false;
      //   this.showRecSearch = false;
      // }
      if(this.mdmCount ==0){
        // this.showRecSearch = false;
        console.log("hiiii234");
        // this.showSearch = false;
        this.showPocnUser = false;
        // this.showMdmUser = false;
      }
    });
  }
  onImgError(event,fileName = '', extension = ''){
//     if(fileName !='' && fileName != null && extension!='' &&  extension!=null){
//      event.target.src = environment.grpImgUrl + fileName +'.' +extension;
//     }
//  else{
   event.target.src = 'assets/images-pocn/group-default-thumbnail.svg'
//  }
}
}
