import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-profile.component',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit{
  currentUser: any;

  constructor(private storageService: StorageService){ 

  }

  ngOnInit(): void{
    this.currentUser = this.storageService.getUser();
  }
}