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
    itemId: 42,
    itemName: 'Test Laptop',
    itemCategory: 'Laptop',
    itemQuantity: 5,
    itemPrice: 999.99,
    featuredItem: 1,
    specialNote: 'Test note',
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['createItem']);

    await TestBed.configureTestingModule({
      declarations: [Tab2Page],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form data', () => {
    expect(component.formData.itemName).toBe('');
    expect(component.formData.itemCategory).toBe('Laptop');
    expect(component.formData.itemQuantity).toBe(0);
    expect(component.formData.itemPrice).toBe(0);
    expect(component.formData.featuredItem).toBe(0);
    expect(component.formData.specialNote).toBe('');
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
    component.formData.itemName = '   ';
    component.onSubmit();
    expect(component.errors).toContain('Item name is required');
    expect(apiService.createItem).not.toHaveBeenCalled();
  });

  it('should validate negative quantity', () => {
    component.formData.itemName = 'Valid Name';
    component.formData.itemQuantity = -1;
    component.onSubmit();
    expect(component.errors).toContain('Quantity must be a non-negative number');
    expect(apiService.createItem).not.toHaveBeenCalled();
  });

  it('should validate negative price', () => {
    component.formData.itemName = 'Valid Name';
    component.formData.itemPrice = -10;
    component.onSubmit();
    expect(component.errors).toContain('Price must be a non-negative number');
    expect(apiService.createItem).not.toHaveBeenCalled();
  });

  it('should call apiService.createItem on valid form submission', () => {
    apiService.createItem.and.returnValue(of(mockCreatedItem));
    component.formData.itemName = 'Test Laptop';
    component.formData.itemCategory = 'Laptop';
    component.formData.itemQuantity = 5;
    component.formData.itemPrice = 999.99;
    component.formData.featuredItem = 1;

    component.onSubmit();

    expect(apiService.createItem).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ itemName: 'Test Laptop' })
    );
  });

  it('should set success message after successful creation', () => {
    apiService.createItem.and.returnValue(of(mockCreatedItem));
    component.formData.itemName = 'Test Laptop';
    component.formData.itemQuantity = 5;
    component.formData.itemPrice = 999.99;

    component.onSubmit();

    expect(component.successMessage).toContain('Test Laptop');
    expect(component.successMessage).toContain('42');
    expect(component.errors.length).toBe(0);
  });

  it('should reset form after successful creation', () => {
    apiService.createItem.and.returnValue(of(mockCreatedItem));
    component.formData.itemName = 'Test Laptop';
    component.formData.itemQuantity = 5;

    component.onSubmit();

    expect(component.formData.itemName).toBe('');
    expect(component.formData.itemQuantity).toBe(0);
  });

  it('should handle API error on submission', () => {
    apiService.createItem.and.returnValue(throwError(() => new Error('Server error')));
    component.formData.itemName = 'Test';
    component.formData.itemQuantity = 1;
    component.formData.itemPrice = 10;

    component.onSubmit();

    expect(component.errors.length).toBeGreaterThan(0);
    expect(component.isSubmitting).toBe(false);
  });

  it('should reset form and clear messages on resetForm()', () => {
    component.formData.itemName = 'Something';
    component.errors = ['Some error'];
    component.successMessage = 'Some success';

    component.resetForm();

    expect(component.formData.itemName).toBe('');
    expect(component.errors.length).toBe(0);
    expect(component.successMessage).toBe('');
  });

  it('should have categories defined', () => {
    expect(component.categories.length).toBeGreaterThan(0);
    expect(component.categories).toContain('Laptop');
  });
});
