import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GasGensetComponent } from './gas-genset.component';
describe('GasGensetComponent', () => {
  let component: GasGensetComponent;
  let fixture: ComponentFixture<GasGensetComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GasGensetComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(GasGensetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
