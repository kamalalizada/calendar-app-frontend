import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntryCreateDto } from '../components/models/entry.model';

@Injectable({ providedIn: 'root' })
export class EntryService {
  private api = 'https://localhost:7038/api/Entry';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}`);
  }

  getByMonth(year: number, month: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/get-by-month/${year}/${month}`);
  }

  addEntry(dto: EntryCreateDto): Observable<any> {
    return this.http.post<any>(this.api, dto);
  }

  updateEntry(entryId: number, dto: EntryCreateDto): Observable<any> {
    return this.http.put<any>(`${this.api}?entryId=${entryId}`, dto);
  }

  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
