import { TestBed } from '@angular/core/testing';

import { ActivateUserGuard } from './activate-user.guard';

describe('ActivateUserGuard', () => {
  let guard: ActivateUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ActivateUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
