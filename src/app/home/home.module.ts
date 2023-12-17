import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TopContainerComponent } from './top-container/top-container.component';
import { BottomContainerComponent } from './bottom-container/bottom-container.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, TopContainerComponent, BottomContainerComponent],
})
export class HomePageModule {}
