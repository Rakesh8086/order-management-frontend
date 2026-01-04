import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: 'root' })
export class ProductService {
  private API_URL = 'https://localhost:8086/inventory-service/api/products'; 

  constructor(private http: HttpClient, 
    private storageService: StorageService){ 

  }
  private isWareHouseManager(): boolean {
    if(this.storageService.getUser().roles.includes('ROLE_WAREHOUSE_MANAGER')){
        return true;
    }
    return false;
  }
  getProducts(): Observable<any[]>{
    var url = '';
    if(this.isWareHouseManager()){
        url = `${this.API_URL}/all/admin`;
    }
    else{
        url = `${this.API_URL}/all`;
    }
    return this.http.get<any[]>(url, 
      {withCredentials: true});
  }

  getByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/name/${name}`, 
      {withCredentials: true});
  }

  getById(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/id/${id}`, 
      {withCredentials: true});
  }

  // filter by name, brand, finalPrice, discount
  advancedFilter(filterData: any): Observable<any[]> {
    var body = {};
    if(filterData){
      body = filterData;
    }
    return this.http.post<any[]>(`${this.API_URL}/filter`, body, 
      {withCredentials: true});
  }

  getLowStock(filterData: any = {}): Observable<any[]> {
    return this.http.post<any[]>(`${this.API_URL}/lowstock`, filterData, 
      {withCredentials: true});
  }

  addProduct(productData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/add`, productData, 
      {withCredentials: true});
  }
}