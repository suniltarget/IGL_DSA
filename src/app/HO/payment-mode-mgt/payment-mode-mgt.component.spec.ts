import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentModeMgtComponent } from './payment-mode-mgt.component';
describe('PaymentModeMgtComponent', () => {
  let component: PaymentModeMgtComponent;
  let fixture: ComponentFixture<PaymentModeMgtComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentModeMgtComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentModeMgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
