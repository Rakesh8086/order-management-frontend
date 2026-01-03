import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ProductService {
  private API_URL = 'https://localhost:8086/inventory-service/api/products'; 

  constructor(private http: HttpClient){ 

  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(
        this.API_URL + '/all', 
        {withCredentials: true}
    );
  }
}