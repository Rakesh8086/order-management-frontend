import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home.component',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{
  products: any[] = [];
  errorMessage = '';
  isWarehouseManager = false;
  // different filters we provide
  id = new FormControl('');
  name = new FormControl('');
  form = new FormBuilder();
  advancedForm = this.form.group({
    name: [''],
    brand: [''],
    finalPrice: [null],
    discount: [null]
  });
  filterMethod = new FormControl('all');

  get filterType(){
    return this.filterMethod.value;
  }

  constructor(private productService: ProductService, 
    private storageService: StorageService, private fb: FormBuilder,
    private cd: ChangeDetectorRef, private ngZone: NgZone){

  }

  preventNegative(event: KeyboardEvent): void{
    if(event.key === '-' || event.key === 'e'){
      event.preventDefault();
    }
  }

  private removeNullField(obj: any){
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

  ngOnInit(): void{
    const user = this.storageService.getUser();
    if(user.roles.includes('ROLE_WAREHOUSE_MANAGER')){
      this.isWarehouseManager = true;
    }
    else{
      this.isWarehouseManager = false;
    }    
    // catches changes everytime we change filter
    this.filterMethod.valueChanges.subscribe(()=>{
      this.onFilterChange();
    });
    this.loadAll(); // during start, this is default
  }

  loadAll(){
    this.productService.getProducts().subscribe({
      next:data=>{
        this.ngZone.run(()=>{
          this.products = data;
          this.cd.detectChanges();
        });
      },
      error:err=>{
        this.ngZone.run(()=>{
          this.errorMessage = "Failed to load products";
          this.cd.detectChanges();
        });
      }
    });
  }

  searchById(){
    const id = this.id.value;
    if(id){
      this.productService.getById(parseInt(id)).subscribe({
        next:data=>{
          this.ngZone.run(()=>{
            this.products = [data];
            this.errorMessage = '';
            this.cd.detectChanges();
          });
        },
        error:err=>{
          this.ngZone.run(()=>{
            this.errorMessage = `No product found with ID: ${id}`;
            this.products = [];
            this.cd.detectChanges();
          });
        }
      });
    }
  }

  searchByName(){
    const name = this.name.value;
    if(name){
      this.productService.getByName(name).subscribe({
        next:data=>{
          this.ngZone.run(() =>{
            if(data.length === 0){
              this.errorMessage = "No products match your filter criteria.";
              this.products = [];
            } 
            else{
              this.products = data;
              this.errorMessage = '';
            }
            this.cd.detectChanges();
          });
        }
      });
    }
  }

  applyAdvancedFilter(){
    this.errorMessage = '';
    this.products = [];
    const body = this.removeNullField(this.advancedForm.value);
    this.productService.advancedFilter(body).subscribe({
      next:data=>{
        this.ngZone.run(() =>{
          if(data.length === 0){
            this.errorMessage = "No products match your filter criteria.";
          } 
          else{
            this.products = data;
            this.errorMessage = '';
          }
          this.cd.detectChanges();
        });
      }
    });
  }

  loadLowStock(){
    const body = this.removeNullField(this.advancedForm.value);
    this.productService.getLowStock(body).subscribe({
      next:data=>{
        this.ngZone.run(()=>{
          if(data.length === 0){
            this.errorMessage = "No products match your filter criteria.";
          }
          else{
            this.products = data;
            this.errorMessage = '';
          }
          this.cd.detectChanges();
        });
      },
      error:err =>{
        this.ngZone.run(()=>{
          this.errorMessage = "Could not fetch low stock";
          this.cd.detectChanges();
        });
      }
    });
  }

  // to clear screen from prev filter
  onFilterChange(){
    this.errorMessage = '';
    this.products = [];
    if(this.filterType === 'all'){
      this.loadAll();
    }
  }
}