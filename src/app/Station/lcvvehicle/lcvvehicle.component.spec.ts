import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LCVvehicleComponent } from './lcvvehicle.component';
describe('LCVvehicleComponent', () => {
  let component: LCVvehicleComponent;
  let fixture: ComponentFixture<LCVvehicleComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LCVvehicleComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(LCVvehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
