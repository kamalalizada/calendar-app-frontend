import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Category, CategoryService } from '../../services/catagory';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.html',
  styleUrls: ['./category-manager.css'],
  standalone: false
})
export class CategoryManagerComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  expenseCats: Category[] = [];
  incomeCats: Category[] = [];

  newExpense: string = "";
  newIncome: string = "";

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(categories => {
      this.expenseCats = categories.filter(c => c.type === 'expense');
      this.incomeCats = categories.filter(c => c.type === 'income');
    });
  }

  add(type: 'expense' | 'income') {
    const name = type === 'expense' ? this.newExpense.trim() : this.newIncome.trim();
    if (!name) return;

    const newCategory = { name, type }; 
    this.categoryService.add(newCategory).subscribe(() => {
      if (type === 'expense') this.newExpense = '';
      else this.newIncome = '';
      this.loadCategories(); 
    });
  }

  delete(id: number) {
    this.categoryService.delete(id).subscribe(() => {
      this.loadCategories();
    });
  }

  closeManager() {
    this.close.emit();
  }
}
