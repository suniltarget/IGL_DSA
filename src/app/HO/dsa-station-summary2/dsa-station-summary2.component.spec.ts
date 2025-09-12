import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DsaStationSummary2Component } from './dsa-station-summary2.component';
describe('DsaStationSummary2Component', () => {
  let component: DsaStationSummary2Component;
  let fixture: ComponentFixture<DsaStationSummary2Component>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsaStationSummary2Component ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DsaStationSummary2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
