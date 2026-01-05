import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

const AUTH_API = 'https://localhost:8086/authentication-service/api/auth/';
const ACCESS_API = 'https://localhost:8086/authentication-service/api/access/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, 
    private storageService: StorageService){

  }

  register(username: string, email: string, mobileNumber: string, password: string): 
  Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        mobileNumber,
        password,
      },
      {withCredentials: true}
    );
  }

  signin(mobileNumber: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin', 
    {
      mobileNumber,
      password
    }, 
    {withCredentials: true}); 
  }

  logout(): Observable<any> {
    return this.http.post(
      AUTH_API + 'signout',
      {},
      {withCredentials: true}
    );
  }

  changePassword(mobileNumber: string, existingPassword: string, newPassword: string): 
  Observable<any>{
    return this.http.put(ACCESS_API + 'change/password',
      {
        mobileNumber,
        existingPassword,
        newPassword
      },
      {
        // withCredentials: true,
        responseType: 'text' as 'json'
      },
    );
  }
}