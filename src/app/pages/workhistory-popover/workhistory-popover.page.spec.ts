import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorkhistoryPopoverPage } from './workhistory-popover.page';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('WorkhistoryPopoverPage', () => {
  let component: WorkhistoryPopoverPage;
  let fixture: ComponentFixture<WorkhistoryPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkhistoryPopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,FormsModule,ApolloTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkhistoryPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
