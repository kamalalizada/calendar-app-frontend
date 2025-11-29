import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone:false
})
export class AppComponent {
  protected readonly title = signal('noteCalendarUI');
}
