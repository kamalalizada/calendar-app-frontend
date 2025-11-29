import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryFormComponent } from './entry-form';

describe('EntryForm', () => {
  let component: EntryFormComponent;
  let fixture: ComponentFixture<EntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
