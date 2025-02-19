import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-preference-alert-popover',
  templateUrl: './preference-alert-popover.page.html',
  styleUrls: ['./preference-alert-popover.page.scss'],
})
export class PreferenceAlertPopoverPage implements OnInit {
  @Input() message: string;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }
  async close(){
    await this.modalController.dismiss();
  }

}
