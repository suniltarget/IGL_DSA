import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgDispPressureComponent } from './avg-disp-pressure.component';

describe('AvgDispPressureComponent', () => {
  let component: AvgDispPressureComponent;
  let fixture: ComponentFixture<AvgDispPressureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgDispPressureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgDispPressureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
