import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPRLCVComponent } from './dpr-lcv.component';
describe('DPRLCVComponent', () => {
  let component: DPRLCVComponent;
  let fixture: ComponentFixture<DPRLCVComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPRLCVComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DPRLCVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
