import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register.component',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  serviceError = '';
  fieldErrors: any = {};

  constructor(private fb: FormBuilder, private authService: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {
  
  }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      mobileNumber: [null, [Validators.required, Validators.pattern('^\\d{10}$')]],
      password: [null, [Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]]
    });
  }

  onSubmit(): void {
    if(this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const username = this.registerForm.value.username;
    const email = this.registerForm.value.email;
    const mobileNumber = this.registerForm.value.mobileNumber;
    const password = this.registerForm.value.password;

    this.authService.register(username, email, mobileNumber, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.changeDetector.detectChanges();
      },
      error: err => {
        this.isSuccessful = false;
        this.isSignUpFailed = true;
        this.fieldErrors = {};
        this.serviceError = '';
        if(typeof err.error === 'string'){
          try {
            const parsed = JSON.parse(err.error);
            if(typeof parsed === 'object'){
              this.fieldErrors = parsed;
            } 
            else {
              this.serviceError = err.error;
            }
          } 
          catch {
            this.serviceError = err.error;
          }
        }
        else if(typeof err.error === 'object'){
          this.fieldErrors = err.error;
        }
        this.changeDetector.detectChanges();
      }
    });
  }
}

