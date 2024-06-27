// service: article.service.ts

import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  addNewArticle(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/article/addNewArticle`, data, {
      headers: this.getHeaders()
    });
  }

  getAllArticle(): Observable<any> {
    return this.httpClient.get(`${this.url}/article/getAllArticle`, {
      headers: this.getHeaders()
    });
  }

  getAllPublishedArticle(): Observable<any> {
    return this.httpClient.get(`${this.url}/article/getAllPublishedArticle`, {
      headers: this.getHeaders()
    });
  }

  updateArticle(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/article/updateArticle`, data, {
      headers: this.getHeaders()
    });
  }

  deleteArticle(id: any): Observable<any> {
    return this.httpClient.post(`${this.url}/article/deleteArticle/${id}`, {}, {
      headers: this.getHeaders()
    });
  }
}
