import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DispUnlockComponent } from './disp-unlock.component';
describe('DispUnlockComponent', () => {
  let component: DispUnlockComponent;
  let fixture: ComponentFixture<DispUnlockComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispUnlockComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DispUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
