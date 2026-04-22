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
 * Connects to the PROG2005 REST API server
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
   * Fetch a single inventory item by ID
   * GET /ArtGalley/{itemId}
   */
  getItemById(itemId: number): Observable<InventoryItem> {
    return this.http
      .get<InventoryItem>(`${API_BASE_URL}/${itemId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Create a new inventory item
   * POST /ArtGalley
   */
  createItem(item: CreateInventoryItem): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(API_BASE_URL, item).pipe(
      tap((created) =>
        console.log(`[ApiService] Created item: ${created.itemName}`)
      ),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing inventory item
   * PUT /ArtGalley/{itemId}
   */
  updateItem(itemId: number, item: UpdateInventoryItem): Observable<InventoryItem> {
    return this.http
      .put<InventoryItem>(`${API_BASE_URL}/${itemId}`, item)
      .pipe(
        tap((updated) =>
          console.log(`[ApiService] Updated item: ${updated.itemName}`)
        ),
        catchError(this.handleError)
      );
  }

  /**
   * Delete an inventory item by ID
   * DELETE /ArtGalley/{itemId}
   */
  deleteItem(itemId: number): Observable<any> {
    return this.http.delete(`${API_BASE_URL}/${itemId}`).pipe(
      tap(() => console.log(`[ApiService] Deleted item ID: ${itemId}`)),
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
