import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Router } from '@angular/router';
import { Injectable } from "@angular/core";
import { dbService } from "./db.service";
import {Response} from '@angular/http';
import { CookieService } from "ngx-cookie-service";
import { observableToBeFn } from "rxjs/testing/TestScheduler";
import { Observable } from "rxjs/Observable";
@Injectable()
export class RouteGuardService implements CanActivate{
    UserIdCook: string;
    selectedMenuUrl='';
    arrMenus: any[] ;
    retValue: boolean = false;
    redirectURL: string;
    constructor(private objDbServ: dbService, private objCook: CookieService, private router: Router){
    }
    public canActivate(route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.objDbServ.isAthenticated(route.routeConfig.path)
        .then(
            (retBool: boolean) =>{
                if (retBool){
                    this.objDbServ.SelectMenu.emit(route.routeConfig.path);
                    return true;
                }
                else{
                    this.router.navigate(['/']);
                }
            }
        )
    }
}