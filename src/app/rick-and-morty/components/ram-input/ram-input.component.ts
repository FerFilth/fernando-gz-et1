import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-ram-input',
  standalone: false,
  templateUrl: './ram-input.component.html',
  styleUrl: './ram-input.component.scss',
})
export class RamInputComponent implements OnInit, OnChanges, OnDestroy {
  @Output() item = new EventEmitter<string>();
  @Input() isLoading = false;
  
  public searchControl = new FormControl('');
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(400), //espera 500ms para reducir peticiones
        distinctUntilChanged() // solo emite si el valor cambió
      )
      .subscribe((value) => {
        if (!this.isLoading) {
          this.item.emit(value || '');
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['isLoading'] && changes['isLoading'].currentValue) {
      this.searchControl.disable({ emitEvent: false });
    } else {
      this.searchControl.enable({ emitEvent: false });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
