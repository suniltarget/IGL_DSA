import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IssuesresponseComponent } from './issuesresponse.component';
describe('IssuesresponseComponent', () => {
  let component: IssuesresponseComponent;
  let fixture: ComponentFixture<IssuesresponseComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesresponseComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesresponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
