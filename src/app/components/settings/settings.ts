import { Component, OnInit } from '@angular/core';

interface Category {
  id: number;
  name: string;
  type: 'expense' | 'income';
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
  standalone:false
})
export class SettingsComponent implements OnInit {
  showPanel = false;
  categories: Category[] = [];
  newCategoryName: string = '';
  selectedType: 'expense' | 'income' = 'expense';

  constructor() {}

  ngOnInit(): void {
    this.loadCategories();
  }

  togglePanel() {
    this.showPanel = !this.showPanel;
  }

  loadCategories() {
    this.categories = JSON.parse(localStorage.getItem('categories') || '[]');
  }

  saveCategories() {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;
    const newCat: Category = {
      id: Date.now(),
      name: this.newCategoryName.trim(),
      type: this.selectedType
    };
    this.categories.push(newCat);
    this.newCategoryName = '';
    this.saveCategories();
  }

  deleteCategory(id: number) {
    this.categories = this.categories.filter(c => c.id !== id);
    this.saveCategories();
  }

  getCategoriesByType(type: 'expense' | 'income') {
    return this.categories.filter(c => c.type === type);
  }
}
