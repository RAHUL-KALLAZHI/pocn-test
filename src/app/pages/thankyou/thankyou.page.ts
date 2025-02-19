import { Component, OnInit, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.page.html',
  styleUrls: ['./thankyou.page.scss'],
})
export class ThankyouPage implements OnInit {

  constructor(private router: Router,@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
  }
  loginBtnClick = () => {
    //this.document.location.href = environment.idpLoginURL;
    this.router.navigate(['/register']);
  }
}
