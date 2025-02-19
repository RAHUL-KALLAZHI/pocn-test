import { Component, OnInit, Input } from '@angular/core';
// import { EducationEditPopoverPage,} from "../education-edit-popover/education-edit-popover.page";
// import { WorkhistoryEditPopoverPage,} from "../workhistory-edit-popover/workhistory-edit-popover.page";
// import { DeletePopoverPage,} from "../delete-popover/delete-popover.page";
import { Router } from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
//import { TokenManager } from "./../../services/token-manager";
import { AlertController, ModalController } from '@ionic/angular';
import { PopoverController } from "@ionic/angular";
import { Observable, ReplaySubject } from 'rxjs';
import { UserResume } from './../../services/type';
import { DeleteProfileResumeModalPage } from "../delete-profile-resume-modal/delete-profile-resume-modal.page";
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-resume-popover',
  templateUrl: './resume-popover.page.html',
  styleUrls: ['./resume-popover.page.scss'],
})
export class ResumePopoverPage implements OnInit {
  @Input() userAgent: string;
  @Input() deviceType: string;
  @Input() key1: string;
  @Input() key2: string;
  @Input() person: string;
  public token;
  successStatus = false;
  resumeFileType = [ "application/msword", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf"];
  fileErrorStatus = false;
  uploadedFile = {};
  errorMsg = '';
  myResumeName = "";
  successMsg = "";
  fileLoader = false;
  userResume: UserResume[] = [];
  
  constructor(
    private popover: PopoverController,
    private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private modalController: ModalController,
    public telemetry: TelemetryService,
    public alertController: AlertController) {
    this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "resume-popover";
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
 
 async pickResume(event){
    this.fileErrorStatus = false;
    this.successStatus = false;
    const file = (event.target as HTMLInputElement).files[0];
    this.myResumeName = file.name;
    if(this.resumeFileType.includes(file.type)){
      if((file.size/1000000) <= 2)
      {
    this.convertToBase64(event.target.files[0]).subscribe(base64 => {
     this.uploadedFile = base64;
      this.resumeSave();
      
    });
      }
      else{
        this.fileErrorStatus = true;
        await this.popover.dismiss('resumeFailedSize');
        this.errorMsg = "Upload failed. Maximum file upload size is restricted to 2 MB.";
      }
    }
    else{
      this.fileErrorStatus = true;
      await this.popover.dismiss('resumeFailedFormat');
      this.errorMsg = "Upload failed. Please select a valid file format (doc, docx, pdf and txt).";
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
  resumeSave (){
    const resumeMutate = {
      accessCode: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
      fileContent: this.uploadedFile,
      fileName: this.myResumeName,
      npi: this.person['npi'],
      providerId: this.person['providerId'],
      userId: this.person['userId']
    }
    this.successStatus = false;
    this.fileErrorStatus = false;
    this.fileLoader = true;
    this._pocnService.updateUserResume(resumeMutate).subscribe(
      (response: any) => {
        if(response.data.updateUserResume.userProfileUpdateResponse.status == "Success"){  
          this.close();
          this.successStatus = true;
          this.fileLoader = false;
          this.successMsg = "Resume successfully saved";
          let logDetaiils = {
            accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
            npi: this.person['npi'],
            logType: "Profile Update",
            channel: this.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
            ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation: "",
            description: "Updated profile resume",
            activity: "Profile Resume Update",
          }
          this._pocnService.updateUserLog(logDetaiils).subscribe((response: any) => {});
          const spanName = "profile-resume-replace-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          }
          const eventName = 'profile resume replace';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully updated resume' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
        }
        else{
          this.fileErrorStatus = true;
          this.errorMsg = response.data.updateUserResume.userProfileUpdateResponse.message;
          this.fileLoader = false;
          const spanName = "profile-resume-replace-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          }
          const eventName = 'profile resume replace';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update resume' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
        }
      });
  }
  async editResume(){
    await this.popover.dismiss('resumeRename');
  }
  async close() {
    await this.popover.dismiss('resume');
  }
  removeResumeConfirmed(){
    const resumeMutate = {
      accessCode: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
      fileContent: '',
      fileName: '',
      npi: this.person['npi'],
      providerId: this.person['providerId'],
      userId: this.person['userId'],
    } 
    this._pocnService.updateUserResume(resumeMutate).subscribe(
    (response: any) => {
      // if (response.data) {
        if (response.data.updateUserResume.userProfileUpdateResponse.status == "Success") {
          this.popover.dismiss('resumedelete');
          let logDetaiils = {
            accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
            npi: this.person['npi'],
            logType: "Profile Update",
            channel: this.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
            ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation: "",
            description: "Deleted profile resume",
            activity: "Profile Resume Delete",
          }
          this._pocnService.updateUserLog(logDetaiils).subscribe((response: any) => {});
          const spanName = "profile-resume-delete-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          }
          const eventName = 'profile resume delete';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully deleted resume' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
        }
      // }
      },
    (error) => {
    });
  }
  async removeResume() {
    const popover = await this.modalController.create({
      component: DeleteProfileResumeModalPage,
      cssClass: 'reject-modal',
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if(modalDataResponse.data == 'confirm-delete'){
        this.removeResumeConfirmed();
      }
    });
    await popover.present();
  }
}
