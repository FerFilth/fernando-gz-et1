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
  public currentPage = 1;
  private sub!: Subscription;
  constructor(private _ramService: RamService) {}

  ngOnInit(): void {
    this.getCharacters();
  }

  getCharacters() {
    this.sub = this._ramService
      .getCharacters()
      .subscribe((data: RamResponse | null) => {
        if (data) {
          this.characters = data.results;
          this.info = data.info;
        } else {
          this.characters = [];
          this.info = null;
        }
        this._ramService.page$.subscribe((page) => (this.currentPage = page));
      });
  }

  nextPage(): void {
    if (this.info?.next) {
      this._ramService.setPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.info?.prev) {
      this._ramService.setPage(this.currentPage - 1);
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
