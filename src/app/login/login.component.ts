import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { EventData } from '../shared/event.class';
import { EventBusService } from '../shared/event-bus.service';

@Component({
  selector: 'app-login.component',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  serviceError = '';
  fieldErrors: any = {};
  roles: string[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService,
    private changeDetector: ChangeDetectorRef, 
    private storageService: StorageService,
    private eventBusService: EventBusService) {
    if(this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      mobileNumber: [null, [Validators.required, Validators.pattern('^\\d{10}$')]],
      password: [null]
    });
  }

  onSubmit(): void {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const mobileNumber = this.loginForm.value.mobileNumber;
    const password = this.loginForm.value.password;

    this.authService.signin(mobileNumber, password).subscribe({
      next: data => {
        // console.log(data);
        this.storageService.saveUser(data);
        this.roles = this.storageService.getUser().roles;
        this.isLoggedIn = true;
        this.isLoginFailed = false;
        this.eventBusService.emit(new EventData('login', null));
        this.changeDetector.detectChanges();
      },
      error: err => {
        this.isLoggedIn = false;
        this.isLoginFailed = true;
        this.fieldErrors = {};
        this.serviceError = err.error?.message;
        this.changeDetector.detectChanges();
        // err.error?.message extracts error directly 
        // throw by browser, not our service layer
        // like in json format
        /*{
              "path": "/api/auth/signin",
              "error": "Unauthorized",
              "message": "Bad credentials",
              "status": 401
          } */
      }
    });
  }
}
