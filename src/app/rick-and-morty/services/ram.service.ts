import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { RamResponse } from '../models/ram.interface';

type Resource = 'character' | 'episodes' | 'locations';
@Injectable({
  providedIn: 'root',
})
export class RamService {
  public resource: Resource = 'character';

  constructor(private http: HttpClient) {}

  getCharacters(): Observable<RamResponse[]  | null> {
    return this.http
      .get<RamResponse[] | null>(`https://rickandmortyapi.com/api/${this.resource}`)
      .pipe(catchError(() => of(null)));
  }
}
