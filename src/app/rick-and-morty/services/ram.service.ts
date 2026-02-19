import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, Observable, of, switchMap } from 'rxjs';
import { RamResponse } from '../models/ram.interface';

type Resource = 'character' | 'episodes' | 'locations';
@Injectable({
  providedIn: 'root',
})
export class RamService {
  public resource: Resource = 'character';

  private pageSubject = new BehaviorSubject<number>(1);
  private searchSubject = new BehaviorSubject<string>('');

  page$ = this.pageSubject.asObservable();
  search$ = this.searchSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCharacters(
    page: number = 1,
    name: string = '',
  ): Observable<RamResponse | null> {
    return this.http
      .get<
        RamResponse | null
      >(`https://rickandmortyapi.com/api/${this.resource}?page=${page}&name=${name}`)
      .pipe(catchError(() => of(null)));
  }

  /**
   * Combina page$ y search$ y cada vez que alguno cambia,
   * hace la petición correspondiente.
   */
  getCharactersCombined(): Observable<RamResponse | null> {
    return combineLatest([this.page$, this.search$]).pipe(
      switchMap(([page, name]) => this.getCharacters(page, name)),
    );
  }

  setPage(page: number) {
    this.pageSubject.next(page);
  }

  setSearch(search: string) {
    // Cada vez que se busca, reseteamos a la página 1
    this.pageSubject.next(1);
    this.searchSubject.next(search);
  }
}
