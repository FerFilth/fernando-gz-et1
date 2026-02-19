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
}
