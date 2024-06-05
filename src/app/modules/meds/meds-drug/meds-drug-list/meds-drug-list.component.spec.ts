import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedsDrugListComponent } from './meds-drug-list.component';

describe('MedsDrugListComponent', () => {
  let component: MedsDrugListComponent;
  let fixture: ComponentFixture<MedsDrugListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedsDrugListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedsDrugListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
