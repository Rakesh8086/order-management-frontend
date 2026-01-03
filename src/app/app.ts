import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { EventBusService } from './shared/event-bus.service';
import { EventData } from './shared/event.class';
import { Router } from '@angular/router';

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
    private eventBusService: EventBusService,
    private router: Router,
    private authService: AuthService){

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
    this.authService.logout().subscribe({
      next: res => {
        // console.log(res);
        this.storageService.clean();
        this.isLoggedIn = false;
        this.roles = [];
        this.eventBusService.emit(new EventData('logout', null));
        this.router.navigate(['/login']);
        // window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
