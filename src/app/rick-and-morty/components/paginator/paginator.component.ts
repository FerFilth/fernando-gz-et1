import { Component, OnInit } from '@angular/core';
import { RamService } from '../../services/ram.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-paginator',
  standalone: false,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent implements OnInit {
  public totalItems = 0;
  public pageSize = 20;
  public page = 1;

  private subs = new Subscription();

  constructor(private _ramService: RamService) {}

  ngOnInit(): void {
    // Escuchar cambios en la página desde el servicio
    this.subs.add(
      this._ramService.page$.subscribe((page) => {
        this.page = page;
      }),
    );

    // Escuchar el tamaño total de la colección
    this.subs.add(
      this._ramService.collectionSize$.subscribe((size) => {
        this.totalItems = size;
      }),
    );
  }

  onPageChange(page: number): void {
    this._ramService.setPage(page);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
