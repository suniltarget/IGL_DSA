import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JMRDashboardComponent } from './jmr-dashboard.component';
describe('JMRDashboardComponent', () => {
  let component: JMRDashboardComponent;
  let fixture: ComponentFixture<JMRDashboardComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JMRDashboardComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(JMRDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
