import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  createOutline,
  trashOutline,
  closeOutline,
  checkmarkOutline,
  star,
  starOutline,
} from 'ionicons/icons';
import { ApiService } from '../services/api.service';
import { InventoryItem, UpdateInventoryItem, ITEM_CATEGORIES, STOCK_STATUSES, PROTECTED_ITEM_NAME } from '../models';
import { HelpTip } from '../components/help-widget/help-widget.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  categories = ITEM_CATEGORIES;
  stockStatuses = STOCK_STATUSES;
  protectedName = PROTECTED_ITEM_NAME;

  /** All items */
  items: InventoryItem[] = [];

  /** Currently selected item for editing */
  selectedItem: InventoryItem | null = null;

  /** Edit form data */
  editData: UpdateInventoryItem = {};

  /** Loading states */
  isLoading = false;
  isUpdating = false;
  isDeleting = false;

  /** Feedback messages */
  errors: string[] = [];
  successMessage = '';

  /** Delete confirmation */
  showDeleteConfirm = false;
  deleteTarget: InventoryItem | null = null;

  /** Help tips */
  helpTips: HelpTip[] = [
    {
      title: 'Updating Items',
      description: 'Select an item from the list, modify the fields you want to change, then tap "Update Item". The update uses the item name as the identifier.',
      icon: 'create-outline',
    },
    {
      title: 'Deleting Items',
      description: 'Swipe left on any item to reveal the delete action. A confirmation dialog will appear before deletion. Deletion uses the item name.',
      icon: 'trash-outline',
    },
    {
      title: 'Protected Items',
      description: 'Items named "' + PROTECTED_ITEM_NAME + '" cannot be deleted. This is a business rule to protect essential inventory.',
      icon: 'shield-checkmark-outline',
    },
    {
      title: 'Partial Updates',
      description: 'You do not need to fill in every field. Only the fields you change will be updated on the server.',
      icon: 'information-circle',
    },
  ];

  constructor(private apiService: ApiService) {
    addIcons({ createOutline, trashOutline, closeOutline, checkmarkOutline, star, starOutline });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading = true;
    this.apiService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false;
      },
      error: () => {
        this.items = [];
        this.isLoading = false;
      },
    });
  }

  /** Select an item for editing */
  selectItem(item: InventoryItem): void {
    this.selectedItem = item;
    this.editData = {
      item_name: item.item_name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      supplier_name: item.supplier_name,
      stock_status: item.stock_status,
      featured_item: item.featured_item,
      special_note: item.special_note || '',
    };
    this.errors = [];
    this.successMessage = '';
  }

  /** Cancel editing */
  cancelEdit(): void {
    this.selectedItem = null;
    this.editData = {};
    this.errors = [];
    this.successMessage = '';
  }

  /** Validate edit form */
  private validateEdit(): string[] {
    const errs: string[] = [];

    if (this.editData.item_name !== undefined && !this.editData.item_name.trim()) {
      errs.push('Item name cannot be empty');
    }

    if (this.editData.quantity !== undefined && (isNaN(this.editData.quantity) || this.editData.quantity < 0)) {
      errs.push('Quantity must be a non-negative number');
    }

    if (this.editData.price !== undefined && (isNaN(this.editData.price) || this.editData.price < 0)) {
      errs.push('Price must be a non-negative number');
    }

    return errs;
  }

  /** Submit update — uses item name as the resource identifier */
  onUpdate(): void {
    if (!this.selectedItem) return;

    this.errors = [];
    this.successMessage = '';

    const validationErrors = this.validateEdit();
    if (validationErrors.length > 0) {
      this.errors = validationErrors;
      return;
    }

    this.isUpdating = true;

    // Build payload with only changed fields
    const payload: UpdateInventoryItem = {};
    const original = this.selectedItem;

    if (this.editData.item_name !== undefined && this.editData.item_name !== original.item_name) {
      payload.item_name = this.editData.item_name.trim();
    }
    if (this.editData.category !== undefined && this.editData.category !== original.category) {
      payload.category = this.editData.category;
    }
    if (this.editData.quantity !== undefined && this.editData.quantity !== original.quantity) {
      payload.quantity = this.editData.quantity;
    }
    if (this.editData.price !== undefined && this.editData.price !== original.price) {
      payload.price = this.editData.price;
    }
    if (this.editData.supplier_name !== undefined && this.editData.supplier_name !== original.supplier_name) {
      payload.supplier_name = this.editData.supplier_name;
    }
    if (this.editData.stock_status !== undefined && this.editData.stock_status !== original.stock_status) {
      payload.stock_status = this.editData.stock_status;
    }
    if (this.editData.featured_item !== undefined && this.editData.featured_item !== original.featured_item) {
      payload.featured_item = this.editData.featured_item;
    }
    if (this.editData.special_note !== undefined && this.editData.special_note !== (original.special_note || '')) {
      payload.special_note = this.editData.special_note.trim() || undefined;
    }

    if (Object.keys(payload).length === 0) {
      this.errors = ['No changes detected'];
      this.isUpdating = false;
      return;
    }

    // Use the original item name as the URL parameter
    this.apiService.updateItem(original.item_name, payload).subscribe({
      next: () => {
        this.successMessage = `Item "${original.item_name}" updated successfully`;
        this.isUpdating = false;
        this.loadItems();
        this.selectedItem = null;
        this.editData = {};
      },
      error: (err) => {
        this.errors = [err.message || 'Failed to update item'];
        this.isUpdating = false;
      },
    });
  }

  /** Initiate delete (check protection) */
  confirmDelete(item: InventoryItem): void {
    if (item.item_name === PROTECTED_ITEM_NAME) {
      this.errors = ['\'' + PROTECTED_ITEM_NAME + '\' items cannot be deleted (protected)'];
      return;
    }
    this.deleteTarget = item;
    this.showDeleteConfirm = true;
  }

  /** Execute delete — uses item name as the resource identifier */
  executeDelete(): void {
    if (!this.deleteTarget) return;

    this.isDeleting = true;
    this.apiService.deleteItem(this.deleteTarget.item_name).subscribe({
      next: () => {
        this.successMessage = `Item "${this.deleteTarget!.item_name}" deleted successfully`;
        if (this.selectedItem?.item_id === this.deleteTarget!.item_id) {
          this.cancelEdit();
        }
        this.showDeleteConfirm = false;
        this.deleteTarget = null;
        this.isDeleting = false;
        this.loadItems();
      },
      error: (err) => {
        this.errors = [err.message || 'Failed to delete item'];
        this.showDeleteConfirm = false;
        this.deleteTarget = null;
        this.isDeleting = false;
      },
    });
  }

  /** Cancel delete */
  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deleteTarget = null;
  }

  /** Format price */
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  /** TrackBy */
  trackByItemId(_index: number, item: InventoryItem): number {
    return item.item_id;
  }
}
