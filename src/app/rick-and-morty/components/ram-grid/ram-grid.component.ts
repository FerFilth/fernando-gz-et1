import { Component, Input } from '@angular/core';
import { RamCharacter } from '../../models/ram.interface';

@Component({
  selector: 'app-ram-grid',
  standalone: false,
  templateUrl: './ram-grid.component.html',
  styleUrl: './ram-grid.component.scss',
})
export class RamGridComponent {
  @Input() characters: RamCharacter[] | null = null;
}
