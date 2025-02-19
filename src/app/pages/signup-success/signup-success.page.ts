import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute,Params} from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.page.html',
  styleUrls: ['./signup-success.page.scss'],
})
export class SignupSuccessPage implements OnInit {
  public emailId: string;
  constructor(private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    ) {
    const routeState = this.router.getCurrentNavigation()?.extras.state;
    if (Capacitor.getPlatform() === 'web') {
      this.route.queryParams
        .subscribe(params => {
          this.emailId = params.email;
        }
      );    
    }
    else{
      this.emailId = routeState.email;
    }
   }

  ngOnInit() {
  }

}
