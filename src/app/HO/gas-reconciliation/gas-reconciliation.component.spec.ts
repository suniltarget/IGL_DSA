import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GasReconciliationComponent } from './gas-reconciliation.component';
describe('GasReconciliationComponent', () => {
  let component: GasReconciliationComponent;
  let fixture: ComponentFixture<GasReconciliationComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GasReconciliationComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(GasReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
