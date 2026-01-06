import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationRelationComponent } from './station-relation.component';

describe('StationRelationComponent', () => {
  let component: StationRelationComponent;
  let fixture: ComponentFixture<StationRelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationRelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
