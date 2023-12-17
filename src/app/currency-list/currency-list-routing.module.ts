import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrencyListPage } from './currency-list.page';

const routes: Routes = [
  {
    path: '',
    component: CurrencyListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrencyListPageRoutingModule {}
