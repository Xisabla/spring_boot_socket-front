import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const redirectIfUnauthenticated = (authenticated: boolean) => {
        if (!authenticated) {
            router.navigate(['/auth/sign-in']);
        }
    };

    return authService.validate().pipe(tap(redirectIfUnauthenticated));
};
