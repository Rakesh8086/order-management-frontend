import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-product.component',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit{
  productForm!: FormGroup;
  message = '';
  isSuccess = false;

  constructor(private fb: FormBuilder, 
  private productService: ProductService, private router: Router){
    
  }

  preventNegative(event: KeyboardEvent): void{
    if(event.key === '-' || event.key === 'e'){
      event.preventDefault();
    }
  }

  ngOnInit(): void{
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      discount: [null, [Validators.required, Validators.min(0)]],
      initialStock: [null, [Validators.required, Validators.min(1)]],
      minStockLevel: [null, [Validators.required, Validators.min(0)]],
      isActive: [true, Validators.required]
    });
  }

  onSubmit(){
    if(this.productForm.invalid){
      this.productForm.markAllAsTouched();
      return;
    }

    this.productService.addProduct(this.productForm.value).subscribe({
      next:res =>{
        this.message = "Product added successfully";
        this.isSuccess = true;
      },
      error:err=>{
        this.message = err.error?.message || "Error adding product";
        this.isSuccess = false;
      }
    });
  }
}
