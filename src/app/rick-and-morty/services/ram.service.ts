import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
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
  ): Observable<RamResponse[] | null> {
    return this.http
      .get<
        RamResponse[] | null
      >(`https://rickandmortyapi.com/api/${this.resource}?page=${page}&name=${name}`)
      .pipe(catchError(() => of(null)));
  }


  setPage(page: number) {
    this.pageSubject.next(page);
  }

  setSearch(search: string) {
    this.searchSubject.next(search);
  }
}
