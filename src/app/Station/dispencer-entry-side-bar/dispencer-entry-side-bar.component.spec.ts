import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DispencerEntrySideBarComponent } from './dispencer-entry-side-bar.component';
describe('DispencerEntrySideBarComponent', () => {
  let component: DispencerEntrySideBarComponent;
  let fixture: ComponentFixture<DispencerEntrySideBarComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispencerEntrySideBarComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DispencerEntrySideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
