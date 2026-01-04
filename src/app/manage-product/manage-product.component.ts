import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-manage-product.component',
  standalone: false,
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css',
})
export class ManageProductComponent implements OnInit {
  productId!: number;
  productName = '';
  message = '';
  confirmationBox = false;
  updateForm!: FormGroup;
  currentTask: 'none' | 'update' | 'delete' = 'none';
  initialStock = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.updateForm = this.fb.group({
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
    this.loadProductDetails();
  }

  selectTask(task: 'none' | 'update' | 'delete') {
    this.currentTask = task;
    this.message = '';
  }

  openConfirmationBox(){
    this.confirmationBox = true;
  }

  closeConfirmationBox(){
    this.confirmationBox = false;
  }

  loadProductDetails(){
    this.productService.getById(this.productId).subscribe((data: any)=>{
      let product;
      if(Array.isArray(data)){
        product = data[0]; 
      } 
      else {
        product = data;   
      }
      this.productName = product.name;
      this.updateForm.patchValue({
        name: product.name,
        description: product.description,
        brand: product.brand,
        category: product.category,
        price: product.price,
        discount: product.discount,
        initialStock: product.currentStock,      
        minStockLevel: product.minStockLevel,
        isActive: product.isActive
      });
    });
  }

  deleteProduct(){
    this.confirmationBox = false;
    this.productService.deleteProduct(this.productId).subscribe({
      next:()=>{
        this.message = 'Product deleted successfully';
      },
      error:()=>{
        this.message = 'Could not delete product';
      }
    });
  }

  updateProduct(){
    if(this.updateForm.invalid){
      return;
    }
    this.productService.updateProduct(this.productId, this.updateForm.value).subscribe({
      next:()=>{
        this.message = 'Product updated successfully';
        this.loadProductDetails();
      },
      error:()=>{
        this.message = 'Updated';
      }
    });
  }
}