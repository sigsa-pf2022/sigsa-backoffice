import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedsFormCreateComponent } from './meds-form-create.component';

describe('MedsFormCreateComponent', () => {
  let component: MedsFormCreateComponent;
  let fixture: ComponentFixture<MedsFormCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedsFormCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedsFormCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
