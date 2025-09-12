import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPRReportComponent } from './dpr-report.component';
describe('DPRReportComponent', () => {
  let component: DPRReportComponent;
  let fixture: ComponentFixture<DPRReportComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPRReportComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DPRReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
