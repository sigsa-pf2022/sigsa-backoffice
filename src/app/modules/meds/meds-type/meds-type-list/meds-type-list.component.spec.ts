import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedsTypeListComponent } from './meds-type-list.component';

describe('MedsTypeListComponent', () => {
  let component: MedsTypeListComponent;
  let fixture: ComponentFixture<MedsTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedsTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedsTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
