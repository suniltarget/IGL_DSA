import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyDPRMailComponent } from './daily-dprmail.component';
describe('DailyDPRMailComponent', () => {
  let component: DailyDPRMailComponent;
  let fixture: ComponentFixture<DailyDPRMailComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyDPRMailComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DailyDPRMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
