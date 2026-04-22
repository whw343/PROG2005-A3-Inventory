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
      itemId: 1,
      itemName: 'Laptop',
      itemCategory: 'Laptop',
      itemQuantity: 10,
      itemPrice: 1299.99,
      featuredItem: 1,
      specialNote: '',
    },
    {
      itemId: 2,
      itemName: 'Phone',
      itemCategory: 'Phone',
      itemQuantity: 20,
      itemPrice: 699.99,
      featuredItem: 0,
      specialNote: '',
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
    expect(component.editData.itemName).toBe('Phone');
    expect(component.editData.itemQuantity).toBe(20);
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

  it('should update item via API with changed fields only', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    apiService.updateItem.and.returnValue(of({ ...mockItems[1], itemQuantity: 25 }));
    fixture.detectChanges();

    component.selectItem(mockItems[1]);
    component.editData.itemQuantity = 25;
    component.onUpdate();

    expect(apiService.updateItem).toHaveBeenCalledWith(2, jasmine.objectContaining({ itemQuantity: 25 }));
  });

  it('should delete item via API after confirmation', () => {
    apiService.getAllItems.and.returnValue(of(mockItems));
    apiService.deleteItem.and.returnValue(of(undefined));
    apiService.getAllItems.and.returnValue(of([mockItems[0]]));
    fixture.detectChanges();

    component.deleteTarget = mockItems[1];
    component.showDeleteConfirm = true;
    component.performDelete();

    expect(apiService.deleteItem).toHaveBeenCalledWith(2);
  });

  it('should have help tips defined', () => {
    expect(component.helpTips.length).toBeGreaterThan(0);
  });
});
