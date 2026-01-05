import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-place-order.component',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css'],
  standalone: false
})
export class PlaceOrderComponent implements OnInit {
  orderForm!: FormGroup;
  itemOptions = [1, 2, 3];
  message = '';
  ConfirmationBox = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder, private orderService: OrderService, 
    private changeDetector: ChangeDetectorRef){
      
  }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      address: ['', Validators.required],
      deliveryWithinDays: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      items: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup{
    return this.fb.group({
      productId: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      quantity: [1, [Validators.required,Validators.min(1)]]
    });
  }

  get items(): FormArray{
    return this.orderForm.get('items') as FormArray;
  }

  onItemCountChange(event: Event): void{
    const count = Number((event.target as HTMLSelectElement).value);
    this.items.clear();
    for(let i=0;i<count;i++){
      this.items.push(this.createItem());
    }
  }

  confirmPlaceOrder(): void{
    // closes confirm box as soon as order place
    this.ConfirmationBox = false;
    if(this.isSubmitting){
      return;
    }
    this.isSubmitting = true;
    this.orderService.placeOrder(this.orderForm.value).subscribe({
      next:(orderId: number) =>{
        this.message = `Order placed, Order ID: ${orderId}`;
        this.isSubmitting = false;
        this.orderForm.reset({
          address: '',
          deliveryWithinDays: 1
        });
        this.items.clear();
        this.items.push(this.createItem());
        this.changeDetector.detectChanges();  
      },
      error: err=>{
        this.isSubmitting = false;
        this.message = '';
        if(typeof err.error === 'string'){
          try {
            const parsed = JSON.parse(err.error);
            if(typeof parsed === 'object'){
              this.message = parsed;
            } 
            else {
              this.message = err.error;
            }
          } 
          catch {
            this.message = err.error;
          }
        }
        this.changeDetector.detectChanges();  
      }
    });
  }
}