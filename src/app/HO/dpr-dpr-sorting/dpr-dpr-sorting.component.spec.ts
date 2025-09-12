import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPRDprSortingComponent } from './dpr-dpr-sorting.component';
describe('DPRDprSortingComponent', () => {
  let component: DPRDprSortingComponent;
  let fixture: ComponentFixture<DPRDprSortingComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPRDprSortingComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DPRDprSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
