import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPRPackageComponent } from './dpr-package.component';
describe('DPRPackageComponent', () => {
  let component: DPRPackageComponent;
  let fixture: ComponentFixture<DPRPackageComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPRPackageComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DPRPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
