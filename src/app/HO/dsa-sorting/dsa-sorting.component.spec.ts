import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DSASortingComponent } from './dsa-sorting.component';
describe('DSASortingComponent', () => {
  let component: DSASortingComponent;
  let fixture: ComponentFixture<DSASortingComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DSASortingComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DSASortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
