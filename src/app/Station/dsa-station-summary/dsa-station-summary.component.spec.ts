import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DSAStationSummaryComponent } from './dsa-station-summary.component';
describe('DSAStationSummaryComponent', () => {
  let component: DSAStationSummaryComponent;
  let fixture: ComponentFixture<DSAStationSummaryComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DSAStationSummaryComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DSAStationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
