import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedsMeasurementCreateComponent } from './meds-measurement-create.component';

describe('MedsMeasurementCreateComponent', () => {
  let component: MedsMeasurementCreateComponent;
  let fixture: ComponentFixture<MedsMeasurementCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedsMeasurementCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedsMeasurementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
