import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { of, throwError } from 'rxjs';

import { Tab3Page } from './tab3.page';
import { ApiService } from '../services/api.service';
import { InventoryItem } from '../models';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockItems: InventoryItem[] = [
    {
      item_id: 1,
      item_name: 'Laptop',
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
      item_name: 'Phone',
      category: 'Electronics',
      quantity: 20,
      price: 699.99,
      supplier_name: 'Samsung',
      stock_status: 'Low stock',
      featured_item: 0,
      special_note: '',
    },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getAllItems', 'updateItem', 'deleteItem']);

    await TestBed.configureTestingModule({
      declarations: [Tab3Page],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab3Page);
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
  });

  it('should select item for editing', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    component.selectItem(mockItems[1]);

    expect(component.selectedItem).toEqual(mockItems[1]);
    expect(component.editData.item_name).toBe('Phone');
    expect(component.editData.quantity).toBe(20);
  });

  it('should prevent deletion of protected Laptop items', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    component.confirmDelete(mockItems[0]); // Laptop item

    expect(component.errors.length).toBeGreaterThan(0);
    expect(component.showDeleteConfirm).toBeFalse();
  });

  it('should allow deletion of non-protected items', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    component.confirmDelete(mockItems[1]); // Phone item

    expect(component.showDeleteConfirm).toBeTrue();
    expect(component.deleteTarget).toEqual(mockItems[1]);
  });

  it('should update item via API with name-based endpoint and changed fields only', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    apiService.updateItem.and.returnValue(of({}));
    fixture.detectChanges();

    component.selectItem(mockItems[1]);
    component.editData.quantity = 25;
    component.onUpdate();

    // Should call updateItem with the item NAME, not ID
    expect(apiService.updateItem).toHaveBeenCalledWith('Phone', jasmine.objectContaining({ quantity: 25 }));
  });

  it('should delete item via API with name-based endpoint after confirmation', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    apiService.deleteItem.and.returnValue(of({}));
    fixture.detectChanges();

    component.deleteTarget = mockItems[1];
    component.showDeleteConfirm = true;
    component.executeDelete();

    // Should call deleteItem with the item NAME, not ID
    expect(apiService.deleteItem).toHaveBeenCalledWith('Phone');
  });

  it('should cancel editing and clear state', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    component.selectItem(mockItems[1]);
    component.cancelEdit();

    expect(component.selectedItem).toBeNull();
    expect(component.editData).toEqual({});
    expect(component.errors.length).toBe(0);
  });

  it('should detect no changes and show error', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    fixture.detectChanges();

    component.selectItem(mockItems[1]);
    // Don't change anything
    component.onUpdate();

    expect(component.errors).toContain('No changes detected');
  });

  it('should have help tips defined', () => {
    expect(component.helpTips.length).toBeGreaterThan(0);
  });

  it('should format price correctly', () => {
    expect(component.formatPrice(699.99)).toBe('$699.99');
  });
});
