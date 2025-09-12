import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JumpReportSystemComponent } from './jump-report-system.component';
describe('JumpReportSystemComponent', () => {
  let component: JumpReportSystemComponent;
  let fixture: ComponentFixture<JumpReportSystemComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumpReportSystemComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(JumpReportSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
