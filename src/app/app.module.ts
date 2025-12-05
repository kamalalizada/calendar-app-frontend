import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routes';
import { EntryFormComponent } from './components/entry-form/entry-form';
import { AppComponent } from './app';
import { CalendarComponent } from './components/calendar/calendar';
import { CategoryManagerComponent } from './components/category-manager/category-manager';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './components/settings/settings';
import { ReportComponent } from './components/report/report';
import { NgChartsModule } from 'ng2-charts';




@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    EntryFormComponent,
    CategoryManagerComponent,
    SettingsComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
