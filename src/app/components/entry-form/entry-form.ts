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

  type: 'expense' | 'income' | null = null;
  categories: Category[] = [];
  selectedCategoryIds: number[] = [];
  amount!: number;
  note: string = "";
  currentDate: Date = new Date(); 

  showCategoryManager = false;
  newCategoryName: string = "";

  constructor(
    private categoryService: CategoryService,
    private entryService: EntryService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(cats => this.categories = cats);
  }

  selectType(type: 'expense' | 'income') {
    this.type = type;
    this.selectedCategoryIds = [];
    // Form bağlanmır, yalnız type dəyişir
  }

  toggleCategoryManager() {
    this.showCategoryManager = !this.showCategoryManager;
  }

  onCategoryToggle(categoryId: number, event: any) {
    if (event.target.checked) {
      if (!this.selectedCategoryIds.includes(categoryId)) this.selectedCategoryIds.push(categoryId);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }
  }

addEntry() {
  if (!this.type) return;
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

  addNewCategory() {
    if (!this.newCategoryName.trim() || !this.type) return;

    const newCat: Category = { id: 0, name: this.newCategoryName.trim(), type: this.type };

    this.categoryService.addCategory(newCat).subscribe(addedCat => {
      this.newCategoryName = "";
      this.loadCategories();
      if (addedCat.id) this.selectedCategoryIds.push(addedCat.id);
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(x => x !== id);
      this.loadCategories();
    });
  }

  get displayedCategories(): Category[] {
    if (!this.type) return [];
    return this.categories.filter(c => c.type === this.type);
  }

  get sortedCategories() {
    if (!this.displayedCategories) return [];
    return [
      ...this.displayedCategories.filter(cat => this.selectedCategoryIds.includes(cat.id)),
      ...this.displayedCategories.filter(cat => !this.selectedCategoryIds.includes(cat.id))
    ];
  }
}
