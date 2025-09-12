import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityLogDprComponent } from './activity-log-dpr.component';
describe('ActivityLogDprComponent', () => {
  let component: ActivityLogDprComponent;
  let fixture: ComponentFixture<ActivityLogDprComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityLogDprComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogDprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
