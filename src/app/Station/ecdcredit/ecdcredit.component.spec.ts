import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ECDCreditComponent } from './ecdcredit.component';
describe('ECDCreditComponent', () => {
  let component: ECDCreditComponent;
  let fixture: ComponentFixture<ECDCreditComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ECDCreditComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ECDCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
