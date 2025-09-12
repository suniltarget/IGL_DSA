import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPRRejectStationComponent } from './dpr-reject-station.component';
describe('DPRRejectStationComponent', () => {
  let component: DPRRejectStationComponent;
  let fixture: ComponentFixture<DPRRejectStationComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPRRejectStationComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DPRRejectStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
