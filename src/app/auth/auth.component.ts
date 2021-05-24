import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { placeholderDirective } from '../shared/placeholders/placeholder.directive';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private closeSub:Subscription;
  @ViewChild(placeholderDirective) alerthost:placeholderDirective;

  constructor(private authService: AuthService,private router:Router,private componentFactoryResolver:ComponentFactoryResolver) {}
ngOnDestroy(){
  if(this.closeSub)
{
  this.closeSub.unsubscribe();
}
}
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.showAlertMessage(errorMessage);
        this.isLoading = false;
      }
    );

    form.reset();
  }
  handlingerror(){
    this.error=null;
  }
  private showAlertMessage(message:string)
  {
         const componentFactory=this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
         const hostContainerRef=this.alerthost.viewContainerRef;
         hostContainerRef.clear();
       const compRef=  hostContainerRef.createComponent(componentFactory);
        compRef.instance.message=message;
    this.closeSub=    compRef.instance.close.subscribe(()=>{
          this.closeSub.unsubscribe();
          hostContainerRef.clear();
        })
  }
}
