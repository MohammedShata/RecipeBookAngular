import { trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy{
  constructor(private dataStorageService: DataStorageService,private AuthServices:AuthService,private route:Router) {}
  userSubscribtion:Subscription;
  isAuthenticated=false;
  private TimeExpiredToken;
ngOnInit(){
  this.userSubscribtion=this.AuthServices.user.subscribe(user=>{
    this.isAuthenticated=!!user;
    console.log(this.isAuthenticated);
  });
}
LogOut()
{
  this.AuthServices.LogOut();
}

ngOnDestroy(){
  this.userSubscribtion.unsubscribe();
}
  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
