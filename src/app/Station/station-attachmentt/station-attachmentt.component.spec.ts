import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StationAttachmenttComponent } from './station-attachmentt.component';
describe('StationAttachmenttComponent', () => {
  let component: StationAttachmenttComponent;
  let fixture: ComponentFixture<StationAttachmenttComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationAttachmenttComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(StationAttachmenttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
