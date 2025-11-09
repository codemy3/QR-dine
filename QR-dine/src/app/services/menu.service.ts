import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface MenuItem {
  _id?: string;
  category: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:5000/api/menu';
  private refreshNeeded$ = new Subject<void>(); // 👈 new line

  get refreshNeeded() {
    return this.refreshNeeded$;
  }

  constructor(private http: HttpClient) {}

  getItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl);
  }

  addItem(itemData: FormData): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.apiUrl, itemData);
  }

  deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateItem(id: string, itemData: FormData): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/${id}`, itemData);
  }

  // 👇 Trigger refresh manually when an update occurs
  triggerRefresh() {
    this.refreshNeeded$.next();
  }
}
