import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { WorkhistoryEditPopoverPage } from './workhistory-edit-popover.page';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('WorkhistoryEditPopoverPage', () => {
  let component: WorkhistoryEditPopoverPage;
  let fixture: ComponentFixture<WorkhistoryEditPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkhistoryEditPopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,FormsModule,ApolloTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkhistoryEditPopoverPage);
    component = fixture.componentInstance;
    component.workHistoryList = [{healthOrganization:''}];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
