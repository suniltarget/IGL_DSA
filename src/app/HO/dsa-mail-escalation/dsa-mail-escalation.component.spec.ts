import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DSAMailEscalationComponent } from './dsa-mail-escalation.component';
describe('DSAMailEscalationComponent', () => {
  let component: DSAMailEscalationComponent;
  let fixture: ComponentFixture<DSAMailEscalationComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DSAMailEscalationComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DSAMailEscalationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
