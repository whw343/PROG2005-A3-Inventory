import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { helpCircle, close, informationCircle } from 'ionicons/icons';

/**
 * Help tip item displayed in the help modal
 */
export interface HelpTip {
  title: string;
  description: string;
  icon?: string;
}

/**
 * Reusable Help Widget component
 * Renders a FAB-style button that opens a modal with page-specific help tips
 *
 * Usage:
 * ```html
 * <app-help-widget [tips]="tips" pageTitle="Inventory List" />
 * ```
 */
@Component({
  selector: 'app-help-widget',
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
  ],
  templateUrl: './help-widget.component.html',
  styleUrls: ['./help-widget.component.scss'],
})
export class HelpWidgetComponent {
  /** Page title displayed in the modal header */
  @Input() pageTitle = 'Help';

  /** Array of help tips to display */
  @Input() tips: HelpTip[] = [];

  /** Whether the help modal is open */
  isHelpOpen = false;

  constructor() {
    addIcons({ helpCircle, close, informationCircle });
  }

  /** Open the help modal */
  openHelp(): void {
    this.isHelpOpen = true;
  }

  /** Close the help modal */
  closeHelp(): void {
    this.isHelpOpen = false;
  }
}
