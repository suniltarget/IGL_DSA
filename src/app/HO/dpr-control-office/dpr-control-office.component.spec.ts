import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPRControlOfficeComponent } from './dpr-control-office.component';
describe('DPRControlOfficeComponent', () => {
  let component: DPRControlOfficeComponent;
  let fixture: ComponentFixture<DPRControlOfficeComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPRControlOfficeComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DPRControlOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
