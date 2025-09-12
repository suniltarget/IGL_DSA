import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPREntyComponent } from './dpr-enty.component';
describe('DPREntyComponent', () => {
  let component: DPREntyComponent;
  let fixture: ComponentFixture<DPREntyComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPREntyComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DPREntyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
