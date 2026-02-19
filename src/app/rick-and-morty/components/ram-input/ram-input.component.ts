import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ram-input',
  standalone: false,
  templateUrl: './ram-input.component.html',
  styleUrl: './ram-input.component.scss',
})
export class RamInputComponent {
  @Output() item = new EventEmitter<string>();
  search(item: string) {
    this.item.emit(item);
  }
}
