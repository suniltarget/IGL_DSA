import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlStationMapComponent } from './control-station-map.component';
describe('ControlStationMapComponent', () => {
  let component: ControlStationMapComponent;
  let fixture: ComponentFixture<ControlStationMapComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlStationMapComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ControlStationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
