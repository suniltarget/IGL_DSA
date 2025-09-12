import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DsaSummaryComponent } from './dsa-summary.component';
describe('DsaSummaryComponent', () => {
  let component: DsaSummaryComponent;
  let fixture: ComponentFixture<DsaSummaryComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsaSummaryComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DsaSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
