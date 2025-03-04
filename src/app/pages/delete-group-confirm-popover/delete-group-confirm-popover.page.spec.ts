import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DeleteGroupConfirmPopoverPage } from './delete-group-confirm-popover.page';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

describe('DeleteGroupConfirmPopoverPage', () => {
  let component: DeleteGroupConfirmPopoverPage;
  let fixture: ComponentFixture<DeleteGroupConfirmPopoverPage>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteGroupConfirmPopoverPage],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientModule],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/test-url', // Mock the URL for testing
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteGroupConfirmPopoverPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal on close()', async () => {
    spyOn((component as any).modalController, 'dismiss');
    await component.close();
    expect((component as any).modalController.dismiss).toHaveBeenCalled();
  });

  it('should call sendTrace on ngOnInit', () => {
    spyOn(component.telemetry, 'sendTrace').and.returnValue(of('mock-trace-result').toPromise());
    component.ngOnInit();
    expect(component.telemetry.sendTrace).toHaveBeenCalled();
  });

  it('should dismiss with confirm-delete on leaveGroup()', () => {
    spyOn((component as any).modalController, 'dismiss');
    component.leaveGroup();
    expect((component as any).modalController.dismiss).toHaveBeenCalledWith('confirm-delete');
  });
});
