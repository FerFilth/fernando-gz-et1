import { Component, Input } from '@angular/core';
import { RamResponse } from '../../models/ram.interface';

@Component({
  selector: 'app-ram-grid',
  standalone: false,
  templateUrl: './ram-grid.component.html',
  styleUrl: './ram-grid.component.scss',
})
export class RamGridComponent {
  @Input() characters: RamResponse[] | null = null;
}
