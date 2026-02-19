import { Component, OnInit } from '@angular/core';
import { RamService } from '../../services/ram.service';
import { RamResponse } from '../../models/ram.interface';

@Component({
  selector: 'app-home-list',
  standalone: false,
  templateUrl: './home-list.component.html',
  styleUrl: './home-list.component.scss',
})
export class HomeListComponent implements OnInit {
  public characters: RamResponse[] | null = null;

  constructor(private _ramService: RamService) {}

  ngOnInit(): void {
    this.getCharacters();
  }

  
  getCharacters() {
    this._ramService.getCharacters().subscribe((data: RamResponse[] | null) => {
      this.characters = data;
    });
  }
}
