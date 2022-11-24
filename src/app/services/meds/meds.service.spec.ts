import { TestBed } from '@angular/core/testing';

import { MedsService } from './meds.service';

describe('MedsService', () => {
  let service: MedsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
