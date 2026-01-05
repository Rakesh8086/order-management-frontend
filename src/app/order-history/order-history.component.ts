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
  message = '';
  selectedOrder: any = null;
  showDetailsBox: boolean = false;
  showCancelBox: boolean = false;
  orderToCancelId: number | null = null;

  constructor(private orderService: OrderService,
  private changeDetector: ChangeDetectorRef){

  }

  ngOnInit(): void{
    this.orderHistory();
  }
  openDetails(order: any){
    this.selectedOrder = order;
    this.showDetailsBox = true;
  }
  closeDetails(){
    this.showDetailsBox = false;
    this.selectedOrder = null;
  }
  canCancel(status: string): boolean{
    const possible = ['ORDERED'];
    return possible.includes(status);
  }
  openCancelBox(id: number){
    this.message = '';
    this.orderToCancelId = id;
    this.showCancelBox = true;
  }

  closeCancelBox(){
    this.showCancelBox = false;
    this.orderToCancelId = null;
  }

  orderHistory(): void{
    this.orderService.getOrderHistory().subscribe({
      next:(data: any[])=>{
        this.orders = data || [];
        if(this.orders.length === 0 && !this.message){
          this.message = 'No orders found.';
        } 
        // else{
          // this.message = '';
        // }
        this.changeDetector.detectChanges();
      },
      error: err=>{
        this.message = 'Failed to load orders. Try later.';
        this.changeDetector.detectChanges();
      }
    });
  }

  confirmCancel(){
    this.showCancelBox = false;
    // this.orderHistory(); 
    if(this.orderToCancelId) {
      this.orderService.cancelOrder(this.orderToCancelId).subscribe({
        next: ()=>{
          this.message = `Order #${this.orderToCancelId} has been cancelled.`;
          // this.closeCancelBox();
          this.changeDetector.detectChanges();
        },
        error: err=>{
          // this.message = '';
          // this.closeCancelBox();
          if(typeof err.error === 'string'){
            try{
              const parsed = JSON.parse(err.error);
              if(typeof parsed === 'object'){
                this.message = parsed;
              } 
              else{
                this.message = err.error;
              }
            } 
            catch{
              this.message = err.error;
            }
          }
          this.changeDetector.detectChanges();
        }
      });
    }
  }
}