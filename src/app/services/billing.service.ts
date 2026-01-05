import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: 'root' })
export class BillingService {
  private API_URL = 'https://localhost:8086/billing-service/api/billing'; 

  constructor(private http: HttpClient, 
    private storageService: StorageService){ 

  }

  getInvoiceHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/history`, 
        {withCredentials: true});
  }
}