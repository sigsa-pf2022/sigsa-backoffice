import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedsMeasurementListComponent } from './meds-measurement-list.component';

describe('MedsMeasurementListComponent', () => {
  let component: MedsMeasurementListComponent;
  let fixture: ComponentFixture<MedsMeasurementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedsMeasurementListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedsMeasurementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
