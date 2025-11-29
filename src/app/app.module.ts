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



@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    EntryFormComponent,
    CategoryManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
