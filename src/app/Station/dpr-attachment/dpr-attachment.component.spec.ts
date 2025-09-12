import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPRAttachmentComponent } from './dpr-attachment.component';
describe('DPRAttachmentComponent', () => {
  let component: DPRAttachmentComponent;
  let fixture: ComponentFixture<DPRAttachmentComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPRAttachmentComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DPRAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
