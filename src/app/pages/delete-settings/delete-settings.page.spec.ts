import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeleteSettingsPage } from './delete-settings.page';

describe('DeleteSettingsPage', () => {
  let component: DeleteSettingsPage;
  let fixture: ComponentFixture<DeleteSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteSettingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
