import { TestBed } from '@angular/core/testing';

import { MilhasService } from './milhas.service';

describe('MilhasService', () => {
  let service: MilhasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilhasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
