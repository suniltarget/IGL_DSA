import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DispenserMasterComponent } from './dispenser-master.component';
describe('DispenserMasterComponent', () => {
  let component: DispenserMasterComponent;
  let fixture: ComponentFixture<DispenserMasterComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispenserMasterComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DispenserMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
