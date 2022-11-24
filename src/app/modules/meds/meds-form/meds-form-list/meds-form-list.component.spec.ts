import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedsFormListComponent } from './meds-form-list.component';

describe('MedsFormListComponent', () => {
  let component: MedsFormListComponent;
  let fixture: ComponentFixture<MedsFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedsFormListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedsFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
