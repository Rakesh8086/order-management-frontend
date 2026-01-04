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
  productName: string = '';
  message: string = '';
  ConfirmationBox: boolean = false;

  constructor(private route: ActivatedRoute,
    private productService: ProductService,private router: Router){

    }

  ngOnInit(): void{
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
  }
  openConfirmationBox(){ 
    this.ConfirmationBox = true; 
  }
  closeConfirmationBox(){ 
    this.ConfirmationBox = false; 
  }

  deleteProduct(){
    this.ConfirmationBox = false; 
    this.productService.deleteProduct(this.productId).subscribe({
      next:()=>{
        this.message = "Product deleted successfully";
      },
      error:err=>{
        this.message = "Could not delete";
      }
    });
  }
}