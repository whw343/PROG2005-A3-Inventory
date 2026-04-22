import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { of, throwError } from 'rxjs';

import { Tab2Page } from './tab2.page';
import { ApiService } from '../services/api.service';
import { InventoryItem } from '../models';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockCreatedItem: InventoryItem = {
    item_id: 42,
    item_name: 'Test Laptop',
    category: 'Electronics',
    quantity: 5,
    price: 999.99,
    supplier_name: 'Apple',
    stock_status: 'In stock',
    featured_item: 1,
    special_note: 'Test note',
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['createItem', 'getAllItems']);

    await TestBed.configureTestingModule({
      declarations: [Tab2Page],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiService.getAllItems.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form data', () => {
    expect(component.formData.item_name).toBe('');
    expect(component.formData.category).toBe('Electronics');
    expect(component.formData.quantity).toBe(0);
    expect(component.formData.price).toBe(0);
    expect(component.formData.featured_item).toBe(0);
    expect(component.formData.special_note).toBe('');
  });

  it('should initialize with no errors and no success message', () => {
    expect(component.errors.length).toBe(0);
    expect(component.successMessage).toBe('');
    expect(component.isSubmitting).toBe(false);
  });

  it('should have help tips defined', () => {
    expect(component.helpTips.length).toBeGreaterThan(0);
  });

  it('should validate empty item name', () => {
    component.formData.item_name = '   ';
    component.onSubmit();
    expect(component.errors).toContain('Item name is required');
    expect(apiService.createItem).not.toHaveBeenCalled();
  });

  it('should validate negative quantity', () => {
    component.formData.item_name = 'Valid Name';
    component.formData.quantity = -1;
    component.onSubmit();
    expect(component.errors).toContain('Quantity must be a non-negative number');
    expect(apiService.createItem).not.toHaveBeenCalled();
  });

  it('should validate negative price', () => {
    component.formData.item_name = 'Valid Name';
    component.formData.price = -10;
    component.onSubmit();
    expect(component.errors).toContain('Price must be a non-negative number');
    expect(apiService.createItem).not.toHaveBeenCalled();
  });

  it('should validate empty supplier name', () => {
    component.formData.item_name = 'Valid Name';
    component.formData.supplier_name = '   ';
    component.onSubmit();
    expect(component.errors).toContain('Supplier name is required');
    expect(apiService.createItem).not.toHaveBeenCalled();
  });

  it('should call apiService.createItem on valid form submission', () => {
    apiService.createItem.and.returnValue(of(mockCreatedItem));
    component.formData.item_name = 'Test Laptop';
    component.formData.category = 'Electronics';
    component.formData.quantity = 5;
    component.formData.price = 999.99;
    component.formData.supplier_name = 'Apple';
    component.formData.stock_status = 'In stock';
    component.formData.featured_item = 1;

    component.onSubmit();

    expect(apiService.createItem).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ item_name: 'Test Laptop' })
    );
  });

  it('should set success message after successful creation', () => {
    apiService.createItem.and.returnValue(of(mockCreatedItem));
    component.formData.item_name = 'Test Laptop';
    component.formData.quantity = 5;
    component.formData.price = 999.99;
    component.formData.supplier_name = 'Apple';

    component.onSubmit();

    expect(component.successMessage).toContain('Test Laptop');
    expect(component.successMessage).toContain('42');
    expect(component.errors.length).toBe(0);
  });

  it('should reset form after successful creation', () => {
    apiService.createItem.and.returnValue(of(mockCreatedItem));
    component.formData.item_name = 'Test Laptop';
    component.formData.quantity = 5;

    component.onSubmit();

    expect(component.formData.item_name).toBe('');
    expect(component.formData.quantity).toBe(0);
  });

  it('should handle API error on submission', () => {
    apiService.createItem.and.returnValue(throwError(() => new Error('Server error')));
    component.formData.item_name = 'Test';
    component.formData.quantity = 1;
    component.formData.price = 10;
    component.formData.supplier_name = 'Test';

    component.onSubmit();

    expect(component.errors.length).toBeGreaterThan(0);
    expect(component.isSubmitting).toBe(false);
  });

  it('should reset form and clear messages on resetForm()', () => {
    component.formData.item_name = 'Something';
    component.errors = ['Some error'];
    component.successMessage = 'Some success';

    component.resetForm();

    expect(component.formData.item_name).toBe('');
    expect(component.errors.length).toBe(0);
    expect(component.successMessage).toBe('');
  });

  it('should have categories defined', () => {
    expect(component.categories.length).toBeGreaterThan(0);
    expect(component.categories).toContain('Electronics');
  });

  it('should load featured items on init', () => {
    const allItems: InventoryItem[] = [
      { ...mockCreatedItem, featured_item: 1 },
      { ...mockCreatedItem, item_id: 43, item_name: 'Normal Item', featured_item: 0 },
    ];
    apiService.getAllItems.and.returnValue(of(allItems));

    component.ngOnInit();

    expect(apiService.getAllItems).toHaveBeenCalled();
  });

  it('should format price correctly', () => {
    expect(component.formatPrice(999.99)).toBe('$999.99');
  });

  it('should return correct stock color', () => {
    expect(component.getStockColor('In stock')).toBe('success');
    expect(component.getStockColor('Low stock')).toBe('warning');
    expect(component.getStockColor('Out of stock')).toBe('danger');
    expect(component.getStockColor('Unknown')).toBe('medium');
  });
});
