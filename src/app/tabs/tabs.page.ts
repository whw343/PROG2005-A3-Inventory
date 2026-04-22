import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  listOutline,
  addCircleOutline,
  createOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {
  constructor() {
    addIcons({
      listOutline,
      addCircleOutline,
      createOutline,
      shieldCheckmarkOutline,
    });
  }
}
