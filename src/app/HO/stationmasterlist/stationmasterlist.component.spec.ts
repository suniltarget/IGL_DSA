import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StationmasterlistComponent } from './stationmasterlist.component';
describe('StationmasterlistComponent', () => {
  let component: StationmasterlistComponent;
  let fixture: ComponentFixture<StationmasterlistComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationmasterlistComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(StationmasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
