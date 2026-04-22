import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { InventoryItem, CreateInventoryItem } from '../models';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

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
      special_note: 'High-end model',
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

  it('should fetch all items via GET /ArtGalley', () => {
    service.getAllItems().subscribe(items => {
      expect(items.length).toBe(2);
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });

  it('should fetch items by name via GET /ArtGalley/{name}', () => {
    service.getItemByName('Laptop Pro').subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].item_name).toBe('Laptop Pro');
    });

    const req = httpMock.expectOne(`${API_URL}/Laptop%20Pro`);
    expect(req.request.method).toBe('GET');
    req.flush([mockItems[0]]);
  });

  it('should create item via POST /ArtGalley', () => {
    const newItem: CreateInventoryItem = {
      item_name: 'New Tablet',
      category: 'Electronics',
      quantity: 5,
      price: 499.99,
      supplier_name: 'Samsung',
      stock_status: 'In stock',
      featured_item: 0,
      special_note: 'Mid-range',
    };

    const createdItem: InventoryItem = { ...newItem, item_id: 3 };

    service.createItem(newItem).subscribe(item => {
      expect(item.item_name).toBe('New Tablet');
      expect(item.item_id).toBe(3);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newItem);
    req.flush(createdItem);
  });

  it('should update item via PUT /ArtGalley/{name}', () => {
    const updatedFields = { quantity: 20, price: 1199.99 };

    service.updateItem('Laptop Pro', updatedFields).subscribe();

    const req = httpMock.expectOne(`${API_URL}/Laptop%20Pro`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedFields);
    req.flush({ ...mockItems[0], ...updatedFields });
  });

  it('should delete item via DELETE /ArtGalley/{name}', () => {
    service.deleteItem('Wireless Mouse').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${API_URL}/Wireless%20Mouse`);
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

    const req = httpMock.expectOne(API_URL);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle 404 error with not found message', () => {
    service.getItemByName('NonExistent').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toContain('not found');
      },
    });

    const req = httpMock.expectOne(`${API_URL}/NonExistent`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
