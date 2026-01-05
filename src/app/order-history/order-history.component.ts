import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-history.component',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit{
  orders: any[] = [];
  errorMessage = '';

  constructor(private orderService: OrderService,
  private changeDetector: ChangeDetectorRef){

  }

  ngOnInit(): void{
    this.orderHistory();
  }

  orderHistory(): void{
    this.orderService.getOrderHistory().subscribe({
      next:(data: any[])=>{
        this.orders = data || [];
        if(this.orders.length === 0){
          this.errorMessage = 'No orders found.';
        } 
        else{
          this.errorMessage = '';
        }
        this.changeDetector.detectChanges();
      },
      error: err=>{
        this.errorMessage = 'Failed to load orders. Try later.';
        this.changeDetector.detectChanges();
      }
    });
  }
}