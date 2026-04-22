import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { InventoryItem, CreateInventoryItem } from '../models';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const mockItems: InventoryItem[] = [
    {
      itemId: 1,
      itemName: 'Laptop Pro',
      itemCategory: 'Laptop',
      itemQuantity: 10,
      itemPrice: 1299.99,
      featuredItem: 1,
      specialNote: 'High-end model',
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all items via GET', () => {
    service.getAllItems().subscribe(items => {
      expect(items.length).toBe(2);
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });

  it('should fetch single item by ID via GET', () => {
    service.getItemById(1).subscribe(item => {
      expect(item).toEqual(mockItems[0]);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockItems[0]);
  });

  it('should create item via POST', () => {
    const newItem: CreateInventoryItem = {
      itemName: 'New Tablet',
      itemCategory: 'Tablet',
      itemQuantity: 5,
      itemPrice: 499.99,
      featuredItem: 0,
      specialNote: 'Mid-range',
    };

    const createdItem: InventoryItem = { ...newItem, itemId: 3 };

    service.createItem(newItem).subscribe(item => {
      expect(item.itemName).toBe('New Tablet');
      expect(item.itemId).toBe(3);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newItem);
    req.flush(createdItem);
  });

  it('should update item via PUT', () => {
    const updatedFields = { itemQuantity: 20, itemPrice: 1199.99 };

    service.updateItem(1, updatedFields).subscribe(item => {
      expect(item.itemQuantity).toBe(20);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedFields);
    req.flush({ ...mockItems[0], ...updatedFields });
  });

  it('should delete item via DELETE', () => {
    service.deleteItem(2).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle HTTP errors gracefully', () => {
    service.getAllItems().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne(service['apiUrl']);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});
