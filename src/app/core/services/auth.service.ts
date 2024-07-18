import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginUserDto, RegisterUserDto, User } from '../models';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly router = inject(Router);

    private readonly _baseUrl = `${environment.apiURL}/auth`;

    get baseUrl(): string {
        return this._baseUrl;
    }

    constructor(private readonly http: HttpClient) {}

    //
    // AUTH
    //

    register(user: RegisterUserDto, redirect = true): Observable<User> {
        return this.http
            .post<User>(`${this.baseUrl}/register`, user, { withCredentials: true })
            .pipe(tap(this.setUser.bind(this)))
            .pipe(tap(() => redirect && this.router.navigate(['/'])));
    }

    login(user: LoginUserDto, redirect = true): Observable<User> {
        return this.http
            .post<User>(`${this.baseUrl}/login`, user, { withCredentials: true })
            .pipe(tap(this.setUser.bind(this)))
            .pipe(tap(() => redirect && this.router.navigate(['/'])));
    }

    logout(redirect = true): Observable<void> {
        return this.http
            .post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true })
            .pipe(tap(this.removeUser.bind(this)))
            .pipe(tap(() => redirect && this.router.navigate(['/auth'])));
    }

    validate(): Observable<boolean> {
        return this.http
            .get<User>(`${this.baseUrl}/validate`, { withCredentials: true })
            .pipe(tap(this.setUser.bind(this)))
            .pipe(
                map(() => true),
                catchError(() => of(false)),
            );
    }

    //
    // USER
    //

    getUser(): User | null {
        const user = localStorage.getItem('user');

        return user ? JSON.parse(user) : null;
    }

    private setUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    private removeUser(): void {
        localStorage.removeItem('user');
    }
}
