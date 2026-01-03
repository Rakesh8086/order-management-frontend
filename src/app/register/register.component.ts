import { Component, OnInit } from '@angular/core';
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
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
  
  }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      mobileNumber: [null, [Validators.required, Validators.pattern('^\\d{10}$')]],
      password: [null, [Validators.required, Validators.minLength(8)]]
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
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}

