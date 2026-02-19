import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { RamResponse } from '../models/ram.interface';

type Resource = 'character' | 'episodes' | 'locations';

export interface Paginator  {
  collectionSize: number;
  pageSize: number;
  page: number;
}
@Injectable({
  providedIn: 'root',
})
export class RamService {
  public resource: Resource = 'character';

  private pageSubject = new BehaviorSubject<number>(1);
  private searchSubject = new BehaviorSubject<string>('');
  private collectionSizeSubject = new BehaviorSubject<number>(0);
  public page$ = this.pageSubject.asObservable();
  public search$ = this.searchSubject.asObservable();
  public collectionSize$ = this.collectionSizeSubject.asObservable();

  private readonly FAVORITES_KEY = 'ram-favorites';
  private favoritesSubject = new BehaviorSubject<Set<number>>(
    this.loadFavorites(),
  );
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCharacters(
    page: number = 1,
    name: string = '',
  ): Observable<RamResponse | null> {
    return this.http
      .get<RamResponse | null>(
        `https://rickandmortyapi.com/api/${this.resource}?page=${page}&name=${name}`,
      )
      .pipe(catchError(() => of(null)));
  }

  /**
   * Combina page$ y search$ y cada vez que alguno cambia,
   * hace la petición correspondiente.
   */
  getCharactersCombined(): Observable<RamResponse | null> {
    return combineLatest([this.page$, this.search$]).pipe(
      switchMap(([page, name]) =>
        this.getCharacters(page, name).pipe(
          tap((response) => {
            if (response && response.info) {
              this.collectionSizeSubject.next(response.info.count);
            } else {
              this.collectionSizeSubject.next(0);
            }
          }),
        ),
      ),
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

  //#region FAVORITOS
  private loadFavorites(): Set<number> {
    const stored = localStorage.getItem(this.FAVORITES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }

  private saveFavorites(favorites: Set<number>): void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify([...favorites]));
    this.favoritesSubject.next(favorites);
  }

  toggleFavorite(characterId: number): void {
    const favorites = new Set(this.favoritesSubject.value);
    if (favorites.has(characterId)) {
      favorites.delete(characterId);
    } else {
      favorites.add(characterId);
    }
    this.saveFavorites(favorites);
  }

  isFavorite(characterId: number): boolean {
    return this.favoritesSubject.value.has(characterId);
  }

  getFavorites(): number[] {
    return [...this.favoritesSubject.value];
  }
  //#endregion FAVORITOS
}
