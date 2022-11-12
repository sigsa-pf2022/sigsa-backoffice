import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedsTypeComponent } from './meds-type.component';

describe('MedsTypeComponent', () => {
  let component: MedsTypeComponent;
  let fixture: ComponentFixture<MedsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedsTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
