import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeletePreferenceAreasPage } from './delete-preference-areas.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DeletePreferenceAreasPage', () => {
  let component: DeletePreferenceAreasPage;
  let fixture: ComponentFixture<DeletePreferenceAreasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePreferenceAreasPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePreferenceAreasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
