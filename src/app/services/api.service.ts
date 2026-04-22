import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  InventoryItem,
  CreateInventoryItem,
  UpdateInventoryItem,
} from '../models';

/**
 * Base URL for the PROG2005 ArtGalley REST API
 */
const API_BASE_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

/**
 * API Service for inventory CRUD operations
 *
 * All single-item operations use item NAME as the resource identifier,
 * matching the assignment requirement:
 *   GET    /ArtGalley/{name}
 *   PUT    /ArtGalley/{name}
 *   DELETE /ArtGalley/{name}
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch all inventory items
   * GET /ArtGalley
   */
  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(API_BASE_URL).pipe(
      tap((items) =>
        console.log(`[ApiService] Fetched ${items.length} items`)
      ),
      catchError(this.handleError)
    );
  }

  /**
   * Fetch inventory items by name
   * GET /ArtGalley/{name}
   * Returns an array (may contain multiple items with the same name)
   */
  getItemByName(name: string): Observable<InventoryItem[]> {
    const encoded = encodeURIComponent(name);
    return this.http
      .get<InventoryItem[]>(`${API_BASE_URL}/${encoded}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetch only featured items (featured_item === 1)
   * Uses getAllItems and filters client-side since API has no featured endpoint
   */
  getFeaturedItems(): Observable<InventoryItem[]> {
    return this.getAllItems().pipe(
      tap((items) => {
        const featured = items.filter((i) => i.featured_item === 1);
        console.log(`[ApiService] Featured items: ${featured.length}`);
      }),
      // Return all, let caller filter
      catchError(this.handleError)
    );
  }

  /**
   * Create a new inventory item
   * POST /ArtGalley
   */
  createItem(item: CreateInventoryItem): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(API_BASE_URL, item).pipe(
      tap((created) =>
        console.log(`[ApiService] Created item: ${created.item_name}`)
      ),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing inventory item by name
   * PUT /ArtGalley/{name}
   */
  updateItem(name: string, item: UpdateInventoryItem): Observable<any> {
    const encoded = encodeURIComponent(name);
    return this.http
      .put(`${API_BASE_URL}/${encoded}`, item)
      .pipe(
        tap(() =>
          console.log(`[ApiService] Updated item: ${name}`)
        ),
        catchError(this.handleError)
      );
  }

  /**
   * Delete an inventory item by name
   * DELETE /ArtGalley/{name}
   */
  deleteItem(name: string): Observable<any> {
    const encoded = encodeURIComponent(name);
    return this.http
      .delete(`${API_BASE_URL}/${encoded}`)
      .pipe(
        tap(() => console.log(`[ApiService] Deleted item: ${name}`)),
        catchError(this.handleError)
      );
  }

  /**
   * Centralized error handler for all API calls
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request — please check your input';
          break;
        case 404:
          errorMessage = 'Item not found';
          break;
        case 500:
          errorMessage = 'Server error — please try again later';
          break;
        default:
          errorMessage = `Server error (${error.status}): ${error.message}`;
      }
    }

    console.error('[ApiService] Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
