import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalsSpecializationsCreateComponent } from './professionals-specializations-create.component';

describe('ProfessionalsSpecializationsCreateComponent', () => {
  let component: ProfessionalsSpecializationsCreateComponent;
  let fixture: ComponentFixture<ProfessionalsSpecializationsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalsSpecializationsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalsSpecializationsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
