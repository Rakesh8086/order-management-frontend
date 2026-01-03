import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home.component',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  errorMessage = '';

  constructor(private productService: ProductService){

  }
  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: data => {
        this.products = data;
      },
      error: err => {
        this.errorMessage = "Failed to load inventory.";
        // console.error(err);
      }
    });
  }
}