import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { EventBusService } from './shared/event-bus.service';

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
  eventBus?: Subscription;

  constructor(private storageService: StorageService, 
    private eventBusService: EventBusService){

    }

  ngOnInit(): void{
    this.checkLoginStatus();
    this.eventBus = this.eventBusService.on('login', () => {
      this.checkLoginStatus();
    });
    this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  checkLoginStatus(): void{
    this.isLoggedIn = this.storageService.isLoggedIn();
    if(this.isLoggedIn){
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.mobileNumber = user.mobileNumber;
    }
  }

  logout(): void {
    this.storageService.clean();
    this.isLoggedIn = false;
    window.location.reload(); // clears all details
  }
}
