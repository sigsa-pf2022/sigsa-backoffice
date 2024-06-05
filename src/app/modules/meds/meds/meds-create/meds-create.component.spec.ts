import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedsCreateComponent } from './meds-create.component';

describe('MedsCreateComponent', () => {
  let component: MedsCreateComponent;
  let fixture: ComponentFixture<MedsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
