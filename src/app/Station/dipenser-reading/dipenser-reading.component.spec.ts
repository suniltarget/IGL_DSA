import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DipenserReadingComponent } from './dipenser-reading.component';
describe('DipenserReadingComponent', () => {
  let component: DipenserReadingComponent;
  let fixture: ComponentFixture<DipenserReadingComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DipenserReadingComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DipenserReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
