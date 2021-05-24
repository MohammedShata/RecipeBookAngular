import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, Subscription } from 'rxjs';

import { User } from './user.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
usersubscription:Subscription;
private TimeExpiredToken;
  constructor(private http: HttpClient,private route:Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key='+environment.firebaseApiKey,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),tap(resdata=>{
          this.HandlingAuthentication(resdata.email,resdata.localId,+resdata.expiresIn,resdata.idToken)
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key'+environment.firebaseApiKey,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),tap(resdata=>{
          this.HandlingAuthentication(resdata.email,resdata.localId,+resdata.expiresIn,resdata.idToken)
        })
      );
  }
  autoLogin()
  {
    const UserData:{
       email: string;
       id: string;
       _token: string;
       _tokenExpirationDate: Date;
    }
    = JSON.parse(localStorage.getItem('userData'));
    if(!UserData)
    {
return
    }
      const localUser= new User(UserData.email,UserData.email,UserData._token,UserData._tokenExpirationDate);
    if(localUser.token)
    {
      this.user.next(localUser);
      const remainDurationTime= new Date(UserData._tokenExpirationDate).getTime()- new Date().getTime();
      this.AutoLogOut(remainDurationTime);
    }
  }
  LogOut()
{
  this.user.next(null);
  this.route.navigate(['/auth']);
  localStorage.removeItem('userData');
  if(this.TimeExpiredToken)
  {
    clearTimeout(this.TimeExpiredToken);
  }
  this.TimeExpiredToken=null;
}
  AutoLogOut(DurationTime:number)
  {
     this.TimeExpiredToken=setTimeout(() => {
       this.LogOut();
  }, DurationTime);
  }
private HandlingAuthentication(email:string,userid:string,expiresIn:number,token:string)
{
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user=new User(
    email,
    userid,
    token,
    expirationDate
  );
  this.user.next(user);
  this.AutoLogOut(expiresIn * 1000);
  localStorage.setItem('userData',JSON.stringify(user));
  
console.log(user);
}

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
