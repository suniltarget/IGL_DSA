import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClusterCompanyComponent } from './cluster-company.component';
describe('ClusterCompanyComponent', () => {
  let component: ClusterCompanyComponent;
  let fixture: ComponentFixture<ClusterCompanyComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterCompanyComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
