import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute,Params} from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { OverlayPopoverPage } from "../overlay-popover/overlay-popover.page";
import { ModalController } from '@ionic/angular';
import { CreateRoomResponse } from './../../services/type';
import { PublicProfilePage } from '../public-profile/public-profile.page';
import { MdmProfilePage } from '../mdm-profile/mdm-profile.page';
import { AlertController,Platform } from '@ionic/angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { RejectModalPage } from '../reject-modal/reject-modal.page';
import { DisconnectModalPage } from '../disconnect-modal/disconnect-modal.page';
import { CancelConnectionModalPage } from '../cancel-connection-modal/cancel-connection-modal.page';
// import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { ThankyouPageRoutingModule } from '../thankyou/thankyou-routing.module';
import { Keyboard } from '@capacitor/keyboard';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
})
export class ConnectionPage implements OnInit {
  openModal() {
    throw new Error("Method not implemented.");
  }
  dismissModal() {
    throw new Error("Method not implemented.");
  }
  backButtonSubscription
  count: number = 1;
  mdmCount : number = 1;
  countData;
  clickType;
  showPocnUser = false;
   showMdmUser = false;
  connectionTabType = "myNetwork";
  userIp = '';
  public searchData : any[];
  pocnTotalCount;
  mdmTotalCount;
  ApproveConnectionName;
  pocnStatusMessage = false;
  mdmStatusMessage = false;
  showSearch = false;
  showRecSearch = false;
  public mdmConnection: any[];
  defaultImg ="assets/images-pocn/group-default-thumbnail.svg";
  imageUrl = environment.postProfileImgUrl;
  searchText;
  profileImgUrl;
  showDecline: boolean[] = []
  showAccept: boolean[] = []
  showWithdrawAccept: boolean[] = []
  searchText1;
  primarySpecialityDesc;
  primarySpecialityConnection;
  primarySpecialityIncoming;
  primarySpecialityOutgoing;
  deviceType: string = '';
  public myUserDialerData: any[];
  public hcpVerified: number;
  public phoneLinked: number;
  public verificationType: string;
  userId: string;
  providerHcpNpi;
  userName;
  token: string;
  public userRoomData: string;
  public myConnectionData;
  myConnectionMessage: boolean = false;
  public myRequestConnectionData;
  public myPendingConnectionsData;
  connectionPendingRequestMessage: boolean = false;
  connectionRequestMessage: boolean = false;
  public myConnectionRecommendationData;
  connectionRecommendationMessage: boolean = false;
  showSpeciality: boolean = false;
  showLocation: boolean = false;
  public locationCityConnections;
  connectionCityMessage: boolean = false;
  public workHistoryConnections;
  connectionWorkMessage: boolean = false;
  public educationConnections;
  public pocnUserRecommendations;
  workLoaderStatus: boolean = false;
  specialityLoaderStatus: boolean = false;
  searchLoaderStatus:boolean = false;
  incomingReqLoaderStatus: boolean = true;
  outgoingReqLoaderStatus: boolean = true;
  educationLoaderStatus: boolean = false;
  pocnLoaderStatus:boolean = true;
  cityLoaderStatus: boolean = false;
  connectionEducationMessage: boolean = false;
  connectionUserPocnMessage: boolean = false;
  acceptRequest: boolean = false;
  ignoreRequest: boolean = false;
  ignoreConnectionName;
  cancelRequest: boolean = false;
  cancelConnectionName;
  userData;
  memberIdData;
  geolocationPosition: string = '';
  userAgent: string;
  profileImg;
  public connectStatus;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    public alertController: AlertController,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    private platform: Platform,
    public telemetry: TelemetryService,
  ) {
    this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getIpAddress();
    this.route.params.subscribe((params: Params) => {
      if(params.tab && params.tab== 'request'){
        this.connectionTabType = "connectionRequest";
        localStorage.setItem(
          "connectionTabName",
            "connectionRequest"
        );
      }
    });

  }

  ngOnInit() {
    this.getPocnUserRecommendations();
    this.getUserProfile();
    this.getDialerCaller();
    this.getMyConnections();
    this.patientConnectStatusCalls();
    this.loadIp();
    // this.getUserRecommendedConnectionsSpecialties();
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
    this.connectionTabType = (localStorage.getItem('connectionTabName')) ? (localStorage.getItem('connectionTabName')) : 'myNetwork';
    if (this.connectionTabType == "connectionRequest") {
      this.getMyPendingConnections();
      this.getUserRequestedConnections();
      this.dismissNotification();

    }
    if (this.connectionTabType == "recommended") {
      this.getPocnUserRecommendations();
    }
    if (this.isMobile == true) {
      this.deviceType = "Mobile"
    }
    else if (this.isTablet == true) {
      this.deviceType = "Tablet"
    }
    else if (this.isDesktop == true) {
      this.deviceType = "Desktop"
    }
    else {
      this.deviceType = "Unknown"
    }
    this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();
    // this.getPosition();
  }
  ionViewWillEnter (){
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
  //get location
  // getCurrentPosition = async () => {
  //   const coordinates = await Geolocation.getCurrentPosition();
  //   this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
  // };
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
  detectBrowserVersion() {
    let userAgent = navigator.userAgent, tem,
      matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    matchTest = matchTest[2] ? [matchTest[1], matchTest[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }
  connectionRequestClick() {
    // if(this.connectionTabType == "connectionRequest"){
    this.getMyPendingConnections();
    this.getUserRequestedConnections();
    this.dismissNotification();
    // this.getPocnUserRecommendations();
    // }
  }
  connClick() {
    this.getMyConnections();
  }
  getUserProfile() {
    this._pocnService.getUserBasicProfile(this.token)?.subscribe(({ data }) => {
      this.userId = data['getUserBasicProfile'].data['userBasicProfile']['userId'];
      this.providerHcpNpi = data['getUserBasicProfile'].data['userBasicProfile']['npi'];
      this.userName = data['getUserBasicProfile'].data['userBasicProfile']['name'];
    },
      (error) => {
        this.router.navigate(['/'])
      });
  }
  getDialerCaller() {
    this._pocnService.getDialerCaller(this.token)?.subscribe(({ data }) => {
      this.myUserDialerData = data['getDialerCaller'].data;
    })
  }
  patientConnectStatusCalls() {
    this._pocnService.patientConnectStatusCalls(this._pocnLocalStorageManager.getData("userId").toUpperCase()).subscribe(({ data }) => {
      if (data.patientConnectStatusCalls.nodes != '') {
        let setSuccess;
        setSuccess = data.patientConnectStatusCalls.nodes[0];
        this.hcpVerified = setSuccess.hcpVerified;
        this.phoneLinked = setSuccess.phoneLinked;
        this.verificationType = setSuccess.verificationType;
        this.connectStatus = setSuccess.patientConnectRegistrationStatus;

        // if (setSuccess.patientConnectRegistrationStatus == 1) {
        //   if(type == 'audio'){
        //     this.router.navigate(['/dialer'])
        //   }
        //   else{
        //    this.goToVideoCall();
        //   }
        // } else {
        //   // if (setSuccess.hcpVerified == 0 && setSuccess.phoneLinked == 1 && this.myUserDialerData.length > 0 && this.verificationType == 'Manual') {
        //   //   this.router.navigate(['/dialer'])
        //   //   this.presentLoading();
        //   // } else {
        //     this.router.navigateByUrl('/connect', { state: { tabName: 'connection', type: type} });
        //  // }
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
    this.router.navigateByUrl('/connect', { state: { tabName: 'connection', type: type} });  }
}
  goToVideoCall() {
    let createRoom: any;
    createRoom = {
      accessToken: this.token,
      channel: this.userAgent,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      geoLocation: '',
    }
    this._pocnService.createRoom(createRoom).subscribe(
      (response: CreateRoomResponse) => {
        if (response.data.createRoom.updateConnectionResponse.status === 'success') {
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
        this.router.navigateByUrl('/dialer2', { state: { userDataId: response.data.createRoom.updateConnectionResponse.data } });
      });
  }

  //navigate to dialer screen
  async presentLoading() {
    const popover = await this.modalController.create({
      component: OverlayPopoverPage,
      cssClass: 'overlay-modal',
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      this.router.navigate(['/tablinks/my-profile'])
    });
    await popover.present();
  }
  async showPublicProfileModal(connectionData, type) {
    const popover = await this.modalController.create({
      component: PublicProfilePage,
      cssClass: 'public-profile-modal',
      componentProps: {
        'memberId': connectionData,
        "type": type,
      }
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse.data == 'speciality') {
        this.getUserRecommendedConnectionsSpecialties();
        popover.dismiss();

      }
      if (modalDataResponse.data == 'location') {
        this.getLocationCityConnections();
        popover.dismiss();

      }
      if (modalDataResponse.data == 'education') {
        this.getEducationConnections();
        popover.dismiss();

      }
      if (modalDataResponse.data == 'workHistory') {
        this.getWorkHistoryConnections();
        popover.dismiss();

      }

      if (modalDataResponse.data == 'pocnUser') {
        this.getPocnUserRecommendations();
        popover.dismiss();

      }
      if (modalDataResponse.data == 'myConnections') {
        this.getMyConnections();
        popover.dismiss();

      }
      if (modalDataResponse.data == 'outgoingRequest') {
        this.getMyPendingConnections();
        popover.dismiss();

      }
      if (modalDataResponse.data == 'incomingRequest') {
        this.getUserRequestedConnections();
        popover.dismiss();

      }
      this.getMyConnections();
    });
    await popover.present();
  }
  setTab(event) {
    localStorage.setItem(
      "connectionTabName",
      event.target.value
    );
  }
  async showMdmMemberProfile(arg, type) {
    if (arg['userId'] != null) {
      this.showPublicProfileModal(arg, type);
    }
    else {
      const popover = await this.modalController.create({
        component: MdmProfilePage,
        cssClass: 'public-profile-modal',
        componentProps: {
          'memberId': arg,
          'type': type,
          onClick: (type) => {
            if(type == 'search'){
              this.searchClick(this.searchText,this.connectionTabType);
              popover.dismiss();
            }
            if (type == 'speciality' || type == 'location' || type == 'workhistory' || type == 'education' || type == 'workHistory' || type=='pocnUser') {
              //  this.getUserProfile();
              this.getUserRecommendedConnectionsSpecialties();
              this.getPocnUserRecommendations();
              popover.dismiss();
              //  window.location.reload();
            }
            if (type == 'speciality-cancel' || type == 'location-cancel' || type == 'education-cancel' || type == 'workHistory-cancel'  || type=='search-cancel') {
              this.getUserRecommendedConnectionsSpecialties();
              popover.dismiss();
              //  window.location.reload();
            }
            if (type == 'myconnection') {
              this.getMyConnections();
              popover.dismiss();

            }
            if (type == 'outgoingRequest') {
              this.getMyPendingConnections();
              popover.dismiss();

            }
            if (type == 'incomingRequest') {
              this.getUserRequestedConnections();
              popover.dismiss();

            }
            this.getMyConnections();
          },
        },
      });
      await popover.present();
    }
  }
  getMyConnections() {
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getMyConnections(token)?.subscribe(({ data }) => {
      this.myConnectionData = data['getMyConnections']['data'];
      let msgData = data['getMyConnections']['data'];
      this.myConnectionData = JSON.parse(JSON.stringify(data['getMyConnections']['data']));
      // console.log(this.myConnectionData[index].profileImgUrl);
      if (msgData.length == 0) {
        this.myConnectionMessage = true;
      }
      else {
        this.myConnectionMessage = false;
        this.myConnectionData.forEach((field, index) => {
          // field['profileImgUrl'] = "test";
          // this.myConnectionData[index].profileImgUrl = "test";
          // field.profileImgUrl = environment.postProfileImgUrl + field.imageUserId + '.' + field.fileExtension + '?lastmod=' + Math.random();
          this.myConnectionData[index].profileImgUrl = environment.postProfileImgUrl + field.imageUserId + '.' + field.fileExtension + '?lastmod=' + Math.random();
          // console.log(this.myConnectionData[index].profileImgUrl);

        });
      }

    });
  }
  getUserRequestedConnections() {
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getUserRequestedConnections(token)?.subscribe(({ data }) => {
      this.myRequestConnectionData = data['getUserRequestedConnections']['data'];
      if (this.myRequestConnectionData.length == 0) {
        this.connectionRequestMessage = true;
        this.incomingReqLoaderStatus = false;
      }
      else {
        this.connectionRequestMessage = false;
        this.incomingReqLoaderStatus = false;
      }
    });
  }
  getMyPendingConnections() {
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getMyPendingConnections(token)?.subscribe(({ data }) => {
      this.myPendingConnectionsData = data['getMyPendingConnections']['data'];
      if (this.myPendingConnectionsData.length == 0) {
        this.connectionPendingRequestMessage = true;
        this.outgoingReqLoaderStatus = false;
      }
      else {
        this.connectionPendingRequestMessage = false;
        this.outgoingReqLoaderStatus = false;
      }
    });
  }
  getUserRecommendedConnectionsSpecialties() {
    this.specialityLoaderStatus = true;
    const startSet = 0;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getUserRecommendedConnectionsSpecialty(token, startSet)?.subscribe(({ data }) => {
      this.myConnectionRecommendationData = data['getUserRecommendedConnectionsSpecialties1']['data'];
      this.getLocationCityConnections();
      if (this.myConnectionRecommendationData === null || (this.myConnectionRecommendationData != null && this.myConnectionRecommendationData.length == 0)) {
        // if (this.myConnectionRecommendationData.length == 0) {
        this.connectionRecommendationMessage = true;
      }
      else {
        this.connectionRecommendationMessage = false;
        this.showSpeciality = true;
      }
      this.specialityLoaderStatus = false;
    });
  }
  recommendClick() {
    // this.getUserRecommendedConnectionsSpecialties();
    this.getPocnUserRecommendations();
  }
  getLocationCityConnections() {
    this.cityLoaderStatus = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getLocationCityConnections(token)?.subscribe(({ data }) => {
      this.locationCityConnections = data['getUserRecommendedConnectionsCities1']['data'];
      this.getEducationConnections();
      if (this.locationCityConnections === null || (this.locationCityConnections != null && this.locationCityConnections.length == 0)) {
        // if (this.locationCityConnections.length == 0) {
        this.connectionCityMessage = true;
      }
      else {
        this.connectionCityMessage = false;
        this.showLocation = true;
      }
      this.cityLoaderStatus = false;
    });
  }
  getWorkHistoryConnections() {
    this.workLoaderStatus = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getWorkHistoryConnections(token)?.subscribe(({ data }) => {
      this.workHistoryConnections = data['getUserRecommendedConnectionsExperience1']['data'];
      if (this.workHistoryConnections === null || (this.workHistoryConnections != null && this.workHistoryConnections.length == 0)) {
        // if (this.workHistoryConnections.length == 0) {
        this.connectionWorkMessage = false;
      }
      else {
        this.connectionWorkMessage = true;
        // this.itemWorkExpanded = !this.itemWorkExpanded;
      }
      this.workLoaderStatus = false;
    },
    );

  }
  getEducationConnections() {
    this.educationLoaderStatus = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getEducationConnections(token)?.subscribe(({ data }) => {
      this.educationConnections = data['getUserRecommendedConnectionsEducation1']['data'];
      this.getWorkHistoryConnections();
      if (this.educationConnections === null || (this.educationConnections != null && this.educationConnections.length == 0)) {
        // if (this.educationConnections.length == 0) {
        this.connectionEducationMessage = false;
      }
      else {
        this.connectionEducationMessage = true;
        // this.itemEducationExpanded = !this.itemEducationExpanded;
      }
      this.educationLoaderStatus = false;
    });

  }
  submitApproveConnectionRequest(data,i) {
    this.showAccept[i] = true;
    this.ApproveConnectionName = data.destFullName;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    const connectionApproveData = {
      accessToken: token,
      childFullName: data.destFullName,
      childUserId: data.requestorUserId,
      connectionRequestId: data.connectionRequestId,
      parentFullName: this.userName,
      parentUserId: this.userId,
      requestorNpi: this.providerHcpNpi,
      targetNpi: data.targetUserId,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.device.userAgent,
      geoLocation: ''
    }
    this._pocnService.submitApproveConnectionRequest(connectionApproveData).subscribe(
      (response: any) => {
        if (response.data.submitApproveConnectionRequest.connectionUpdateResponse.status === 'Success') {
          this._pocnService.sendApproveConnectionRequestMail(connectionApproveData).subscribe(
            (response: any) => {
            })
          this.showAccept[i] = false;
          const index: number = this.myRequestConnectionData.indexOf(data);
          // this.showApproveAlert();
          const spanName = "accept-connection-request-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              childFullName: data.destFullName,
              parentFullName: this.userName
          }
          const eventName = 'accept connection request';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully accept connection request' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
          this.getUserRequestedConnections();
          this.getMyConnections();
          this.getUserRecommendedConnectionsSpecialties();
          this.acceptRequest = true;
          setTimeout(function () {
            this.acceptRequest = false;
          }.bind(this), 3000);

          if (index !== -1) {
            JSON.parse(JSON.stringify(this.myRequestConnectionData.splice(index, 1)));

          }

        }
        else{
          const spanName = "accept-connection-request-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              childFullName: data.destFullName,
              parentFullName: this.userName
          }
          const eventName = 'accept connection request';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to accept connection request' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
        }
      });
  }
  rejectRequest(requestConnection, type,i) {
    this.showDecline[i] = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    const connectionRejectData = {
      accessToken: token,
      connectionRequestId: requestConnection.connectionRequestId,
      rejectReason: requestConnection.rejectReason ? requestConnection.rejectReason : '',
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6:   this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.device.userAgent,
      geoLocation: ''
    }
    this.showRejectModal(requestConnection, type,i);
  }
  async showRejectModal(requestConnection, type,i) {
    this.ignoreConnectionName = requestConnection.destFullName;
    const popover = await this.modalController.create({
      component: RejectModalPage,
      cssClass: 'reject-modal',
      componentProps: {
        'requestConnection': requestConnection,
        "type": type,
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      this.showDecline[i] = false;
      if (modalDataResponse.data == 'incomingRequest') {
        this.showDecline[i] = false;
        this.ignoreConnectionName = requestConnection.destFullName;
        this.ignoreRequest = true;
        this.getUserRequestedConnections();
        this.getUserRecommendedConnectionsSpecialties();
        setTimeout(function () {
          this.ignoreRequest = false;
        }.bind(this), 3000);
      }

    });
    await popover.present();
  }
  async showDisconnectModal(requestConnection, type) {
    const popover = await this.modalController.create({
      component: DisconnectModalPage,
      cssClass: 'reject-modal',
      componentProps: {
        'requestConnection': requestConnection,
        "type": type,
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse.data == 'myconnection') {
        // this.ignoreRequest = true;
        //      this.getUserRequestedConnections();
        //      this.getUserRecommendedConnectionsSpecialties();
        //      setTimeout(function () {
        //        this.ignoreRequest = false;
        //      }.bind(this), 3000);
      }

    });
    await popover.present();
  }
  async withdrawConnectionRequest(requestConnection, type, i) {
    this.showWithdrawAccept[i] = true;
    this.cancelConnectionName = requestConnection.destFullName;
    const popover = await this.modalController.create({
      component: CancelConnectionModalPage,
      cssClass: 'reject-modal',
      componentProps: {
        'requestConnection': requestConnection,
        "type": type,
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      this.showWithdrawAccept[i] = false;
      if (modalDataResponse.data == 'outgoingRequest') {
        this.showWithdrawAccept[i] = false;
        this.getMyPendingConnections();
        this.getUserRecommendedConnectionsSpecialties();
        // this.person = JSON.parse(JSON.stringify(data['getUserFullProfile'].data));
        this.cancelConnectionName = requestConnection.destFullName;
        this.cancelRequest = true;
        setTimeout(function () {
          this.cancelRequest = false;
        }.bind(this), 3000);
        // this.showRecommendedConnectionRejectAlert();

      }

    });
    await popover.present();
  }

  getPocnUserRecommendations(){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      this._pocnService.getPocnUserRecommendations(token)?.subscribe(({ data }) => {
        this.getUserRecommendedConnectionsSpecialties();
        this.pocnUserRecommendations = data['getPocnUserRecommendations']['data'];
        if (this.pocnUserRecommendations === null || (this.pocnUserRecommendations != null && this.pocnUserRecommendations.length == 0 )){
        // if (this.educationConnections.length == 0) {
          this.connectionUserPocnMessage = true;
        }
        else {
          this.connectionUserPocnMessage = false;
          // this.itemEducationExpanded = !this.itemEducationExpanded;
        }
        this.pocnLoaderStatus = false;
      });

  }
  async basicProfileClick(connectionData, type) {
    // let connectionRequestData;
    if (type == "outgoingRequest") {
      this._pocnService.providerUserInfos(connectionData['targetUserId']).subscribe(({ data }) => {
        this.userData = data['providerUserInfos']['nodes'];
        if (this.userData != '' || this.userData.length != 0) {
          // this.router.navigate(["/user/" + this.userData[0].userId]);
          this.memberIdData = this.userData[0].userId;
          this.showPublicProfileModal(connectionData, type);

        }
        else {
          this._pocnService.providerMdmInfos(Number(connectionData['targetUserId'])).subscribe(({ data }) => {
            this.userData = data['providerInfos']['nodes'];
            if (this.userData.length != 0) {
              // this.router.navigate(["/profile/" + this.userData[0].providerId ]);
              // this.memberIdData  = this.userData[0].providerId;
              this.showMdmMemberProfile(this.userData[0], type);
            }
          })

        }
        // this.getUserPrivilegeSections();

      });
    }
    // if(type=='myConnections'){
    else {
      this.showPublicProfileModal(connectionData, type);
      // const popover = await this.modalController.create({
      //   component: PublicProfilePage,
      //   cssClass: 'public-profile-modal',
      //   componentProps: {
      //     'memberId': connectionData,
      //     "type" : type
      //   },
      // });
      // popover.onDidDismiss().then((modalDataResponse) => {
      //   console.log("hiiii");
      //   console.log(modalDataResponse);
      // });
      // await popover.present();
    }
  }

  searchClick(searchText,type) {
    //console.log(type);
    //Keyboard.hide();
    this.showMdmUser = false;
    this.showPocnUser = false;
    this.searchLoaderStatus = true;
    // this.pocnStatusMessage = false;
    this.searchText = searchText;
    const pageNumber = 1;
    const itemsPerPage = 10;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    // if(searchText.length >= 3 ){
      if(type=='myNetwork'){
        this.showSearch = true;
        this.showRecSearch = false;
      }
      if(type=='recommended'){
        this.showRecSearch = true;
        this.showSearch = false;
      }

    this._pocnService.getRegisteredUsersConnection(token,searchText,pageNumber,itemsPerPage).subscribe(({ data }) => {
      this.searchData = data['getRegisteredUsersConnection']['appConnection'];
      const spanName = "serach-registerd-user-connection-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              searchText:this.searchText
          }
          const eventName = 'serach registerd user connection';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully search registered user' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
      // this.pocnTotalCount = data['getRegisteredUsersConnection']['totalCount'];
      this.getMdmUsersConnection(searchText);
      if (this.searchData == null || this.searchData.length === 0 ) {
        this.pocnStatusMessage = true;

      }
      else{
        this.pocnStatusMessage = false;
       }
    });
  // }
  }
  backClose(type){
  if(type == 'network'){
    if(this.count ==1 && this.mdmCount ==1 && this.clickType===undefined){
      this.showSearch = false;
      this.showRecSearch = false;
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
   else{
    if(this.count ==1 && this.mdmCount ==1 && this.clickType===undefined){
      this.showRecSearch = false;
      this.showSearch = false;
    }
    if(this.mdmCount ==0 && this.clickType == 'mdm'){
      this.showMdmUser = false;
      this.showRecSearch = false;
    }
    if(this.count ==0 && this.clickType == 'pocn'){
      this.showPocnUser = false;
      this.showRecSearch = false;
    }
   if(this.mdmCount !=0 && this.clickType == 'mdm'){
    this.moreMdmBackClick(this.clickType,type)
   }
   if(this.count !=0 && this.clickType == 'pocn'){
    this.moreBackClick(this.clickType,type)
   }
   }
  }
  getMdmUsersConnection(searchText) {
    this.searchLoaderStatus = true;
    this.pocnStatusMessage = false;
    this.searchText = searchText;
    this.showSearch = true;
    const pageNumber = 1;
    const itemsPerPage = 10;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getMdmUsersConnection(token, searchText, pageNumber, itemsPerPage).subscribe(({ data }) => {
     this.mdmConnection = data['getMdmUsersConnection']['mdmConnection'];
    //  this.mdmTotalCount = data['getMdmUsersConnection']['totalCount'];
      this.searchLoaderStatus = false;
      const spanName = "serach-mdm-user-connection-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              searchText:this.searchText
          }
          const eventName = 'serach mdm user connection';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully search mdm user' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
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
    this._pocnService.getRegisteredUsersConnection(token, this.searchText, pageNumber, itemsPerPage).subscribe(({ data }) => {
      this.searchData = data['getRegisteredUsersConnection']['appConnection'];
      this.searchLoaderStatus = false;
      if (this.searchData == null || this.searchData.length === 0) {
        this.pocnStatusMessage = true;

      }
      else {
        this.pocnStatusMessage = false;
      }
    });
  }
  moreBackClick(type,tab): void {
    this.clickType = type;
    // this.showPocnUser = true;
    this.showMdmUser = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this.searchLoaderStatus = true;
    this.pocnStatusMessage = false;
    if(tab == 'network'){
      this.showSearch = true;
      this.showRecSearch = false;
    }
    else{
      this.showRecSearch = true
      this.showSearch = false;
    }
    const pageNumber = --this.count;
    // this.countData = pageNumber;
    // console.log(pageNumber);
    const itemsPerPage = 10;
    this._pocnService.getRegisteredUsersConnection(token, this.searchText, pageNumber, itemsPerPage).subscribe(({ data }) => {
      this.searchData = data['getRegisteredUsersConnection']['appConnection'];
      this.searchLoaderStatus = false;
      if (this.searchData == null || this.searchData.length === 0) {
        this.pocnStatusMessage = true;

      }
      if(this.searchData != null || this.searchData.length != 0) {
        this.pocnStatusMessage = false;
      }
      if(this.count ==0 && tab == 'network'){
        this.showSearch = false;
      }
      if(this.count ==0 && tab == 'recomand'){
        this.showRecSearch = false;
      }
    });
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
    this._pocnService.getMdmUsersConnection(token, this.searchText, pageNumber, itemsPerPage).subscribe(({ data }) => {
     this.mdmConnection = data['getMdmUsersConnection']['mdmConnection'];
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
  moreMdmBackClick(type,tab): void {
    this.clickType = type;
    this.showPocnUser = true;
    // this.showMdmUser = true;
    this.searchLoaderStatus = true;
    this.pocnStatusMessage = false;
    this.searchText = this.searchText;
    if(tab == 'network'){
      this.showSearch = true;
      this.showRecSearch = false;
    }
    else{
      this.showRecSearch = true
      this.showSearch = false;
    }
    const pageNumber = --this.mdmCount;
    const itemsPerPage = 10;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getMdmUsersConnection(token, this.searchText, pageNumber, itemsPerPage).subscribe(({ data }) => {
     this.mdmConnection = data['getMdmUsersConnection']['mdmConnection'];
      this.searchLoaderStatus = false;
      if (this.mdmConnection == null || this.mdmConnection.length === 0) {
        this.mdmStatusMessage = true;
        // this.showSearch = true;
      }
      if(this.mdmConnection != null || this.mdmConnection.length != 0) {
        this.mdmStatusMessage = false;
      }
      if(this.mdmCount ==0 && tab == 'network'){
        this.showSearch = false;
        this.showRecSearch = false;
      }
      if(this.mdmCount ==0 && tab == 'recomand'){
        this.showRecSearch = false;
        this.showSearch = false;
      }
    });
  }
  ionViewDidEnter() {
    this.connectionTabType = (localStorage.getItem('connectionTabName')) ? (localStorage.getItem('connectionTabName')) : 'myNetwork';
    if (this.connectionTabType == "connectionRequest") {
      this.getMyPendingConnections();
      this.getUserRequestedConnections();

    }
    if (this.connectionTabType == "myNetwork") {
      this.getMyConnections();

    }
    if (this.connectionTabType == "recommended") {
      this.getPocnUserRecommendations();
    }
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
    });
  }
  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }
  close(){
    this.showSearch = false;
   this.showRecSearch = false;
  }
  closeSearch(){
    this.showRecSearch = false;
    this.showSearch = false;
  }
  onImgError(event){
    // if(extension['fileExtension'] == '' || extension['fileExtension'] == 'null'){
      event.target.src = 'assets/images-pocn/group-default-thumbnail.svg'
    // }

   //Do other stuff with the event.target
   }
   dismissNotification(){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.updateMyConnectionsRequestNotification(token).subscribe(({ data }) => {
      // this.showNotification = false;
      // this.showConNotification = false;
    })
  }
}
