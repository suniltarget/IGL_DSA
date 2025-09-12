import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DSMAttendenceComponent } from './dsm-attendence.component';
describe('DSMAttendenceComponent', () => {
  let component: DSMAttendenceComponent;
  let fixture: ComponentFixture<DSMAttendenceComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DSMAttendenceComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DSMAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
