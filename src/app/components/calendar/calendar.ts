import { Component, OnInit } from '@angular/core';
import { EntryService } from '../../services/entry';
import { Category, CategoryService } from '../../services/catagory';

interface EntryResponse {
  id: number;
  amount: number;
  type: 'expense' | 'income';
  note: string;
  date: string;
  entryCategories: { categoryId: number }[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
  standalone: false
})
export class CalendarComponent implements OnInit {

  currentDate: Date = new Date();
  days: number[] = [];
  entriesMap: Map<number, EntryResponse[]> = new Map();
  totalsMap: Map<number, { expense: number; income: number }> = new Map();

  selectedDay: number | null = null;
  showForm: number | null = null;
  type: 'expense' | 'income' | null = null;

  amount: number = 0;
  note: string = '';
  selectedCategoryIds: number[] = [];

  categories: Category[] = [];
  panelVisible: boolean = false;
  newCategory: { [key in 'expense' | 'income']: string } = { expense: '', income: '' };
  showCategoryManager: boolean = false;

  constructor(private entryService: EntryService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.generateCalendar();
    this.loadEntries();
    this.loadCategories();
  }

  generateCalendar() {
    const end = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    this.days = Array.from({ length: end.getDate() }, (_, i) => i + 1);
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
    this.loadEntries();
    this.selectedDay = null;
    this.showForm = null;
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
    this.loadEntries();
    this.selectedDay = null;
    this.showForm = null;
  }

  selectDay(day: number, event?: Event) {
    if (event) event.stopPropagation();
    if (this.showForm) return;
    this.selectedDay = day;
  }

  stopClick(event: Event) { event.stopPropagation(); }

  openForm(event: Event, day: number) {
    event.stopPropagation();
    this.showForm = day;
    this.type = null; // type seçilməyincə form gizli
    this.amount = 0;
    this.note = '';
    this.selectedCategoryIds = [];
    this.showCategoryManager = false;
  }

  closeForm() {
    this.showForm = null;
    this.type = null;
    this.showCategoryManager = false;
  }

  selectTypeAndOpenForm(t: 'expense' | 'income') {
    this.type = t;
    this.showCategoryManager = false;
  }

    // Köməkçi funksiya
  asExpenseOrIncome(t: string): 'expense' | 'income' {
    if (t === 'expense') return 'expense';
    return 'income';
  }

  toggleCategoryManager() {
    this.showCategoryManager = !this.showCategoryManager;
  }

  onCategoryToggle(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.selectedCategoryIds.push(id);
    else this.selectedCategoryIds = this.selectedCategoryIds.filter(c => c !== id);
  }

  buildEntry(): EntryResponse {
    if (!this.type) throw new Error("Type seçilməyib!");

    return {
      id: Date.now(),
      amount: this.amount,
      type: this.type,
      note: this.note,
      date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.selectedDay!).toISOString(),
      entryCategories: this.selectedCategoryIds.map(id => ({ categoryId: id }))
    };
  }

addEntry() {

  if (!this.type) {
    alert("Zəhmət olmasa type seçin.");
    return;
  }

  if (!this.selectedCategoryIds.length) {
    alert("Zəhmət olmasa kateqoriya seçin.");
    return;
  }

  if (!this.amount || this.amount <= 0) {
    alert("Məbləğ düzgün deyil.");
    return;
  }

  if (!this.note || !this.note.trim()) {
    alert("Zəhmət olmasa qeyd (note) yazın.");
    return;
  }

  // davamı səndə necə idisə qalır...


  if (!this.type || !this.selectedDay) return;

  const dto = {
    amount: this.amount,
    type: this.type,
    note: this.note,
    categoryIds: [...this.selectedCategoryIds],
    date: `${this.currentDate.getFullYear()}-${(this.currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${this.selectedDay.toString().padStart(2, '0')}`
  };

  // Backend-ə göndər
  this.entryService.addEntry(dto).subscribe({
    next: (res) => {
      // Backend-dən gələn cavabı map-ə əlavə et
      const entry: EntryResponse = {
        id: res.id || Date.now(),
        amount: res.amount,
        type: res.type,
        note: res.note,
        date: res.date,
        entryCategories: res.categoryIds.map((id: number) => ({ categoryId: id }))
      };
      this.addEntryToCalendar(entry);

      // Formu bağla
      this.closeForm();
    },
    error: (err) => console.error('Save failed', err)
  });
}


  addEntryToCalendar(entry: EntryResponse) {
    const day = new Date(entry.date).getDate();
    if (!this.entriesMap.has(day)) this.entriesMap.set(day, []);
    this.entriesMap.get(day)!.push(entry);

    const totals = this.totalsMap.get(day) || { expense: 0, income: 0 };
    totals[entry.type] += entry.amount;
    this.totalsMap.set(day, totals);

    this.closeForm();
  }

  loadEntries() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    this.entryService.getByMonth(year, month).subscribe({
      next: (data: EntryResponse[]) => {
        this.entriesMap.clear();
        this.totalsMap.clear();
        data.forEach(e => {
          const day = new Date(e.date).getDate();
          if (!this.entriesMap.has(day)) this.entriesMap.set(day, []);
          this.entriesMap.get(day)!.push(e);

          const totals = this.totalsMap.get(day) || { expense: 0, income: 0 };
          totals[e.type] += e.amount;
          this.totalsMap.set(day, totals);
        });
      },
      error: err => console.error('Load failed', err)
    });
  }

  isToday(day: number) {
    const t = new Date();
    return day === t.getDate() && this.currentDate.getMonth() === t.getMonth() && this.currentDate.getFullYear() === t.getFullYear();
  }

  getTotalsForDay(day: number, type: 'expense' | 'income') {
    const totals = this.totalsMap.get(day);
    return totals ? totals[type] : 0;
  }

  getEntriesForSelectedDay(type: 'expense' | 'income') {
    if (!this.selectedDay) return [];
    const entries = this.entriesMap.get(this.selectedDay) || [];
    return entries.filter(e => e.type === type);
  }

  getCategoryName(id: number | undefined) {
    if (!id) return '';
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.name : '';
  }

  togglePanel() {
    this.panelVisible = !this.panelVisible;
    if (this.panelVisible) this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });
  }

  getCategoriesByType(type: 'expense' | 'income') {
    return this.categories.filter(c => c.type === type);
  }

  addCategory(type: 'expense' | 'income') {
    const name = this.newCategory[type].trim();
    if (!name) return;

    const newCat: Category = { name, type };
    this.categoryService.add(newCat).subscribe(() => {
      this.newCategory[type] = '';
      this.loadCategories();
    });
  }

  deleteCategory(id: number) {
    this.categoryService.delete(id).subscribe(() => this.loadCategories());
  }
}
