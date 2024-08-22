import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private readonly _baseUrl = `${environment.apiURL}/users`;

    get baseUrl(): string {
        return this._baseUrl;
    }

    constructor(private readonly http: HttpClient) {}

    //
    // USERS
    //

    getTakenUsernames(): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/username`);
    }

    getTakenEmails(): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/email`);
    }
}
