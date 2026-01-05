import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BillingService } from '../services/billing.service';

@Component({
  selector: 'app-finance-dashboard.component',
  standalone: false,
  templateUrl: './finance-dashboard.component.html',
  styleUrl: './finance-dashboard.component.css',
})
export class FinanceDashboardComponent implements OnInit {
  report: any = null;
  searchedInvoice: any = null;
  orderIdInput = new FormControl(null);
  message = '';
  isError = false;

  constructor(private invoiceService: BillingService, 
    private changeDetector: ChangeDetectorRef){

  }

  ngOnInit(): void{
    this.loadReport();
  }

  loadReport(){
    this.invoiceService.getFinanceReport().subscribe({
      next: (data) => {
        this.report = data;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.message = "Could not load Report";
        this.isError = true;
        this.changeDetector.detectChanges();
      }
    });
  }

  searchInvoice() {
    const id = this.orderIdInput.value;
    if (!id) return;
    this.invoiceService.getInvoiceByOrderId(id).subscribe({
      next: (data) => {
        this.searchedInvoice = data;
        this.isError = false;
        this.message = '';
        this.changeDetector.detectChanges();
      },
      error: (err) => {
        this.searchedInvoice = null;
        this.message = `No invoice found for Order #${id}`;
        this.isError = true;
        this.changeDetector.detectChanges();
      }
    });
  }
}
