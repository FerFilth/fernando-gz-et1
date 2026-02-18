import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeListComponent } from './pages/home-list/home-list.component';

const routes: Routes = [{
  path: '',
  component: HomeListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RickAndMortyRoutingModule { }
