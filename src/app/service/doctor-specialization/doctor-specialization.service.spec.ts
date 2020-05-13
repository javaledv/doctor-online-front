import { TestBed } from '@angular/core/testing';

import { DoctorSpecializationService } from './doctor-specialization.service';

describe('DoctorSpecializationService', () => {
  let service: DoctorSpecializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorSpecializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
