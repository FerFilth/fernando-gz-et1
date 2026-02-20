import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { RamService } from '../../services/ram.service';
import { Info, RamCharacter, RamResponse } from '../../models/ram.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-list',
  standalone: false,
  templateUrl: './home-list.component.html',
  styleUrl: './home-list.component.scss',
})
export class HomeListComponent implements OnInit, OnDestroy {
  public characters: RamCharacter[] = [];
  public info: Info | null = null;
  public showOnlyFavorites = false;
  public isLoading = false;

  private sub!: Subscription;
  private loadingSub!: Subscription;

  constructor(private _ramService: RamService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getCharacters();
    this.subscribeLoading();
  }

  getCharacters() {
    this.sub = this._ramService
      .getCharactersCombined()
      .subscribe((data: RamResponse | null) => {
        if (data) {
          this.characters = structuredClone(data.results);
          this.info = structuredClone(data.info);
          console.log('Characters updated:', this.characters);
        } else {
          console.log('No data received');
          this.characters = structuredClone([]);
          this.info = structuredClone(null);
        }
        // Forzar detección 
        try {
          this.cdr.detectChanges();
        } catch (e) {
          
          console.warn('detectChanges falló:', e);
        }
      });
  }

  subscribeLoading() {
    this.loadingSub = this._ramService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  toggleFavorite() {
    this.showOnlyFavorites = !this.showOnlyFavorites;
    this._ramService.setFavoriteMode(this.showOnlyFavorites);
  }

  getIconStyle() {
    return {
      'font-variation-settings': this.showOnlyFavorites
        ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
        : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      color: this.showOnlyFavorites ? '#ffc107' : '#6c757d',
      cursor: 'pointer',
      'user-select': 'none',
    };
  }

  onSearch(searchTerm: string) {
    this._ramService.setSearch(searchTerm);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.loadingSub?.unsubscribe();
  }
}
