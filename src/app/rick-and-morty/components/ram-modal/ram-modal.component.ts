import { Component, Input } from '@angular/core';
import { RamCharacter } from '../../models/ram.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ram-modal',
  standalone: false,
  templateUrl: './ram-modal.component.html',
  styleUrl: './ram-modal.component.scss',
})
export class RamModalComponent {
  @Input() character!: RamCharacter;

  constructor(public activeModal: NgbActiveModal) {}

 
}
