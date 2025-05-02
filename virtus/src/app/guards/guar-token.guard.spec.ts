import { TestBed } from '@angular/core/testing';

import { GuarTokenGuard } from './guar-token.guard';

describe('GuarTokenGuard', () => {
  let guard: GuarTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuarTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
