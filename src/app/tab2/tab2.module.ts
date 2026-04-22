import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { HelpWidgetComponent } from '../components/help-widget/help-widget.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HelpWidgetComponent,
    Tab2PageRoutingModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
