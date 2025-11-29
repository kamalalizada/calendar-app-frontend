import { TestBed } from '@angular/core/testing';
import { EntryCreateDto } from '../components/models/entry.model';
import { EntryService } from './entry';

describe('EntryService', () => {
  let service: EntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntryService]
    });
    service = TestBed.inject(EntryService);
  });




});
