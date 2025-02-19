import { Component, NgZone } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { BehaviorSubject, interval } from 'rxjs';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { LocalStorageManager } from './services/local-storage-manager';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public onlineOffline: boolean = navigator.onLine;
  private source = interval(3000);
  private config = 'https://jsonplaceholder.typicode.com/todos/1';
  public connState = new BehaviorSubject<boolean>(false);
  public newStatus: boolean;
  public prevStatus: boolean;
  public initialState: boolean = true;
  public token: any;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient,
    private platform: Platform,
    private pocnLocalStorageManager: LocalStorageManager,
    private ngZone: NgZone,
  ) {
    this.platform.ready().then(() => {
      setTimeout(() => {
        SplashScreen.hide({ fadeOutDuration: 300 });
      }, 400);
      if (!this.pocnLocalStorageManager.getData("ipv4") && !this.pocnLocalStorageManager.getData("ipv6")) {
        this.getIpAddress();
      }

    });
    if (!this.onlineOffline) {
      this.presentToast('bottom', 'Please check your internet connection');
      this.initialState = false;
    }
    this.source.subscribe(async () => {
      this.http
        .get(this.config, { observe: 'response' })
        .pipe(first())
        .subscribe(
          (resp) => {
            if (resp.status === 200) {
              this.connected(true);
            } else {
              this.connected(false);
            }
          },
          (err) => this.connected(false)
        );

      if (this.prevStatus != this.newStatus) {
        if (this.initialState) {
          this.initialState = false;
          if (this.newStatus) return;
        }
        if (!this.initialState) {
          if (this.newStatus)
            await this.presentToast('bottom', 'You are back online');
          else
            await this.presentToast(
              'bottom',
              'Please check your internet connection'
            );
        }
      }
    });

    App.addListener('appUrlOpen', (data) => {
      this.token = this.pocnLocalStorageManager.getData('pocnApiAccessToken');
      console.log(data);
      if (this.token === '' && this.token == (null || undefined)) {
        const accessCode = data.url.split('&code=').pop();
        const cheCkToken = accessCode.indexOf('https:/') > -1;
        if (!cheCkToken) {
          const params: NavigationExtras = {
            state: { url: data.url, code: accessCode },
          };
          this.ngZone.run(() => {
            this.router.navigate(['/mobile-pre-auth'], params);
          });
        } else {
          this.ngZone.run(() => {
            this.router.navigate(['/register']);
          });
        }
        return;
      } else {
        if (data.url.indexOf('tablinks/groups/request') > -1) {
          this.router.navigate(['/tablinks/groups/request']);
          return;
        }
        if (data.url.indexOf('reset?token=') > -1) {
          const tokenCode = data.url.split('reset?token=').pop();
          const params: NavigationExtras = {
            state: { url: data.url, token: tokenCode },
          };
          this.ngZone.run(() => {
            this.router.navigate(['/reset'], params);
          });
          return;
        }
        if (data.url.indexOf('verify?token=') > -1) {
          const verifytokenCode = data.url.split('verify?token=').pop();
          const params: NavigationExtras = {
            state: { url: data.url, token: verifytokenCode },
          };
          this.ngZone.run(() => {
            this.router.navigate(['/verify'], params);
          });
          return;
        }
        if (data.url.indexOf('tablinks/connection') > -1) {
          this.ngZone.run(() => {
            this.router.navigate(['/tablinks/connection/request']);
          });
          return;
        }
        if (data.url.indexOf('/connect') > -1) {
          this.ngZone.run(() => {
            this.router.navigate(['/connect']);
          });
          return;
        }
      }
    });
  }

  connected(data: boolean) {
    this.newStatus = data;
    this.prevStatus = this.connState.value;
    this.connState.next(this.newStatus);
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: position,
      animated: true,
    });

    await toast.present();
  }
  getIpAddress(){
    let v4; 
    let v6; 
    this.http.get('https://ipv4.jsonip.com').subscribe((value: any) => {
        v4 = value.ip;
      },(error) => {}
    );
    this.http.get('https://ipv6.jsonip.com').subscribe((value: any) => {
        v6 = value.ip;
      },(error) => {}
    );
    setTimeout(() => { 
      if(v4 === v6){
        if (v4.includes(":")) {
          this.pocnLocalStorageManager.saveData("ipv6",v6);       
          this.pocnLocalStorageManager.saveData("ipv4",'');       
        } else {
          this.pocnLocalStorageManager.saveData("ipv4",v4);    
          this.pocnLocalStorageManager.saveData("ipv6",'');    
        }
      }
    }, 5000);
  }
}
