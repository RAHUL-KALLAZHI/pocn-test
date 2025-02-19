import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {
 ipV4: string;
 ipV6: string
 constructor(private httpClient: HttpClient) {  }
  
  getIpAddress(type:string){
    let v4; 
    let v6; 
    this.httpClient.get('https://ipv4.jsonip.com').subscribe((value: any) => {
        v4 = value.ip;
      },
      (error) => {
      }
    );
   this.httpClient.get('https://ipv6.jsonip.com').subscribe((value: any) => {
        v6 = value.ip;
      },
      (error) => {
      }
    );
    setTimeout(() => { 
      if(v4 === v6){
        if (v4.includes(":")) {
          this.ipV6 = v6;
          this.ipV4 = '';        
        } else {
          this.ipV6 = '';
          this.ipV4 = v4;        
        }
      }
      if(type === 'v4'){
        return this.ipV4
      }
      else{
        return this.ipV6
      }
   }, 500);

  }
}