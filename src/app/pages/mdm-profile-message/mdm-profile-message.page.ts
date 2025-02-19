import { Component, OnInit, Input } from '@angular/core';
import {  ModalController } from '@ionic/angular';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { TokenManager } from "./../../services/token-manager";
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { TelemetryService } from 'src/app/services/telemetry.service';
//import { Geolocation } from '@capacitor/geolocation';
@Component({
  selector: 'app-mdm-profile-message',
  templateUrl: './mdm-profile-message.page.html',
  styleUrls: ['./mdm-profile-message.page.scss'],
})
export class MdmProfileMessagePage implements OnInit {
  @Input() memberDetails: any;
  @Input() emailInput: any;
  @Input() mdmProfileBasicInfo: any;
  @Input() type:string;
  public recEmailId;
  userIp = '';
  deviceType: string = '';
  public emailInputInvite;
  userData;
  userId;
  providerHcpNpi;
  userName;
  public token: string;
  public message = {
    msgText: '',
  }
  messageAccept: boolean = false;
  messageFailed: boolean = false;
  geolocationPosition: string = '';
  constructor(        
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    private tokenManager: TokenManager,
    private router: Router,
    public loading: LoadingService, 
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    public telemetry: TelemetryService,
    ) {
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "mdm-profile-message-popover";
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
    if(this.token == "" || this.token == null){
      this.router.navigate(["/"]);
    }
    //this.getPosition();
    this.getUserDetails();
    this.loadIp();
    this.tokenManager.setRefreshTokenIntrvl();
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

  // getPosition(): any {
  //   Geolocation.getCurrentPosition().then(coordinates => {
  //     this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
  //   }).catch((error) => {
  //     this.geolocationPosition = "";
  //     console.log('Error getting location', error);
  //   });
  // }
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
  async close() {
    await this.modalController.dismiss();
  }
  backClose(){
    this.modalController.dismiss();
  }
  getUserDetails() {
    this._pocnService.getUserBasicProfile(this.token)?.subscribe(({ data }) => {
      this.userId = data['getUserBasicProfile'].data['userBasicProfile']['userId'];
      this.providerHcpNpi = data['getUserBasicProfile'].data['userBasicProfile']['npi'];
      this.userName = data['getUserBasicProfile'].data['userBasicProfile']['name'];
    },
    (error) => {
      this.router.navigate(['/'])
    });
  }

  submitConnectionRecommendations() {
    
    this.loading.present();
    let connectionRecData = this.memberDetails;
    let connectionData;
    // return false;
    if(this.type=='search'){
      connectionData = {
        accessToken: this.token,
        targetUserId: connectionRecData['npi'],
        targetUserFullName: connectionRecData['fullName'],
        targetUserFirstName: this.mdmProfileBasicInfo['firstName'],
        targetUserLastName: this.mdmProfileBasicInfo['lastName'],
        targetUserEmailId: this.emailInput,
        statusUpdateDate: "",
        source: "POCN Recommendation",
        requestorUserId: this.userId,
        requestorUserFullName: this.userName,
        rejectReason: "",
        requestorNpi:this.providerHcpNpi,
        connectionStatus: "Pending",
        connectionMessage: this.message.msgText,
        agingDays: "0",
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        channel: this.device.userAgent,
        geoLocation: this.geolocationPosition,
        targetHcpDegreeCode: "",
        targetHcpDegreeGroupCode: this.mdmProfileBasicInfo['degreeGroupCode'],
        targetPrimarySpecialtyName: this.mdmProfileBasicInfo['primarySpecialityDesc'],
        targetUserCity: this.memberDetails['hcpLocality'],
        targetUserState: this.memberDetails['state'],
        domain: window.location.hostname,
      }
    }
    else{
      connectionData = {
        accessToken: this.token,
        targetUserId: connectionRecData?.['npi'],
        targetUserFullName: connectionRecData?.['fullName'],
        targetUserFirstName: this.mdmProfileBasicInfo?.['firstName'],
        targetUserLastName: this.mdmProfileBasicInfo?.['lastName'],
        targetUserEmailId: this.emailInput,
        statusUpdateDate: "",
        source: "POCN Recommendation",
        requestorUserId: this.userId,
        requestorUserFullName: this.userName,
        rejectReason: "",
        requestorNpi:this.providerHcpNpi,
        connectionStatus: "Pending",
        connectionMessage: this.message.msgText,
        agingDays: "0",
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
        ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        channel: this.device.userAgent,
        geoLocation: this.geolocationPosition,
        targetHcpDegreeCode: "",
        targetHcpDegreeGroupCode: this.mdmProfileBasicInfo?.['degreeGroupCode'],
        targetPrimarySpecialtyName: this.mdmProfileBasicInfo?.['primarySpecialityDesc'],
        targetUserCity: this.memberDetails?.['hcpLocality'],
        targetUserState: this.memberDetails?.['hcpState'],
        domain: window.location.hostname,
      }
    }
   
    this._pocnService.submitUserConnectionRequest(connectionData).subscribe(
      (response: any) => {
        if (response.data.submitUserConnectionRequest?.connectionUpdateResponse.status === 'Success') {
          //this.close();
          this._pocnService.sendConnectionRequestMail(connectionData).subscribe(
            (response: any) => {
              console.log("mail send succsfully");
            })
          this.messageAccept = true;
          setTimeout(function () {
            this.messageAccept = false;
            this.modalController.dismiss(this.type);
          }.bind(this), 3000);
          if(this.loading.isLoading){
            this.loading.dismiss();
          }
          const spanName = "connection-request-sent-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              targetUserFullName: connectionRecData['fullName'],
              requestorUserFullName: this.userName,
          }
          console.log(attributes);
          const eventName = 'connection request sent';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully accept connection request' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
          //show success msg
        }
        else{
          this.messageFailed = true;
          setTimeout(function () {
            this.messageFailed = false;
          }.bind(this), 3000);
          if(this.loading.isLoading){
            this.loading.dismiss();
          }
          const spanName = "connection-request-sent-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              targetUserFullName: connectionRecData['fullName'],
              requestorUserFullName: this.userName,
          }
          console.log(attributes);
          const eventName = 'mdm user connection request sent';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to accept connection request' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
        }
      });
  }
  providerUserInfos(){
    this._pocnService.providerMdmUserInfos(Number(this.memberDetails?.['providerId'])).subscribe(({ data }) => {
    this.userData = data['providerInfos']['nodes'][0];
    })
  }
}
