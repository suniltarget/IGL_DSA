import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPRDashboardComponent } from './dpr-dashboard.component';
describe('DPRDashboardComponent', () => {
  let component: DPRDashboardComponent;
  let fixture: ComponentFixture<DPRDashboardComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPRDashboardComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DPRDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
