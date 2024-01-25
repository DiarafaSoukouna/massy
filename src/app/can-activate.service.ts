import { Injectable } from "@angular/core";
import { AuthentificationService } from "./authentification.service";
import { Router } from "@angular/router";
import { ActivatedRouteSnapshot } from "@angular/router";
import { RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CanActivateService {
  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigateByUrl("/login");
    return false;
  }
}
