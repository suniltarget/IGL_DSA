import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MeterSkidComponent } from './meter-skid.component';
describe('MeterSkidComponent', () => {
  let component: MeterSkidComponent;
  let fixture: ComponentFixture<MeterSkidComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterSkidComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(MeterSkidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
