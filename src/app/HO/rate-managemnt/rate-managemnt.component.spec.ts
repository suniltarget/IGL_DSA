import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RateManagemntComponent } from './rate-managemnt.component';
describe('RateManagemntComponent', () => {
  let component: RateManagemntComponent;
  let fixture: ComponentFixture<RateManagemntComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateManagemntComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(RateManagemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
