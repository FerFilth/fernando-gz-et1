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
  public info: Info | null = null;
  private sub!: Subscription;
  constructor(private _ramService: RamService) {}

  ngOnInit(): void {
    this.getCharacters();
  }

  getCharacters() {
    this.sub = this._ramService
      .getCharactersCombined()
      .subscribe((data: RamResponse | null) => {
        if (data) {
          this.characters = data.results;
          this.info = data.info;
        } else {
          this.characters = [];
          this.info = null;
        }
      });
  }

  onSearch(searchTerm: string) {
    this._ramService.setSearch(searchTerm);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
