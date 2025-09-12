import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ECDMasterComponent } from './ecdmaster.component';
describe('ECDMasterComponent', () => {
  let component: ECDMasterComponent;
  let fixture: ComponentFixture<ECDMasterComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ECDMasterComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ECDMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
