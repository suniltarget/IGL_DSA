import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralEntryComponent } from './general-entry.component';
describe('GeneralEntryComponent', () => {
  let component: GeneralEntryComponent;
  let fixture: ComponentFixture<GeneralEntryComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralEntryComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
