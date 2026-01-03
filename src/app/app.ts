import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  mobileNumber?: string;

  constructor(private storageService: StorageService, private authService: AuthService) { 

  }
}