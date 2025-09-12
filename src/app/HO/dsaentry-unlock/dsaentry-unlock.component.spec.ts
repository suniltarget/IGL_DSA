import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DSAEntryUnlockComponent } from './dsaentry-unlock.component';
describe('DSAEntryUnlockComponent', () => {
  let component: DSAEntryUnlockComponent;
  let fixture: ComponentFixture<DSAEntryUnlockComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DSAEntryUnlockComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DSAEntryUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
