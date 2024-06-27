import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  login(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/appUser/login`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  addNewAppUser(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/appUser/addNewAppUser`, data, {
      headers: this.getHeaders()
    });
  }

  getAllAppUser(): Observable<any> {
    return this.httpClient.get(`${this.url}/appUser/getAllAppUser`, {
      headers: this.getHeaders()
    });
  }

  updateUser(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/appUser/updateUser`, data, {
      headers: this.getHeaders()
    });
  }

  updateUserStatus(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/appUser/updateUserStatus`, data, {
      headers: this.getHeaders()
    });
  }

  refreshToken(): Observable<any> {
    return this.httpClient.post(`${this.url}/appUser/refreshToken`, {}, {
      headers: this.getHeaders()
    }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }
}
