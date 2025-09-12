import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LCVComponent } from './lcv.component';
describe('LCVComponent', () => {
  let component: LCVComponent;
  let fixture: ComponentFixture<LCVComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LCVComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(LCVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
