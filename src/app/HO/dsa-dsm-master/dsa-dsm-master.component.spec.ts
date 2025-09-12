import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DSADSMMasterComponent } from './dsa-dsm-master.component';
describe('DSADSMMasterComponent', () => {
  let component: DSADSMMasterComponent;
  let fixture: ComponentFixture<DSADSMMasterComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DSADSMMasterComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DSADSMMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
