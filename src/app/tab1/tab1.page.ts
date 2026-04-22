import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  refreshOutline,
  searchOutline,
  starOutline,
  star,
  funnelOutline,
  closeOutline,
} from 'ionicons/icons';
import { ApiService } from '../services/api.service';
import { InventoryItem, ITEM_CATEGORIES } from '../models';
import { HelpTip } from '../components/help-widget/help-widget.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  /** Full list from API */
  items: InventoryItem[] = [];

  /** Filtered result for display */
  filteredItems: InventoryItem[] = [];

  /** Loading state */
  isLoading = false;

  /** Search term */
  searchTerm = '';

  /** Category filter */
  selectedCategory = '';

  /** Featured filter */
  featuredFilter: 'all' | 'featured' | 'normal' = 'all';

  /** Available categories */
  categories = ITEM_CATEGORIES;

  /** Show filter panel */
  showFilters = false;

  /** Help tips for this page */
  helpTips: HelpTip[] = [
    {
      title: 'Viewing Items',
      description: 'All inventory items are loaded from the API on page entry. Pull down to refresh the list.',
      icon: 'list-outline',
    },
    {
      title: 'Searching',
      description: 'Use the search bar to filter items by name. Search is case-insensitive.',
      icon: 'search-outline',
    },
    {
      title: 'Category Filter',
      description: 'Tap the filter icon to reveal category and featured filters. Combine them for precise results.',
      icon: 'funnel-outline',
    },
    {
      title: 'Featured Items',
      description: 'Items with a star badge are featured items. Filter to see only featured or normal items.',
      icon: 'star-outline',
    },
  ];

  constructor(private apiService: ApiService) {
    addIcons({ refreshOutline, searchOutline, starOutline, star, funnelOutline, closeOutline });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  /** Load all items from API */
  loadItems(): void {
    this.isLoading = true;
    this.apiService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[Tab1] Failed to load items:', err.message);
        this.items = [];
        this.filteredItems = [];
        this.isLoading = false;
      },
    });
  }

  /** Pull-to-refresh handler */
  handleRefresh(event: CustomEvent): void {
    this.apiService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
        this.applyFilters();
        (event.target as HTMLIonRefresherElement).complete();
      },
      error: () => {
        (event.target as HTMLIonRefresherElement).complete();
      },
    });
  }

  /** Apply all active filters */
  applyFilters(): void {
    let result = [...this.items];

    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter((item) =>
        item.item_name.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      result = result.filter((item) => item.category === this.selectedCategory);
    }

    // Featured filter
    if (this.featuredFilter === 'featured') {
      result = result.filter((item) => item.featured_item === 1);
    } else if (this.featuredFilter === 'normal') {
      result = result.filter((item) => item.featured_item === 0);
    }

    this.filteredItems = result;
  }

  /** Toggle filter panel visibility */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  /** Reset all filters */
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.featuredFilter = 'all';
    this.applyFilters();
  }

  /** Check if any filter is active */
  get hasActiveFilters(): boolean {
    return !!this.searchTerm.trim() || !!this.selectedCategory || this.featuredFilter !== 'all';
  }

  /** Format price as AUD */
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  /** Category to color mapping for badges */
  private categoryColorMap: Record<string, string> = {
    Electronics: 'primary',
    Furniture: 'secondary',
    Tools: 'tertiary',
    'Office Supplies': 'success',
    Software: 'warning',
    Other: 'medium',
  };

  getCategoryColor(category: string): string {
    return this.categoryColorMap[category] || 'medium';
  }

  /** TrackBy for ngFor optimization */
  trackByItemId(_index: number, item: InventoryItem): number {
    return item.item_id;
  }
}
