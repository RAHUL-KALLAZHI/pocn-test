import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { GraphQLModule } from 'src/app/graphql.module';

import { InviteGroupPagePage } from './invite-group-page.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('InviteGroupPagePage', () => {
  let component: InviteGroupPagePage;
  let fixture: ComponentFixture<InviteGroupPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteGroupPagePage ],
      imports: [IonicModule.forRoot(),GraphQLModule,RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InviteGroupPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
