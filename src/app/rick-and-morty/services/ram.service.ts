import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, debounceTime, delay, map, Observable, of, switchMap, tap } from 'rxjs';
import { RamCharacter, RamResponse } from '../models/ram.interface';

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
  private readonly PAGE_SIZE = 20;
  private readonly FAVORITES_KEY = 'ram-favorites';

  private pageSubject = new BehaviorSubject<number>(1);
  private searchSubject = new BehaviorSubject<string>('');
  private collectionSizeSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private favoriteModeSubject = new BehaviorSubject<boolean>(false);

  public page$ = this.pageSubject.asObservable();
  public search$ = this.searchSubject.asObservable();
  public collectionSize$ = this.collectionSizeSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public favoriteMode$ = this.favoriteModeSubject.asObservable();

  private favoritesSubject = new BehaviorSubject<Set<number>>(
    this.loadFavorites(),
  );
  public favorites$ = this.favoritesSubject.asObservable();

  /* cache de personajes favoritos para búsqueda local */
  private favoritesCache: RamCharacter[] = [];
  private favoritesCacheKey = '';

  constructor(private http: HttpClient) {}

  getCharacters(
    page: number = 1,
    name: string = '',
  ): Observable<RamResponse | null> {
    return this.http
      .get<RamResponse | null>(
        `https://rickandmortyapi.com/api/${this.resource}?page=${page}&name=${name}`,
      )
      .pipe(
      
        catchError(() => of(null)),
      );
  }

  /**
   * obtiene personajes por un array de IDs
   * si es un solo ID, la API retorna un objeto, no un array.
   */
  getCharactersByIds(ids: number[]): Observable<RamCharacter[]> {
    if (ids.length === 0) return of([]);
    return this.http
      .get<RamCharacter[]>(
        `https://rickandmortyapi.com/api/character/${[...ids].join(',')}`,
      )
      .pipe(catchError(() => of([])));
  }

  /**
   * combina page$, search$, favoriteMode$ y favorites$.
   * modo normal: petición paginada a la API con búsqueda.
   * modo favoritos: obtiene los IDs favoritos, pagina del
   * lado del cliente y solo pide al API los IDs de la página actual.
   */
  getCharactersCombined(): Observable<RamResponse | null> {
    return combineLatest([
      this.page$,
      this.search$,
      this.favoriteMode$,
      this.favorites$,
    ]).pipe(
      debounceTime(300),
      tap(() => this.loadingSubject.next(true)),
      switchMap(([page, name, isFavoriteMode, favoriteIds]) => {
        if (isFavoriteMode) {
          return this.fetchFavorites(page, name, favoriteIds);
        }
        return this.getCharacters(page, name).pipe(
          tap((response) => {
            if (response && response.info) {
              this.collectionSizeSubject.next(response.info.count);
            } else {
              this.collectionSizeSubject.next(0);
            }
            this.loadingSubject.next(false);
          }),
          catchError(() => {
            this.loadingSubject.next(false);
            return of(null);
          }),
        );
      }),
    );
  }

  /**
   * obtiene todos los personajes favoritos, los cachea, filtra por nombre
   * localmente y pagina del lado del cliente.
   * solo vuelve a pedir al API si los IDs favoritos cambiaron.
   */
  private fetchFavorites(
    page: number,
    search: string,
    favoriteIds: Set<number>,
  ): Observable<RamResponse | null> {
    const ids = [...favoriteIds];
    if (ids.length === 0) {
      this.collectionSizeSubject.next(0);
      this.loadingSubject.next(false);
      return of(null);
    }

    const cacheKey = [...ids].sort((a, b) => a - b).join(',');
    //si los IDs no cambiaron, usar cache, si no pedir al API
    const source$ =
      cacheKey === this.favoritesCacheKey && this.favoritesCache.length > 0
        ? of(this.favoritesCache)
        : this.getCharactersByIds(ids).pipe(
            tap((chars) => {
              this.favoritesCache = chars;
              this.favoritesCacheKey = cacheKey;
            }),
          );

    return source$.pipe(
      map((allCharacters) => {
        // Filtrar por búsqueda local (nombre)
        const filtered = search
          ? allCharacters.filter((c) =>
              c.name.toLowerCase().includes(search.toLowerCase()),
            )
          : allCharacters;

        const totalCount = filtered.length;
        const totalPages = Math.ceil(totalCount / this.PAGE_SIZE);
        const start = (page - 1) * this.PAGE_SIZE;
        const end = start + this.PAGE_SIZE;
        const pageResults = filtered.slice(start, end);

        return {
          info: {
            count: totalCount,
            pages: totalPages,
            next: page < totalPages ? `page=${page + 1}` : '',
            prev: page > 1 ? `page=${page - 1}` : null,
          },
          results: pageResults,
        } as RamResponse;
      }),
      tap((response) => {
        this.collectionSizeSubject.next(response.info.count);
        this.loadingSubject.next(false);
      }),
      catchError(() => {
        this.loadingSubject.next(false);
        return of(null);
      }),
    );
  }

  setPage(page: number) {
    this.pageSubject.next(page);
  }

  setSearch(search: string) {
    this.pageSubject.next(1);// cada busqueda resetea a la página 1
    this.searchSubject.next(search);
  }

  setFavoriteMode(active: boolean) {
    this.favoriteModeSubject.next(active);
    this.pageSubject.next(1);
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
    // invalidar cache para que se re-fetch con los nuevos IDs
    this.favoritesCacheKey = '';
    this.favoritesCache = [];
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
