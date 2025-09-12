import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPRGasGensetComponent } from './dpr-gas-genset.component';
describe('DPRGasGensetComponent', () => {
  let component: DPRGasGensetComponent;
  let fixture: ComponentFixture<DPRGasGensetComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPRGasGensetComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DPRGasGensetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
