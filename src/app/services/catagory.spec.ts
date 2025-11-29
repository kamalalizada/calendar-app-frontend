import { TestBed } from '@angular/core/testing';

import { Catagory } from './catagory';

describe('Catagory', () => {
  let service: Catagory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Catagory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
