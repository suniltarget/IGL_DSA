import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OtherSalesComponent } from './other-sales.component';
describe('OtherSalesComponent', () => {
  let component: OtherSalesComponent;
  let fixture: ComponentFixture<OtherSalesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherSalesComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
