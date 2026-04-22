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
import { InventoryItem, UpdateInventoryItem, ITEM_CATEGORIES, PROTECTED_ITEM_NAME } from '../models';
import { HelpTip } from '../components/help-widget/help-widget.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  categories = ITEM_CATEGORIES;
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
      description: 'Select an item from the list, modify the fields you want to change, then tap "Update Item". Only modified fields are sent to the API.',
      icon: 'create-outline',
    },
    {
      title: 'Deleting Items',
      description: 'Swipe left on any item to reveal the delete action. A confirmation dialog will appear before deletion.',
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
      itemName: item.itemName,
      itemCategory: item.itemCategory,
      itemQuantity: item.itemQuantity,
      itemPrice: item.itemPrice,
      featuredItem: item.featuredItem,
      specialNote: item.specialNote || '',
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

    if (this.editData.itemName !== undefined && !this.editData.itemName.trim()) {
      errs.push('Item name cannot be empty');
    }

    if (this.editData.itemQuantity !== undefined && (isNaN(this.editData.itemQuantity) || this.editData.itemQuantity < 0)) {
      errs.push('Quantity must be a non-negative number');
    }

    if (this.editData.itemPrice !== undefined && (isNaN(this.editData.itemPrice) || this.editData.itemPrice < 0)) {
      errs.push('Price must be a non-negative number');
    }

    return errs;
  }

  /** Submit update */
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

    if (this.editData.itemName !== undefined && this.editData.itemName !== original.itemName) {
      payload.itemName = this.editData.itemName.trim();
    }
    if (this.editData.itemCategory !== undefined && this.editData.itemCategory !== original.itemCategory) {
      payload.itemCategory = this.editData.itemCategory;
    }
    if (this.editData.itemQuantity !== undefined && this.editData.itemQuantity !== original.itemQuantity) {
      payload.itemQuantity = this.editData.itemQuantity;
    }
    if (this.editData.itemPrice !== undefined && this.editData.itemPrice !== original.itemPrice) {
      payload.itemPrice = this.editData.itemPrice;
    }
    if (this.editData.featuredItem !== undefined && this.editData.featuredItem !== original.featuredItem) {
      payload.featuredItem = this.editData.featuredItem;
    }
    if (this.editData.specialNote !== undefined && this.editData.specialNote !== (original.specialNote || '')) {
      payload.specialNote = this.editData.specialNote.trim() || undefined;
    }

    if (Object.keys(payload).length === 0) {
      this.errors = ['No changes detected'];
      this.isUpdating = false;
      return;
    }

    this.apiService.updateItem(this.selectedItem.itemId, payload).subscribe({
      next: (updated) => {
        this.successMessage = `Item "${updated.itemName}" updated successfully`;
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
    if (item.itemName === PROTECTED_ITEM_NAME) {
      this.errors = ['\'' + PROTECTED_ITEM_NAME + '\' items cannot be deleted (protected)'];
      return;
    }
    this.deleteTarget = item;
    this.showDeleteConfirm = true;
  }

  /** Execute delete */
  executeDelete(): void {
    if (!this.deleteTarget) return;

    this.isDeleting = true;
    this.apiService.deleteItem(this.deleteTarget.itemId).subscribe({
      next: () => {
        this.successMessage = `Item "${this.deleteTarget!.itemName}" deleted successfully`;
        if (this.selectedItem?.itemId === this.deleteTarget!.itemId) {
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
    return item.itemId;
  }
}
