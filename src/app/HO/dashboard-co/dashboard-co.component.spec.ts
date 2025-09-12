import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardCOComponent } from './dashboard-co.component';
describe('DashboardCOComponent', () => {
  let component: DashboardCOComponent;
  let fixture: ComponentFixture<DashboardCOComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardCOComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
