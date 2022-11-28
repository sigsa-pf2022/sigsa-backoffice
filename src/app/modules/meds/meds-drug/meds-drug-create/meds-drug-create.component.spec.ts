import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedsDrugCreateComponent } from './meds-drug-create.component';

describe('MedsDrugCreateComponent', () => {
  let component: MedsDrugCreateComponent;
  let fixture: ComponentFixture<MedsDrugCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedsDrugCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedsDrugCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
