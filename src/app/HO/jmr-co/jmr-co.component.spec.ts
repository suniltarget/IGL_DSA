import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JMRCOComponent } from './jmr-co.component';
describe('JMRCOComponent', () => {
  let component: JMRCOComponent;
  let fixture: ComponentFixture<JMRCOComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JMRCOComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(JMRCOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
