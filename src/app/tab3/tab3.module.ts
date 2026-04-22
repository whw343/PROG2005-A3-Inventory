import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { HelpWidgetComponent } from '../components/help-widget/help-widget.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HelpWidgetComponent,
    Tab3PageRoutingModule
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
