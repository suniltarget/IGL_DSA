import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryThreshholdComponent } from './entry-threshhold.component';
describe('EntryThreshholdComponent', () => {
  let component: EntryThreshholdComponent;
  let fixture: ComponentFixture<EntryThreshholdComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryThreshholdComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(EntryThreshholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
