import { Component, OnInit } from '@angular/core';
import { EntryService } from '../../services/entry';

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
  showForm: number | null = null;  // hansı günün formu açıqdır
  showStep: { [day: number]: number } = {}; // step: 1 = type, 2 = amount/note/category

  type: 'expense' | 'income' = 'expense';
  amount: number = 0;
  note: string = '';
  selectedCategoryIds: number[] = [];
  sortedCategories: any[] = JSON.parse(localStorage.getItem('categories') || '[]');

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.generateCalendar();
    this.loadEntries();
  }

  generateCalendar() {
    const end = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    this.days = [];
    for (let i = 1; i <= end.getDate(); i++) this.days.push(i);
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
    if (this.showForm) return; // form açıqkən dəyişdirmə
    this.selectedDay = day;
  }

  openForm(event: Event, day: number) {
    event.stopPropagation();
    this.showForm = day;
    this.showStep[day] = 1;
    this.type = 'expense';
    this.amount = 0;
    this.note = '';
    this.selectedCategoryIds = [];
  }

  nextStep(day: number) {
    this.showStep[day] = 2;
  }

  closeForm() {
    this.showForm = null;
    this.showStep = {};
  }

  selectType(t: 'expense' | 'income') {
    this.type = t;
  }

  onCategoryToggle(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.selectedCategoryIds.push(id);
    else this.selectedCategoryIds = this.selectedCategoryIds.filter(c => c !== id);
  }

  buildEntry(): EntryResponse {
    return {
      id: Date.now(),
      amount: this.amount,
      type: this.type,
      note: this.note,
      date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.selectedDay!).toISOString(),
      entryCategories: this.selectedCategoryIds.map(id => ({ categoryId: id }))
    };
  }

  addEntryToCalendar(entry: EntryResponse) {
    const day = new Date(entry.date).getDate();
    if (!this.entriesMap.has(day)) this.entriesMap.set(day, []);
    this.entriesMap.get(day)!.push(entry);

    const totals = this.totalsMap.get(day) || { expense: 0, income: 0 };
    if (entry.type === 'expense') totals.expense += entry.amount;
    else totals.income += entry.amount;
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
          if (e.type === 'expense') totals.expense += e.amount;
          else totals.income += e.amount;
          this.totalsMap.set(day, totals);
        });
      },
      error: err => console.error('Load failed', err)
    });
  }

  isToday(day: number) {
    const t = new Date();
    return (
      day === t.getDate() &&
      this.currentDate.getMonth() === t.getMonth() &&
      this.currentDate.getFullYear() === t.getFullYear()
    );
  }

  getTotalsForDay(day: number, type: 'expense' | 'income') {
    const totals = this.totalsMap.get(day);
    if (!totals) return 0;
    return type === 'expense' ? totals.expense : totals.income;
  }

  getEntriesForSelectedDay(type: 'expense' | 'income') {
    if (!this.selectedDay) return [];
    const entries = this.entriesMap.get(this.selectedDay) || [];
    return entries.filter(e => e.type === type);
  }

  getCategoryName(id: number | undefined) {
    if (!id) return '';
    const all = JSON.parse(localStorage.getItem('categories') || '[]');
    const cat = all.find((c: any) => c.id === id);
    return cat ? cat.name : '';
  }
}
