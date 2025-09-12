import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JMRAMOComponent } from './jmr-amo.component';
describe('JMRAMOComponent', () => {
  let component: JMRAMOComponent;
  let fixture: ComponentFixture<JMRAMOComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JMRAMOComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(JMRAMOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
