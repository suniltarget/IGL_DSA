import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JMRStationsComponent } from './jmr-stations.component';
describe('JMRStationsComponent', () => {
  let component: JMRStationsComponent;
  let fixture: ComponentFixture<JMRStationsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JMRStationsComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(JMRStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
