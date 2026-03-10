import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.auth.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }

        const roles = route.data?.['roles'] as Array<string>;
        if (roles && roles.length > 0) {
            const userRole = this.auth.getCurrentUser()?.role;
            if (userRole && roles.includes(userRole)) {
                return true;
            }
            this.router.navigate(['/dashboard']);
            return false;
        }

        return true;
    }
}
