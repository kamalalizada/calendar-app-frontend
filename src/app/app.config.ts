import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from './components/calendar/calendar';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, HttpClientModule, FormsModule),
    provideRouter([
      { path: '', redirectTo: '/calendar', pathMatch: 'full' },
      { path: 'calendar', component: CalendarComponent },
      { path: '**', redirectTo: '/calendar' }
    ])
  ]
};
