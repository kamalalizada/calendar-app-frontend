import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { EntryService } from '../../services/entry';

@Component({
  selector: 'app-report',
  templateUrl: './report.html',
  styleUrls: ['./report.css'],
  standalone: false
})
export class ReportComponent implements OnInit {

  // Filter
  years: number[] = [];
  months: string[] = [
    'Yanvar','Fevral','Mart','Aprel','May','İyun',
    'İyul','Avqust','Sentyabr','Oktyabr','Noyabr','Dekabr'
  ];

  selectedYear: number;
  selectedMonth: number;
  selectedDayFrom: number = 1;
  selectedDayTo: number = 31;

  chartType: ChartType = 'bar';

 chartData: ChartData<'pie', number[], string> = {
  labels: [],
  datasets: []
};


  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(private entryService: EntryService) {
    const now = new Date();
    this.selectedYear = now.getFullYear();
    this.selectedMonth = now.getMonth() + 1;
  }

  ngOnInit(): void {
    this.createYearList(2000, 2050);
    this.loadReport();
  }

  createYearList(start: number, end: number) {
    this.years = [];
    for (let y = start; y <= end; y++) this.years.push(y);
  }

 loadReport() {

  // 🔥 Ayın son gününü düzgün hesablamaq
  const lastDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();

  // Gün limitlərini düzəlt
  if (this.selectedDayFrom < 1) this.selectedDayFrom = 1;
  if (this.selectedDayTo > lastDayOfMonth) this.selectedDayTo = lastDayOfMonth;
  if (this.selectedDayTo < this.selectedDayFrom) this.selectedDayTo = this.selectedDayFrom;

  this.entryService.getByMonth(this.selectedYear, this.selectedMonth)
    .subscribe(entries => {

      const maxDays = lastDayOfMonth;

      const expenseData = new Array(maxDays).fill(0);
      const incomeData = new Array(maxDays).fill(0);

      const labels = Array.from({ length: maxDays }, (_, i) => (i + 1).toString());

      const dayFrom = this.selectedDayFrom - 1;
      const dayTo = this.selectedDayTo - 1;

      entries.forEach((e: any) => {
        const dayIndex = new Date(e.date).getDate() - 1;

        if (dayIndex < dayFrom || dayIndex > dayTo) return;

        if (e.type === 'expense') expenseData[dayIndex] += e.amount;
        else incomeData[dayIndex] += e.amount;
      });

      this.chartData = {
        labels: labels.slice(dayFrom, dayTo + 1),
        datasets: [
          {
            label: 'Expense',
            data: expenseData.slice(dayFrom, dayTo + 1),
            backgroundColor: '#f87171'
          },
          {
            label: 'Income',
            data: incomeData.slice(dayFrom, dayTo + 1),
            backgroundColor: '#34d399'
          }
        ]
      };
    });
}


onFilterChange() {
  this.updateDayLimits();
  this.loadReport();
}


  onChartTypeChange(type: ChartType) {
    this.chartType = type;
  }

  updateDayLimits() {
  const lastDay = new Date(this.selectedYear, this.selectedMonth, 0).getDate();

  if (this.selectedDayTo > lastDay) this.selectedDayTo = lastDay;
  if (this.selectedDayFrom > lastDay) this.selectedDayFrom = lastDay;

  if (this.selectedDayFrom < 1) this.selectedDayFrom = 1;
  if (this.selectedDayTo < this.selectedDayFrom) this.selectedDayTo = this.selectedDayFrom;
}

get lastDayOfMonth(): number {
  return new Date(this.selectedYear, this.selectedMonth, 0).getDate();
}

  
}
