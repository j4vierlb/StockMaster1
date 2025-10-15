import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://jsonplaceholder.typicode.com'; // API de prueba
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // GET - Obtener datos
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // POST - Crear datos
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // PUT - Actualizar datos
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // DELETE - Eliminar datos
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    
    console.error('Error en API:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Métodos específicos para tu aplicación
  getProducts(): Observable<any[]> {
    return this.get<any[]>('posts'); // Simula productos
  }

  createProduct(product: any): Observable<any> {
    return this.post<any>('posts', product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.put<any>(`posts/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.delete<any>(`posts/${id}`);
  }

  // Autenticación simulada
  login(credentials: any): Observable<any> {
    return this.post<any>('posts', credentials)
      .pipe(
        map(response => ({
          success: true,
          token: 'fake-jwt-token',
          user: { id: 1, username: credentials.username }
        }))
      );
  }
}