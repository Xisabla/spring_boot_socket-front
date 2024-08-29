/* eslint-disable @typescript-eslint/no-explicit-any */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoginUserDto, RegisterUserDto, User, UserRoleEnum } from '../models';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    const mockedUser: User = {
        id: 'uuid',
        username: 'test',
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: UserRoleEnum.User,
    };

    const mockedUserCredentials: RegisterUserDto | LoginUserDto = {
        username: 'test',
        password: 'password',
        remember: false,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should register a user', () => {
        const registerPayload: RegisterUserDto = {
            username: 'test',
            email: 'test@test.test',
            password: 'password',
        };

        const expectedResponse: User = {
            id: 'uuid',
            username: 'test',
            enabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            role: UserRoleEnum.User,
        };

        service.register(registerPayload).subscribe((response) => {
            expect(response).toEqual(expectedResponse);
        });

        const req = httpMock.expectOne(`${service.baseUrl}/register`);

        expect(req.request.method).toBe('POST');

        req.flush(expectedResponse);
    });

    it('should login a user', () => {
        const expectedResponse: User = mockedUser;
        const loginPayload: LoginUserDto = mockedUserCredentials;

        service.login(loginPayload).subscribe((response) => {
            expect(response).toEqual(expectedResponse);
        });

        const req = httpMock.expectOne(`${service.baseUrl}/login`);

        expect(req.request.method).toBe('POST');

        req.flush(expectedResponse);
    });

    it('should store the user in local storage on login', () => {
        const expectedResponse: User = mockedUser;
        const loginPayload: LoginUserDto = mockedUserCredentials;

        const setUserSpy = spyOn<any>(service, 'setUser');

        service.login(loginPayload).subscribe((response) => {
            expect(setUserSpy).toHaveBeenCalledWith(response);
        });

        const req = httpMock.expectOne(`${service.baseUrl}/login`);

        expect(req.request.method).toBe('POST');

        req.flush(expectedResponse);
    });

    it('should get the user from local storage', () => {
        const expectedUser: User = mockedUser;

        const getUserSpy = spyOn<any>(localStorage, 'getItem').and.returnValue(JSON.stringify(expectedUser));

        const user = service.getUser();

        expect(getUserSpy).toHaveBeenCalledWith('user');
        expect(user).toEqual(expectedUser);
    });

    it('should remove the user from local storage on logout', () => {
        const removeUserSpy = spyOn<any>(service, 'removeUser').and.callThrough();

        service.logout().subscribe(() => {
            expect(removeUserSpy).toHaveBeenCalled();
        });

        const req = httpMock.expectOne(`${service.baseUrl}/logout`);

        expect(req.request.method).toBe('POST');
        req.flush({});
    });

    it('should validate a user', () => {
        const expectedResponse: User = mockedUser;

        service.validate().subscribe((response) => {
            expect(response).toBeTrue();
        });

        const req = httpMock.expectOne(`${service.baseUrl}/validate`);

        expect(req.request.method).toBe('GET');

        req.flush(expectedResponse);
    });
});
