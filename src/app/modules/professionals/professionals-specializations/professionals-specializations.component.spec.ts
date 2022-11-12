import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalsSpecializationsComponent } from './professionals-specializations.component';

describe('ProfessionalsSpecializationsComponent', () => {
  let component: ProfessionalsSpecializationsComponent;
  let fixture: ComponentFixture<ProfessionalsSpecializationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalsSpecializationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalsSpecializationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
