import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrencyListPageRoutingModule } from './currency-list-routing.module';

import { CurrencyListPage } from './currency-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrencyListPageRoutingModule
  ],
  declarations: [CurrencyListPage]
})
export class CurrencyListPageModule {}
