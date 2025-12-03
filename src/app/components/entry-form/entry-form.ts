import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { CategoryService, Category } from '../../services/catagory';
import { EntryService } from '../../services/entry';
import { EntryCreateDto } from '../models/entry.model';

@Component({
  selector: 'app-entry-popup',
  templateUrl: './entry-form.html',
  styleUrls: ['./entry-form.css'],
  standalone: false
})
export class EntryFormComponent implements OnInit {
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Input() selectedDay!: number;
    @Input() type!: 'expense' | 'income';   // <<<<<<==== MÜTLƏQ LAZIMDIR!


  categories: Category[] = [];
  selectedCategoryIds: number[] = [];
  amount!: number;
  note: string = "";
  currentDate: Date = new Date(); 

  showCategoryManager = false;
  newCategory: { [key in 'expense' | 'income']: string } = { expense: '', income: '' };

  constructor(
    private categoryService: CategoryService,
    private entryService: EntryService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
  }

  selectType(type: 'expense' | 'income') {
    this.type = type;
    this.selectedCategoryIds = [];
  }

  toggleCategoryManager() {
    this.showCategoryManager = !this.showCategoryManager;
  }

  onCategoryToggle(categoryId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedCategoryIds.includes(categoryId)) this.selectedCategoryIds.push(categoryId);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }
  }

addEntry() {
  if (!this.type) {
    alert("Zəhmət olmasa, əvvəlcə type seçin (Expense və ya Income).");
    return;
  }

  if (!this.selectedCategoryIds.length) return;
  if (!this.amount || this.amount <= 0) return;
  if (!this.note || !this.note.trim()) return;

  const dto: EntryCreateDto = {
    amount: this.amount,
    type: this.type,
    note: this.note.trim(),
    categoryIds: [...this.selectedCategoryIds],
    date: `${this.currentDate.getFullYear()}-${(this.currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${this.selectedDay.toString().padStart(2, '0')}`
  };

  this.entryService.addEntry(dto).subscribe({
    next: (res) => {
      this.save.emit(res);
      this.showCategoryManager = false;
    },
    error: (err) => console.error("Save failed", err)
  });
}


  closeForm() {
    this.close.emit();
  }

  addCategory(type: 'expense' | 'income') {
    const name = this.newCategory[type].trim();
    if (!name) return;

    const newCat: Category = { name, type };
    this.categoryService.add(newCat).subscribe((addedCat: Category) => {
      this.newCategory[type] = '';
      this.loadCategories();
    });
  }

  deleteCategory(id: number) {
    this.categoryService.delete(id).subscribe(() => {
      this.loadCategories();
    });
  }

  get displayedCategories(): Category[] {
    if (!this.type) return [];
    return this.categories.filter(c => c.type === this.type);
  }

  get sortedCategories(): Category[] {
    return [
      ...this.displayedCategories.filter(cat => cat.id && this.selectedCategoryIds.includes(cat.id)),
      ...this.displayedCategories.filter(cat => !cat.id || !this.selectedCategoryIds.includes(cat.id))
    ];
  }
}
