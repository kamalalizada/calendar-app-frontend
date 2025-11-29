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
    this.categoryService.getCategories().subscribe(categories => {
      this.expenseCats = categories.filter(c => c.type === 'expense');
      this.incomeCats = categories.filter(c => c.type === 'income');
    });
  }

  add(type: 'expense' | 'income') {
    const name = type === 'expense' ? this.newExpense.trim() : this.newIncome.trim();
    if (!name) return;

    const newCategory: Category = { id: 0, name, type };
    this.categoryService.addCategory(newCategory).subscribe(() => {
      this.newExpense = '';
      this.newIncome = '';
      this.loadCategories(); // backend-dən yenilənmiş data al
    });
  }

  delete(id: number) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.loadCategories();
    });
  }

  closeManager() {
    this.close.emit();
  }
}
