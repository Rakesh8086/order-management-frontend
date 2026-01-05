import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
  standalone: false
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  isSuccessful = false;
  isFailed = false;
  serviceError = '';
  fieldErrors: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void{
    this.changePasswordForm = this.fb.group({
      mobileNumber: [null, [Validators.required, Validators.pattern('^\\d{10}$')]],
      currentPassword: [null, Validators.required],
      newPassword: [null, [Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
    })
  }

  onSubmit(): void{
    if(this.changePasswordForm.invalid){
      this.changePasswordForm.markAllAsTouched();
      return;
    }
    const {mobileNumber, currentPassword, newPassword} = this.changePasswordForm.value;
    this.authService.changePassword(mobileNumber, currentPassword, newPassword).subscribe({
      next: ()=>{
        this.isSuccessful = true;
        this.isFailed = false;
        this.serviceError = '';
        this.fieldErrors = {};
        this.changePasswordForm.reset();
        this.cd.detectChanges();
      },
      error: err=>{
        this.isSuccessful = false;
        this.isFailed = true;
        this.serviceError = '';
        this.fieldErrors = {};
        if(typeof err.error === 'string'){
          try {
            const parsed = JSON.parse(err.error);
            if(typeof parsed === 'object'){
              this.fieldErrors = parsed;
            } 
            else{
              this.serviceError = err.error;
            }
          } 
          catch{
            this.serviceError = err.error;
          }
        } 
        else if(typeof err.error === 'object'){
          this.fieldErrors = err.error;
        }
        this.cd.detectChanges();
      }
    });
  }
}
