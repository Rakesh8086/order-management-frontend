import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'https://localhost:8086/authentication-service/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient){

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
      { withCredentials: true }
    );
  }
}