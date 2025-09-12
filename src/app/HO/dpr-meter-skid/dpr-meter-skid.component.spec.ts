import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPRMeterSkidComponent } from './dpr-meter-skid.component';
describe('DPRMeterSkidComponent', () => {
  let component: DPRMeterSkidComponent;
  let fixture: ComponentFixture<DPRMeterSkidComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPRMeterSkidComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DPRMeterSkidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
