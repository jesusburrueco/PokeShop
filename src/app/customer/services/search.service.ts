import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchQuery = new BehaviorSubject<string>(''); // Almacena la cadena de búsqueda
  searchQuery$ = this.searchQuery.asObservable(); // Observable para escuchar los cambios

  constructor() {}

  setSearchQuery(query: string) {
    this.searchQuery.next(query);
  }
}