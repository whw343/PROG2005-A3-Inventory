import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { of, throwError } from 'rxjs';

import { Tab1Page } from './tab1.page';
import { ApiService } from '../services/api.service';
import { InventoryItem } from '../models';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockItems: InventoryItem[] = [
    {
      item_id: 1,
      item_name: 'Laptop Pro',
      category: 'Electronics',
      quantity: 10,
      price: 1299.99,
      supplier_name: 'Apple',
      stock_status: 'In stock',
      featured_item: 1,
      special_note: '',
    },
    {
      item_id: 2,
      item_name: 'Wireless Mouse',
      category: 'Electronics',
      quantity: 50,
      price: 29.99,
      supplier_name: 'Logitech',
      stock_status: 'In stock',
      featured_item: 0,
      special_note: '',
    },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getAllItems']);

    await TestBed.configureTestingModule({
      declarations: [Tab1Page],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load items from API on init', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();
    expect(component.items.length).toBe(2);
    expect(component.items[0].item_name).toBe('Laptop Pro');
  });

  it('should filter items by search term', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    component.searchTerm = 'laptop';
    component.applyFilters();

    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].item_name).toBe('Laptop Pro');
  });

  it('should filter items by category', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    component.selectedCategory = 'Electronics';
    component.applyFilters();

    expect(component.filteredItems.length).toBe(2);
  });

  it('should filter featured items only', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    component.featuredFilter = 'featured';
    component.applyFilters();

    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].featured_item).toBe(1);
  });

  it('should handle API error gracefully', () => {
    apiService.getAllItems.and.returnValue(throwError(() => new Error('Network error')));
    fixture.detectChanges();

    expect(component.items.length).toBe(0);
  });

  it('should track items by item_id', () => {
    expect(component.trackByItemId(0, mockItems[0])).toBe(1);
    expect(component.trackByItemId(1, mockItems[1])).toBe(2);
  });

  it('should have help tips defined', () => {
    expect(component.helpTips.length).toBeGreaterThan(0);
  });

  it('should format price correctly', () => {
    expect(component.formatPrice(1299.99)).toBe('$1299.99');
    expect(component.formatPrice(0)).toBe('$0.00');
  });

  it('should detect active filters', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    expect(component.hasActiveFilters).toBeFalse();

    component.searchTerm = 'test';
    expect(component.hasActiveFilters).toBeTrue();

    component.searchTerm = '';
    component.selectedCategory = 'Electronics';
    expect(component.hasActiveFilters).toBeTrue();

    component.selectedCategory = '';
    component.featuredFilter = 'featured';
    expect(component.hasActiveFilters).toBeTrue();
  });
});
