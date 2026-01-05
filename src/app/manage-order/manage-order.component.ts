import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-manage-order.component',
  standalone: false,
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.css',
})
export class ManageOrderComponent implements OnInit{
  orders: any[] = [];
  errorMessage = '';
  showConfirmBulk = false;
  filterMethod = new FormControl('view');
  form = new FormBuilder();
  filterForm = this.form.group({
    userId: [null],
    status: [''],
    startDate: [null]
  });

  constructor(private orderService: OrderService,
    private fb: FormBuilder, private cd: ChangeDetectorRef){

  }
  get mode(){
    return this.filterMethod.value;
  }

  ngOnInit(): void{
    this.getOrders();
    this.filterMethod.valueChanges.subscribe(() =>{
      this.showConfirmBulk = false;
      this.getOrders();
    });
  }

  getOrders(): void{
    this.errorMessage = '';
    const raw = this.filterForm.value;
    const optionalFields = this.removeNullFields(raw);
    if(optionalFields.startDate){
      optionalFields.startDate = optionalFields.startDate + 'T00:00:00';
    }
    this.orderService.getAllOrdersForAdmin(optionalFields).subscribe({
      next: data =>{
        this.orders = data || [];
        if(this.orders.length === 0){
          this.errorMessage = 'No orders found.';
        }
        this.cd.detectChanges();
      },
      error: ()=>{
        this.errorMessage = 'Could not fetch orders, Try later';
        this.orders = [];
        this.cd.detectChanges();
      }
    });
  }

  // overlay box
  openBulkConfirm(): void{
    if(this.orders.length === 0){
      return;
    }
    this.showConfirmBulk = true;
  }

  updateStatus(): void{
    const optionalFields = this.removeNullFields(this.filterForm.value);
    if(optionalFields.startDate){
      optionalFields.startDate = optionalFields.startDate + 'T00:00:00';
    }

    this.showConfirmBulk = false;
    this.orderService.UpdateToDelivered(optionalFields).subscribe({
      next: count=>{
        // this.errorMessage = "updated to DELIVERED";
        this.getOrders();
      },
      error: err=>{
        this.errorMessage = 'update failed';
        this.cd.detectChanges();
      }
    });
  }

  private removeNullFields(obj: any){
    const cleaned: any = {};
    const keys = Object.keys(obj);
    for(let i=0;i<keys.length;i++){
      const key = keys[i];
      const value = obj[key];
      if(value !== null && value !== '' && value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
}