import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-delete-settings',
  templateUrl: './delete-settings.page.html',
  styleUrls: ['./delete-settings.page.scss'],
})
export class DeleteSettingsPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  backNavigation(){
    this.router.navigate(['/settings']);
  }
}
