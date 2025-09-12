import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MktofficemgmntlistComponent } from './mktofficemgmntlist.component';
describe('MktofficemgmntlistComponent', () => {
  let component: MktofficemgmntlistComponent;
  let fixture: ComponentFixture<MktofficemgmntlistComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MktofficemgmntlistComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(MktofficemgmntlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
