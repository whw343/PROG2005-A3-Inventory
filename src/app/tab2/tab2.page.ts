import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  checkmarkOutline,
  closeOutline,
} from 'ionicons/icons';
import { ApiService } from '../services/api.service';
import { CreateInventoryItem, ITEM_CATEGORIES } from '../models';
import { HelpTip } from '../components/help-widget/help-widget.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  categories = ITEM_CATEGORIES;

  /** Form model */
  formData: CreateInventoryItem = this.emptyForm();

  /** Validation errors */
  errors: string[] = [];

  /** Submission state */
  isSubmitting = false;

  /** Success message after creation */
  successMessage = '';

  /** Help tips */
  helpTips: HelpTip[] = [
    {
      title: 'Adding Items',
      description: 'Fill in all required fields to create a new inventory item. The server auto-generates the item ID.',
      icon: 'add-circle-outline',
    },
    {
      title: 'Required Fields',
      description: 'Item Name, Category, Quantity, Price, and Featured status are required. Special Note is optional.',
      icon: 'information-circle',
    },
    {
      title: 'Featured Items',
      description: 'Toggle "Featured" to mark items as highlighted. Featured items appear with a star badge in the inventory list.',
      icon: 'star-outline',
    },
    {
      title: 'Validation',
      description: 'Name must not be empty. Quantity and Price must be non-negative numbers.',
      icon: 'checkmark-circle-outline',
    },
  ];

  constructor(private apiService: ApiService) {
    addIcons({ checkmarkOutline, closeOutline });
  }

  private emptyForm(): CreateInventoryItem {
    return {
      itemName: '',
      itemCategory: 'Laptop',
      itemQuantity: 0,
      itemPrice: 0,
      featuredItem: 0,
      specialNote: '',
    };
  }

  /** Validate form and return errors */
  private validate(): string[] {
    const errs: string[] = [];

    if (!this.formData.itemName.trim()) {
      errs.push('Item name is required');
    }

    if (isNaN(this.formData.itemQuantity) || this.formData.itemQuantity < 0) {
      errs.push('Quantity must be a non-negative number');
    }

    if (isNaN(this.formData.itemPrice) || this.formData.itemPrice < 0) {
      errs.push('Price must be a non-negative number');
    }

    if (!this.formData.itemCategory) {
      errs.push('Category is required');
    }

    return errs;
  }

  /** Submit the form */
  onSubmit(): void {
    this.errors = [];
    this.successMessage = '';

    const validationErrors = this.validate();
    if (validationErrors.length > 0) {
      this.errors = validationErrors;
      return;
    }

    this.isSubmitting = true;

    const payload: CreateInventoryItem = {
      itemName: this.formData.itemName.trim(),
      itemCategory: this.formData.itemCategory,
      itemQuantity: this.formData.itemQuantity,
      itemPrice: this.formData.itemPrice,
      featuredItem: this.formData.featuredItem,
      specialNote: this.formData.specialNote?.trim() || undefined,
    };

    this.apiService.createItem(payload).subscribe({
      next: (created) => {
        this.successMessage = `Item "${created.itemName}" created successfully (ID: ${created.itemId})`;
        this.formData = this.emptyForm();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errors = [err.message || 'Failed to create item'];
        this.isSubmitting = false;
      },
    });
  }

  /** Reset the form */
  resetForm(): void {
    this.formData = this.emptyForm();
    this.errors = [];
    this.successMessage = '';
  }
}
