import { Component, Input } from '@angular/core';
import { RamCharacter } from '../../models/ram.interface';

@Component({
  selector: 'app-ram-card',
  standalone: false,
  templateUrl: './ram-card.component.html',
  styleUrl: './ram-card.component.scss',
})
export class RamCardComponent {
  @Input() character: RamCharacter | null = null;
  public hasLoaded = false;
  public isFavorite = false;

  getImage()  {
    return this.character?.image;
  }

   onLoad() {
        this.hasLoaded = true;
    }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  getIconStyle() {
    return {
      'font-variation-settings': this.isFavorite ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      'color': this.isFavorite ? '#ffc107' : '#6c757d',
      'cursor': 'pointer',
      'user-select': 'none'
    };
  }

}
