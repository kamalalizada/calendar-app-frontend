import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
})
export class AppComponent {
  title = 'noteCalendarUI';
  reportOpen = false;

  openReport() {
    this.reportOpen = true;
  }

  closeReport() {
    this.reportOpen = false;
  }
}
