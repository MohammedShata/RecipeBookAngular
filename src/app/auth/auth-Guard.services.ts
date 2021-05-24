import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private authServices:AuthService,private router:Router){}
    canActivate(
        activeRoute:ActivatedRouteSnapshot,
        router:RouterStateSnapshot
    ):
    Observable<boolean|UrlTree>
    |Promise <boolean |UrlTree>|
    Observable<boolean|UrlTree>|
    UrlTree| boolean
    {
        return this.authServices.user.pipe(take(1),
        map(user=>
            {
                const isAuth=!!user;
                if(isAuth)
                {
                    return true;
                }
                else{
                return this.router.createUrlTree(['/auth']);
                }
            })
        )
    }
}
