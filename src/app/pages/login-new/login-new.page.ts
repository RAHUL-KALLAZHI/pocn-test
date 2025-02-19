import { Component, OnInit, Inject,ViewChild,ElementRef } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController , IonInput, IonSelect} from '@ionic/angular';
import { ModalController, Platform } from '@ionic/angular';
import { RegisterModalPage } from '../register-modal/register-modal.page';
import { StateNode, LeadSourceNode, ProvderInfoNode, Person } from './../../services/type'
import { GraphqlDataService } from './../../services/graphql-data.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { DeviceDetectorService } from 'ngx-device-detector';
import { IonContent } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
//import { Geolocation } from '@capacitor/geolocation';
@Component({
  selector: 'app-login-new',
  templateUrl: './login-new.page.html',
  styleUrls: ['./login-new.page.scss'],
})
export class LoginNewPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  @ViewChild('lastNameInput', {static: false}) lastNameData!: IonInput;
  @ViewChild('cityInput', {static: false}) cityData!: IonInput;
  @ViewChild('stateInput', {static: false}) stateData!: IonSelect;
  @ViewChild('emailInput', {static: false}) emailData!: IonInput;
  @ViewChild('passwordInput', {static: false}) passwordData!: IonInput;
  @ViewChild('confirmPasswordInput', {static: false}) confirmPasswordData!: IonInput;
  @ViewChild('loginPasswordInput', {static: false}) loginPasswordData!: IonInput;

  stateListTemp: any;
  yearListTemp: any;
  leadListTemp: any;
  backButtonSubscription
  deviceInfo = null;
  providerTypes: any = [];
  lookupState: string = '';
  lookupProvider: string = '';
  lookupCity: string = '';
  npiResults: ProvderInfoNode[] = [];
  setLoader: boolean = false;
  setSuccess: boolean = false;
  yearGraduated: number[] = [];
  // yearGraduatedTemp ={
  //   id:'',
  //   val:''
  // };

  public yearGraduatedTemp: any[] = [];
  leadSources: LeadSourceNode[] = [];
  stateList: StateNode[] = [];
  setSignUpLoader: boolean = false;
  showRegisterForm: boolean = false;
  showLoginError: boolean = false;
  stateNgValue = "";
  promoCodeShow = "";
  promoCodeLabel = "";
  selectWrapper;
  selectOptions;
  npRadio: boolean = true;
  paRadio: boolean = false;
  person: Person = {
    firstName: '',
    lastName: '',
    email: '',
    state: '',
    city: '',
    provideType: '',
    npi: '',
    year: '',
    leadSource: '',
    promoCode: '',
    password: '',
    confirmPassword: ''
  };
  public loginInputs = {
    username: '',
    password: ''
  }
  loading: any;
  lookupShow = true;
  lookupFirstShow = true;
  lookupDataShow = false;
  isReadonly = false;
  userIp: string = '';
  deviceType: string = '';
  utmSource: any;
  utmMedium: any;
  showDiv: boolean = true;
  showPattern: boolean = true;
  passwordsMatching: boolean = false;
  showFirstname: boolean = false;
  showLastname: boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  regPasswordType: string = 'password';
  regPasswordIcon: string = 'eye-off';
  confirmPasswordType: string = 'password';
  confirmPasswordIcon: string = 'eye-off';
  geolocationPosition: string = '';
  token: string = '';
  noSpacesRegex = /.*\S.*/;
  utmProgram: any;
  getNpiUrl: any;
  constructor(
    private router: Router,
    public loadingController: LoadingController,
    public modalController: ModalController,
    private _pocnService: GraphqlDataService,
    private httpClient: HttpClient,
    private pocnLocalStorageManager: LocalStorageManager,
    private deviceService: DeviceDetectorService,
    private platform: Platform,
    public telemetry: TelemetryService,
    private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document,
  ) { }

  ngOnInit() {
    this.token = this.pocnLocalStorageManager.getData("pocnApiAccessToken");
    let userId = this.pocnLocalStorageManager.getData("userId");
    if (this.token != '' && this.token != null && userId!=null && userId!='') {
      this.router.navigate(["/tablinks/post"], { replaceUrl: true });
    }
    //this.getPosition();
    //this.getStates();
    //this.getIpAddress();
  }

  checkDevice(){
    if(this.isMobile == true){
      this.deviceType = "Mobile"
      return
    }
    else if(this.isTablet == true){
      this.deviceType = "Tablet"
      return
    }
    else if(this.isDesktop == true){
      this.deviceType = "Desktop"
      return
    }
    else{
      this.deviceType = "Unknown"
      return
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
  

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  hideShowRegisterPassword() {
    this.regPasswordType = this.regPasswordType === 'text' ? 'password' : 'text';
    this.regPasswordIcon = this.regPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  hideShowConfirmPassword() {
    this.confirmPasswordType = this.confirmPasswordType === 'text' ? 'password' : 'text';
    this.confirmPasswordIcon = this.confirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  getAuthentication = () => {
    this.checkDevice()
    if(this.loginInputs.password!= "" && this.loginInputs.username!=""){
      this.setLoader = true;
      const mutate = {
        password: this.loginInputs.password.trim(),
        username: this.loginInputs.username.trim(),
        ipAddressV4: this.pocnLocalStorageManager.getData("ipv4"),   
        ipAddressV6: this.pocnLocalStorageManager.getData("ipv6"),  
        device: this.deviceType,
        channel: this.device.userAgent,
        deviceLocation: this.geolocationPosition
      };
      this._pocnService.establishLoginSession(mutate).subscribe(
        (response: any) => {
          if(response.data.pocnIamEstablishSession.establishSessionResult.status == "Success"){
          this.showLoginError = false;
          this.pocnLocalStorageManager.saveData(
            "pocnApiAccessToken",
            response.data.pocnIamEstablishSession.establishSessionResult.data
              .jwToken,
          );
          this.pocnLocalStorageManager.saveData(
            "refreshToken",
            response.data.pocnIamEstablishSession.establishSessionResult.data
              .refreshToken,
          );
          this.pocnLocalStorageManager.saveData(
            "userEmail",
            response.data.pocnIamEstablishSession.establishSessionResult.data.userProfile.email,
          );
          this.pocnLocalStorageManager.saveData(
            "firstName",
            response.data.pocnIamEstablishSession.establishSessionResult.data.userProfile.firstName,
          );
          this.pocnLocalStorageManager.saveData(
            "lastName",
            response.data.pocnIamEstablishSession.establishSessionResult.data.userProfile.lastName,
          );
          this.pocnLocalStorageManager.saveData(
            "userId",
            response.data.pocnIamEstablishSession.establishSessionResult.data.userProfile.userId,
          );
          //this.router.navigate(["/tablinks/post"]);
          
          //this.router.navigate(["/tablinks/my-profile"]);

         // this.router.navigate(["/tablinks/my-profile"], { replaceUrl: true });
          this.router.navigate(["/tablinks/post"], { replaceUrl: true });

          const spanName = "login-submit-btn";
          let attributes = {
              userId: this.pocnLocalStorageManager.getData("userId"),
              firstName: this.pocnLocalStorageManager.getData("firstName"),
              lastName: this.pocnLocalStorageManager.getData("lastName"),
              userEmail:this.pocnLocalStorageManager.getData("userEmail"),
              status:'Success'
          }
          const eventName = 'user login';
          const event =  { 'userEmail': this.pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully logged in' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })

          }
          else if(response.data.pocnIamEstablishSession.establishSessionResult.status == "Error"){
            this.showLoginError = true;
            const spanName = "login-submit-btn";
            let attributes = {
                userName:this.loginInputs.username,
                reason:response.data.pocnIamEstablishSession.establishSessionResult.message,
                status:'Failed'
            }
            const eventName = 'user login';
            const event =  { 'userEmail': this.loginInputs.username.trim(), 'status': 'Error', 'message': 'Failed login' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
            //this.router.navigate(["/login-error"]);
          }
          this.setLoader = false;
        },
      );
    }
    else{
      //show error mesag
    }
  };

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
  urlParams() {
    if (this.route.snapshot.queryParams['utm_source']) {
      this.utmSource = this.route.snapshot.queryParams['utm_source'];
    } else {
      this.utmSource = '';
    }
    if (this.route.snapshot.queryParams['utm_medium']) {
      this.utmMedium = this.route.snapshot.queryParams['utm_medium'];
    } else {
      this.utmMedium = '';
    }
    if (this.route.snapshot.queryParams['utm_program']) {
      this.utmProgram = this.route.snapshot.queryParams['utm_program'];
    } else {
      this.utmProgram = 'Registration';
    }
    if (this.route.snapshot.queryParams['npi']) {
      this.getNpiUrl = this.route.snapshot.queryParams['npi'];
      this._pocnService.getProviderInfoNpi(this.getNpiUrl).subscribe(({ data }) => {
        let npiData =  data.providerInfos.nodes;
        npiData.forEach((ed, index) => {
          if(ed['hcpDegreeGroupCode'].includes('PA') || ed['hcpDegreeGroupCode'].includes('NP')){
            npiData = data.providerInfos.nodes;
            this.person.firstName = npiData[0].firstName;
            this.person.lastName = npiData[0].lastName;
            this.person.state = npiData[0].hcpState;
            this.person.npi = npiData[0].npi;
            this.person.city = npiData[0].hcpLocality;
            this.person.provideType = npiData[0].hcpDegreeGroupCode;
            let stateTemp =  this.stateList.filter((obj) => {
              return obj.statevalue === npiData[0].hcpState;
            });
            if(stateTemp.length>0){
              this.stateListTemp = {id: stateTemp[0].id,statename: stateTemp[0].statename, statevalue: stateTemp[0].statevalue};
            }
            else{
              this.stateListTemp = {id: '',statename: '', statevalue: ''};
            }
            if (this.person.provideType == 'NP/CNS') {
              this.npRadio = true;
              this.paRadio = false;
            }
            else if (this.person.provideType == 'PA') {
              this.paRadio = true;
              this.npRadio = false;
            }
            this.isReadonly = true;
          //}
          // else{
          //     this.npiResults =[];
          //   }
          }
        });
      })
    } else {
      this.getNpiUrl = '';
    }
  }
  toggleLoginRegister(){
    this.showRegisterForm = !this.showRegisterForm;
    if(this.showRegisterForm == true){
      this.getStates();
    }
  }
  getStates = () => {
    this._pocnService.getStates().subscribe(({ data }) => {
      this.stateList = data.states.nodes;
      this.loadIp();
      this.urlParams();
      this.setGraduationYear();
      this.getLeadSources();
    });

  }
  //hide matching error
  showValue() {
    this.showPattern = true;
  }
  //common error
  msgForm = '';
  signUp() {
    this.checkDevice()
    this.lookupShow = false;
    this.lookupFirstShow = false;
    this.lookupDataShow = true;
    const date = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const person = {
      firstName: this.person.firstName,
      lastName: this.person.lastName,
      city: this.person.city,
      promoCode: this.person.promoCode,
     // state: this.person.state,
      state: (this.stateListTemp) ? this.stateListTemp.statevalue : '',
      providerType: this.person.provideType,
      email: this.person.email,
      npi: this.person.npi,
      year: (this.yearListTemp) ? this.yearListTemp.val : '',
      leadSource: (this.leadListTemp) ? this.leadListTemp.val : '',
      password: this.person.password,
      confirmPassword: this.person.confirmPassword
    };


    let regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    let searchfind = regex.test(this.person.email);
    let regexPattern = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/);
    let searchPattern = regexPattern.test(this.person.confirmPassword);
    if (this.person.password === this.person.confirmPassword && this.person.password != '' && this.person.confirmPassword != '') {
      this.passwordsMatching = true;
      this.showPattern = true;
    } else {
      this.passwordsMatching = false;
      this.showPattern = false;
    }
    if (searchfind === true) {
      this.showDiv = true;
    }
    else {
      this.showDiv = false;
    }
    // check values are  non-empty
    //if (Object.keys(person).map(e => person[e]).every(a => a.length !== 0) && this.person.password == this.person.confirmPassword && searchfind === true && this.passwordsMatching === true && searchPattern === true) {
    if ( person.firstName!=''  && person.lastName!='' && this.stateListTemp.statevalue!='' && person.providerType!='' && person.email!='' && person.npi!='' && this.yearListTemp.val!='' && person.password!='' && person.confirmPassword!='' && this.person.password == this.person.confirmPassword && searchfind === true && this.passwordsMatching === true && searchPattern === true) {

      this.setSignUpLoader = true;
      const mutate = {
        email: this.person.email,
        firstname: this.person.firstName,
        graduationYear: parseInt(this.yearListTemp.val),
        state: this.stateListTemp.statevalue,
        providerType: this.person.provideType,
        lastname: this.person.lastName,
        npi: this.person.npi,
        password: this.person.password,
        channel: this.device.userAgent,
        ipAddressV4: this.pocnLocalStorageManager.getData("ipv4"),
        ipAddressV6: this.pocnLocalStorageManager.getData("ipv6"),
        leadSource: (this.leadListTemp) ? (this.leadListTemp.id).toString() : this.utmProgram,
        promoCode: this.person.promoCode,
        medium: '',
        optStatus: '1',
        regProgram: this.utmProgram,
        userType: 'Provider',
        utmMedium: this.utmMedium,
        utmSource: this.utmSource,
        device: this.deviceType,
        timezone: timezone
      };
      this._pocnService.createUser(mutate).subscribe(
        (response: any) => {
          this.msgForm = response.data.pocnSignupUserIam.signupUserIamResult.message;
          this.content.scrollToTop(3000);
          this.setSignUpLoader = false;
          if (response.data.pocnSignupUserIam.signupUserIamResult.status == "Success") {
            const params: NavigationExtras = {
              state: { email: this.person.email }
            };
            this.showRegisterForm = !this.showRegisterForm;
            this.router.navigate(["/signup-success"], params)
            const spanName = "user-sign-up-btn";
            let attributes = {
              email: this.person.email,
              firstname: this.person.firstName,
              graduationYear: parseInt(this.yearListTemp.val),
              state: this.stateListTemp.statevalue,
              providerType: this.person.provideType,
              lastname: this.person.lastName,
              npi: this.person.npi,
              leadSource: (this.leadListTemp) ? (this.leadListTemp.id).toString() : this.utmProgram,
              promoCode: this.person.promoCode,
              userName:this.person.email,
              status:'Success'
            }
            const eventName = 'user signup';
            const event =  { 'userEmail': this.pocnLocalStorageManager.getData("userEmail"), 'status': 'Success', 'message': 'Registered user successfully' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }
          else{
            const spanName = "user-sign-up-btn";
            let attributes = {
                email: this.person.email,
                firstname: this.person.firstName,
                graduationYear: parseInt(this.yearListTemp.val),
                state: this.stateListTemp.statevalue,
                providerType: this.person.provideType,
                lastname: this.person.lastName,
                npi: this.person.npi,
                leadSource: (this.leadListTemp) ? (this.leadListTemp.id).toString() : this.utmProgram,
                promoCode: this.person.promoCode,
                userName:this.person.email,
                reason: response.data.pocnSignupUserIam.signupUserIamResult.message,
                status:'Failed'
            }
            const eventName = 'user signup';
            const event =  { 'userEmail': this.person.email, 'status': 'Error', 'message': 'Failed registration' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }
        });
    } else {
    }

  }
  setGraduationYear = () => {
    let range = (start: number, end: number) => Array.from(Array(end - start + 1).keys()).map(x => x + start);
    this.yearGraduated = range(1950, (new Date()).getFullYear());
    this.yearGraduated.forEach((val, i) => {
     this.yearGraduatedTemp.push({
      id: i,
      val: val,
      });
     
    });
  }
  getLeadSources = () => {
    this._pocnService.getLeadSourceType().subscribe(({ data }) => {
    this.leadSources =  JSON.parse(JSON.stringify(data.leadSourceMasters.nodes)); 
    //console.log(this.leadSources);
    this.leadSources.push(this.leadSources.splice(8, 1)[0]);
    //console.log(this.leadSources);
    });
  }
  selectLeadSource(selectedVal: any){
    this.person.promoCode = '';
    this.promoCodeShow = selectedVal.showStatus;
    this.promoCodeLabel = selectedVal.promoCodeLabel;
  }

  getUserProfile(token: string) {
    this._pocnService.getUserProfile(token).subscribe(({ data }) => {
    })
  }
  goBack() {
    this.router.navigate(['/']);
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message:
        '<span class="loader"><span class="loader-inner"></span></span> <p>Loading</p>',
      duration: 2000,
      spinner: null,
    });
    await this.loading.present();
  }
  // lookup page 
  async presentModal(f) {
    let fstName;
    let lstName;
    let state;
    let pType;
    fstName = this.person.firstName;
    lstName = this.person.lastName;
    state = this.stateList;
    pType = f.value.provideType;
    if(f.value['firstName'] == '' || f.value['firstName'].replace(/\s/g, '').length == 0){
      this.showFirstname = true;
    }
    else{
      this.showFirstname = false;
    }
    if(f.value['lastName'] == '' || f.value['lastName'].replace(/\s/g, '').length == 0){
      this.showFirstname = true;
    }
    else{
      this.showLastname = false;
    }

    if (f.value.provideType == 'NP/CNS') {
      this.npRadio = true;
      this.paRadio = false;
    }
    else if (f.value.provideType == 'PA') {
      this.paRadio = true;
      this.npRadio = false;
    }
    if (f.value.provideType == '') {
      this.lookupFirstShow = false;
    }
    if (this.showLastname == true && this.showFirstname == true && pType!='' && !fstName && !lstName && f.value.state===undefined && !f.value.npi && !isNaN(f.value.npi)==true) {
      this.lookupShow = true;
      this.lookupFirstShow = false;
    }
    else if ((this.showFirstname == false && this.showLastname == false && pType!='' && !fstName && !lstName && !f.value.state && f.value.npi && !isNaN(f.value.npi)==true) || ((this.showFirstname == false &&  this.showLastname == false && pType && fstName && lstName && f.value.state!=undefined) || (f.value.npi && !isNaN(f.value.npi)==true)) && !isNaN(f.value.npi)==true ) {
      this.lookupFirstShow = true;
      this.lookupShow = true;
      const modal = await this.modalController.create({
        component: RegisterModalPage,
        cssClass: 'register-modal',
        componentProps: {
          'firstName': this.person.firstName,
          'lastName': this.person.lastName,
          'states': this.stateListTemp ? this.stateListTemp.statevalue : '',
          'npi': f.value.npi,
          'provideType': f.value.provideType,
          'city': f.value.city
        },
      });
      modal.onDidDismiss().then(data => {
        this.person.firstName = data.data ?.npi.firstName;
        this.person.lastName = data.data ?.npi.lastName;
        this.person.state = data.data ?.npi.hcpState;
        this.person.npi = data.data ?.npi.npi;
        this.person.city = data.data ?.npi.hcpLocality;
        this.person.provideType = data.data ?.npi.hcpDegreeGroupCode;
        let stateTemp =  this.stateList.filter((obj) => {
          return obj.statevalue === data.data ?.npi.hcpState;
        });
        if(stateTemp.length>0){
          this.stateListTemp = {id: stateTemp[0].id,statename: stateTemp[0].statename, statevalue: stateTemp[0].statevalue};
        }
        else{
          this.stateListTemp = {id: '',statename: '', statevalue: ''};
        }
        if (this.person.provideType == 'NP/CNS') {
          this.npRadio = true;
          this.paRadio = false;
        }
        else if (this.person.provideType == 'PA') {
          this.paRadio = true;
          this.npRadio = false;
        }
        this.isReadonly = true;
      })
      return await modal.present();

    }
    else if (!fstName || !lstName ) {
      this.lookupShow = true;
      this.lookupFirstShow = false;
    }
    else if ( f.value.state===undefined) {
      this.lookupShow = true;
      this.lookupFirstShow = false;
    }
  }
  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
    });
  }
  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }
  loginBtnClick = () => {
    //this.document.location.href = environment.idpLoginURL;
  }
  async close(){
    await this.modalController.dismiss();
  }
  setFocusInput() {
    this.lastNameData.setFocus();
  }
  setFocusLastNameInput() {
    this.cityData.setFocus();
  }
  setFocusCityInput() {
    this.stateData.open();
  }
  setFocusLabelInput() {
    this.emailData.setFocus();
  }
  setFocusEmailInput() {
    this.passwordData.setFocus();
  }
  setFocusPasswordInput() {
    this.confirmPasswordData.setFocus();
  }
  setFocusLoginEmailInput() {
    this.loginPasswordData.setFocus();
  }
  // getIpAddress(){
  //   let v4; 
  //   let v6; 
  //   this.httpClient.get('https://ipv4.jsonip.com').subscribe((value: any) => {
  //       v4 = value.ip;
  //     },(error) => {}
  //   );
  //   this.httpClient.get('https://ipv6.jsonip.com').subscribe((value: any) => {
  //       v6 = value.ip;
  //     },(error) => {}
  //   );
  //   setTimeout(() => { 
  //     if(v4 === v6){
  //       if (v4.includes(":")) {
  //         this.pocnLocalStorageManager.saveData("ipv6",v6);       
  //         this.pocnLocalStorageManager.saveData("ipv4",'');       
  //       } else {
  //         this.pocnLocalStorageManager.saveData("ipv4",v4);    
  //         this.pocnLocalStorageManager.saveData("ipv6",'');    
  //       }
  //     }
  //   }, 500);
  // }
}