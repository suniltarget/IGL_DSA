import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DispenserEntryComponent } from './dispenser-entry.component';
describe('DispenserEntryComponent', () => {
  let component: DispenserEntryComponent;
  let fixture: ComponentFixture<DispenserEntryComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispenserEntryComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DispenserEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
