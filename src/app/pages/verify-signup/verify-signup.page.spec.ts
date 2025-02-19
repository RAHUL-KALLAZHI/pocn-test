import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { GraphQLModule } from 'src/app/graphql.module';
import { VerifySignupPage } from './verify-signup.page';
//import { Router ,ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';

//import { RouterModule} from '@angular/router';
describe('VerifySignupPage', () => {
  let component: VerifySignupPage;
  let fixture: ComponentFixture<VerifySignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifySignupPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,ApolloTestingModule],
    //  providers:[ActivatedRoute]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifySignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
