import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SAPJMRComponent } from './sap-jmr.component';
describe('SAPJMRComponent', () => {
  let component: SAPJMRComponent;
  let fixture: ComponentFixture<SAPJMRComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SAPJMRComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SAPJMRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
