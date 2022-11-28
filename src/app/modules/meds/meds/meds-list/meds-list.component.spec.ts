import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedsListComponent } from './meds-list.component';

describe('MedsListComponent', () => {
  let component: MedsListComponent;
  let fixture: ComponentFixture<MedsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
