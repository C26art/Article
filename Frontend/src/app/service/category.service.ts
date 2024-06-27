import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${token}`);
  }

  addNewCategory(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/category/addNewCategory`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getAllCategory(): Observable<any> {
    return this.httpClient.get(`${this.url}/category/getAllCategory`, {
      headers: this.getAuthHeaders()
    });
  }

  updateCategory(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/category/updateCategory`, data, {
      headers: this.getAuthHeaders()
    });
  }
}
