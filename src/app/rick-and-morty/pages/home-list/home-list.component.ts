import { Component, OnInit } from '@angular/core';
import { RamService } from '../../services/ram.service';
import { Info, RamCharacter, RamResponse } from '../../models/ram.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-list',
  standalone: false,
  templateUrl: './home-list.component.html',
  styleUrl: './home-list.component.scss',
})
export class HomeListComponent implements OnInit {
  public characters: RamCharacter[] = [];
  private allCharacters: RamCharacter[] = [];
  public info: Info | null = null;
  private sub!: Subscription;
  private favoritesSub!: Subscription;
  public showOnlyFavorites = false;
  private favoriteIds: Set<number> = new Set();
  
  constructor(private _ramService: RamService) {}

  ngOnInit(): void {
    this.getCharacters();
    this.subscribeFavorites();
  }

  getCharacters() {
    this.sub = this._ramService
      .getCharactersCombined()
      .subscribe((data: RamResponse | null) => {
        if (data) {
          this.allCharacters = data.results;
          this.info = data.info;
          this.applyFilter();
        } else {
          this.allCharacters = [];
          this.characters = [];
          this.info = null;
        }
      });
  }

  subscribeFavorites() {
    this.favoritesSub = this._ramService.favorites$.subscribe(favorites => {
      this.favoriteIds = favorites;
      this.applyFilter();
    });
  }

  applyFilter() {
    if (this.showOnlyFavorites) {
      this.characters = this.allCharacters.filter(char => 
        this.favoriteIds.has(char.id)
      );
    } else {
      this.characters = this.allCharacters;
    }
  }

  toggleFavorite() {
    this.showOnlyFavorites = !this.showOnlyFavorites;
    this.applyFilter();
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
    this.favoritesSub?.unsubscribe();
  }
}
