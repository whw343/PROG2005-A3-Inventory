import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  checkmarkOutline,
  closeOutline,
  star,
} from 'ionicons/icons';
import { ApiService } from '../services/api.service';
import { InventoryItem, CreateInventoryItem, ITEM_CATEGORIES, STOCK_STATUSES } from '../models';
import { HelpTip } from '../components/help-widget/help-widget.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  categories = ITEM_CATEGORIES;
  stockStatuses = STOCK_STATUSES;

  /** Form model */
  formData: CreateInventoryItem = this.emptyForm();

  /** Validation errors */
  errors: string[] = [];

  /** Submission state */
  isSubmitting = false;

  /** Success message after creation */
  successMessage = '';

  /** Featured items list */
  featuredItems: InventoryItem[] = [];

  /** Help tips */
  helpTips: HelpTip[] = [
    {
      title: 'Adding Items',
      description: 'Fill in all required fields to create a new inventory item. The server auto-generates the item ID.',
      icon: 'add-circle-outline',
    },
    {
      title: 'Required Fields',
      description: 'Item Name, Category, Quantity, Price, Supplier, and Stock Status are required. Special Note is optional.',
      icon: 'information-circle',
    },
    {
      title: 'Featured Items',
      description: 'Toggle "Featured" to mark items as highlighted. Featured items appear with a star badge in the inventory list and below the form.',
      icon: 'star-outline',
    },
    {
      title: 'Validation',
      description: 'Name must not be empty. Quantity and Price must be non-negative numbers.',
      icon: 'checkmark-circle-outline',
    },
  ];

  constructor(private apiService: ApiService) {
    addIcons({ checkmarkOutline, closeOutline, star });
  }

  ngOnInit(): void {
    this.loadFeaturedItems();
  }

  /** Load featured items for display below the form */
  loadFeaturedItems(): void {
    this.apiService.getAllItems().subscribe({
      next: (data) => {
        this.featuredItems = data.filter((i) => i.featured_item === 1);
      },
      error: () => {
        this.featuredItems = [];
      },
    });
  }

  private emptyForm(): CreateInventoryItem {
    return {
      item_name: '',
      category: 'Electronics',
      quantity: 0,
      price: 0,
      supplier_name: '',
      stock_status: 'In stock',
      featured_item: 0,
      special_note: '',
    };
  }

  /** Validate form and return errors */
  private validate(): string[] {
    const errs: string[] = [];

    if (!this.formData.item_name.trim()) {
      errs.push('Item name is required');
    }

    if (isNaN(this.formData.quantity) || this.formData.quantity < 0) {
      errs.push('Quantity must be a non-negative number');
    }

    if (isNaN(this.formData.price) || this.formData.price < 0) {
      errs.push('Price must be a non-negative number');
    }

    if (!this.formData.category) {
      errs.push('Category is required');
    }

    if (!this.formData.supplier_name.trim()) {
      errs.push('Supplier name is required');
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
      item_name: this.formData.item_name.trim(),
      category: this.formData.category,
      quantity: this.formData.quantity,
      price: this.formData.price,
      supplier_name: this.formData.supplier_name.trim(),
      stock_status: this.formData.stock_status,
      featured_item: this.formData.featured_item,
      special_note: this.formData.special_note?.trim() || undefined,
    };

    this.apiService.createItem(payload).subscribe({
      next: (created) => {
        this.successMessage = `Item "${created.item_name}" created successfully (ID: ${created.item_id})`;
        this.formData = this.emptyForm();
        this.isSubmitting = false;
        this.loadFeaturedItems();
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

  /** Format price as AUD */
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  /** Stock status to badge color */
  getStockColor(status: string): string {
    switch (status) {
      case 'In stock': return 'success';
      case 'Low stock': return 'warning';
      case 'Out of stock': return 'danger';
      default: return 'medium';
    }
  }

  /** TrackBy */
  trackByItemId(_index: number, item: InventoryItem): number {
    return item.item_id;
  }
}
