import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: 'root' })
export class OrderService {
  private API_URL = 'https://localhost:8086/order-service/api/orders'; 

  constructor(private http: HttpClient, 
    private storageService: StorageService){ 

  }

  placeOrder(orderData: any): Observable<number> {
    return this.http.post<number>(`${this.API_URL}/order`, orderData, 
    {withCredentials: true});
  }
  getOrderHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/history`, { withCredentials: true });
  }
  cancelOrder(id: number): Observable<any[]> {
    return this.http.put<any[]>(`${this.API_URL}/cancel/${id}`, 
    {withCredentials: true});
  }

  getAllOrdersForAdmin(filter: any = {}): Observable<any[]> {
    return this.http.post<any[]>(`${this.API_URL}/admin/filter`, filter,
         {withCredentials: true});
  }
  UpdateToDelivered(filter: any = {}): Observable<any[]> {
    return this.http.post(`${this.API_URL}/update/order/status`, filter, {
        withCredentials: true,
        responseType: 'text' as 'json'
    }) as Observable<any[]>;
  }
}