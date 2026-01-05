import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { BillingService } from '../services/billing.service';

@Component({
  selector: 'app-invoice-history.component',
  standalone: false,
  templateUrl: './invoice-history.component.html',
  styleUrl: './invoice-history.component.css',
})
export class InvoiceHistoryComponent implements OnInit{
  invoices: any[] = [];
  message = '';

  constructor(private invoiceService: BillingService,
  private changeDetector: ChangeDetectorRef){

  }

  ngOnInit(): void{
    this.invoiceHistory();
  }

  invoiceHistory(): void{
    this.invoiceService.getInvoiceHistory().subscribe({
      next:(data: any[])=>{
        this.invoices = data || [];
        if(this.invoices.length === 0 && !this.message){
          this.message = 'No Invoices found.';
        } 
        // else{
          // this.message = '';
        // }
        this.changeDetector.detectChanges();
      },
      error: err=>{
        this.message = 'Failed to load invoices. Try later.';
        this.changeDetector.detectChanges();
      }
    });
  }
}