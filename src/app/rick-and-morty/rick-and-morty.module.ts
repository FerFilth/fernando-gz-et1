import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RickAndMortyRoutingModule } from './rick-and-morty-routing.module';
import { HomeListComponent } from './pages/home-list/home-list.component';
import { RamCardComponent } from './components/ram-card/ram-card.component';
import { RamGridComponent } from './components/ram-grid/ram-grid.component';
import { RamModalComponent } from './components/ram-modal/ram-modal.component';
import { RamInputComponent } from './components/ram-input/ram-input.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    RamCardComponent,
    RamModalComponent,
    HomeListComponent,
    RamGridComponent,
    RamInputComponent,
    PaginatorComponent,
  ],
  imports: [CommonModule, RickAndMortyRoutingModule, NgbModule, ReactiveFormsModule],
})
export class RickAndMortyModule {}
