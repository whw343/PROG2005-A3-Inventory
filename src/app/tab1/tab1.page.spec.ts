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
      itemId: 1,
      itemName: 'Laptop Pro',
      itemCategory: 'Laptop',
      itemQuantity: 10,
      itemPrice: 1299.99,
      featuredItem: 1,
      specialNote: '',
    },
    {
      itemId: 2,
      itemName: 'Wireless Mouse',
      itemCategory: 'Mouse',
      itemQuantity: 50,
      itemPrice: 29.99,
      featuredItem: 0,
      specialNote: '',
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
    expect(component.items[0].itemName).toBe('Laptop Pro');
  });

  it('should filter items by search term', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    component.searchTerm = 'laptop';
    component.applyFilters();

    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].itemName).toBe('Laptop Pro');
  });

  it('should filter items by category', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    component.selectedCategory = 'Mouse';
    component.applyFilters();

    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].itemCategory).toBe('Mouse');
  });

  it('should filter featured items only', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    component.featuredFilter = 'featured';
    component.applyFilters();

    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].featuredItem).toBe(1);
  });

  it('should handle API error gracefully', () => {
    apiService.getAllItems.and.returnValue(throwError(() => new Error('Network error')));
    fixture.detectChanges();

    expect(component.items.length).toBe(0);
    expect(component.errorMessage).toBeTruthy();
  });

  it('should track items by itemId', () => {
    expect(component.trackByItemId(0, mockItems[0])).toBe(1);
    expect(component.trackByItemId(1, mockItems[1])).toBe(2);
  });

  it('should have help tips defined', () => {
    expect(component.helpTips.length).toBeGreaterThan(0);
  });
});
