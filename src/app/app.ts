import { ChangeDetectorRef, Component } from '@angular/core';
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
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef){

    }

  ngOnInit(): void{
    this.checkLoginStatus();
    this.eventBus = this.eventBusService.on('login', () => {
      this.checkLoginStatus();
      this.changeDetector.detectChanges();
    });
    // used when session expires and event bus catches 401
    // and performs logout automatically
    this.eventBusService.on('logout', () => {
      // this.logout();
      this.storageService.clean();
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
      this.changeDetector.detectChanges();
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
  // used when user clicks logout manually
  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        // console.log(res);
        this.storageService.clean();
        this.isLoggedIn = false;
        this.roles = [];
        // this.eventBusService.emit(new EventData('logout', null));
        this.router.navigate(['/login']);
        this.changeDetector.detectChanges();
        // window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
