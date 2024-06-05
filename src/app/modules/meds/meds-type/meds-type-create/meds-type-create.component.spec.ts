import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedsTypeCreateComponent } from './meds-type-create.component';

describe('MedsTypeCreateComponent', () => {
  let component: MedsTypeCreateComponent;
  let fixture: ComponentFixture<MedsTypeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedsTypeCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedsTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
