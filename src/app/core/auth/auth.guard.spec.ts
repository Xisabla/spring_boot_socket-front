import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuardGuard', () => {
    let authService: AuthService;
    let router: Router;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => authGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });

        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });

    it('should navigate to sign-in page if not authenticated', () => {
        spyOn(authService, 'validate').and.returnValue(of(false));
        spyOn(router, 'navigate');

        const route: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
        const state: RouterStateSnapshot = {} as RouterStateSnapshot;

        (executeGuard(route, state) as Observable<boolean>).subscribe(() => {
            expect(router.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
        });
    });

    it('should not navigate if authenticated', () => {
        spyOn(authService, 'validate').and.returnValue(of(true));
        spyOn(router, 'navigate');

        const route: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
        const state: RouterStateSnapshot = {} as RouterStateSnapshot;

        (executeGuard(route, state) as Observable<boolean>).subscribe(() => {
            expect(router.navigate).not.toHaveBeenCalled();
        });
    });
});
