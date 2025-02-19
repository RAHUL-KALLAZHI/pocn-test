import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResetPasswordPage } from './reset-password.page';
// import { RouterModule ,ActivatedRoute} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
// import { GraphQLModule } from 'src/app/graphql.module';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('ResetPasswordPage', () => {
  let component: ResetPasswordPage;
  let fixture: ComponentFixture<ResetPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule,FormsModule,ApolloTestingModule],
      // providers: [ ActivatedRoute ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
