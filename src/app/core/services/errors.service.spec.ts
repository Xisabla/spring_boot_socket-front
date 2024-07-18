import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorsService, FormErrors } from './errors.service';

describe('ErrorsService', () => {
    let service: ErrorsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ErrorsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('handleHttpError', () => {
        it('should log the error and message to the console', () => {
            const consoleErrorSpy = spyOn(console, 'error');
            const error: HttpErrorResponse = { status: 404 } as HttpErrorResponse;

            service.handleHttpError(error);

            expect(consoleErrorSpy).toHaveBeenCalledWith(error);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Not found');
        });

        it('should log "Unknown error" if the status code is not recognized', () => {
            const consoleErrorSpy = spyOn(console, 'error');
            const error: HttpErrorResponse = { status: 999 } as HttpErrorResponse;

            service.handleHttpError(error);

            expect(consoleErrorSpy).toHaveBeenCalledWith(error);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown error');
        });
    });

    describe('getFormErrorMessage', () => {
        it('should return the error message for the given control and error', () => {
            const message = service['getFormErrorMessage']('username', 'required');

            expect(message).toBe('Username is required.');
        });

        it('should replace the elements of the message with the provided values', () => {
            const message = service['getFormErrorMessage']('password', 'minlength', { requiredLength: 8 });

            expect(message).toBe('Password must be at least 8 characters long.');
        });

        it('should return a generic error message if the control is not found', () => {
            const message = service['getFormErrorMessage']('username', 'pattern');

            expect(message).toBe('Invalid input');
        });
    });

    describe('resetFormErrors', () => {
        it('should reset all form errors to null', () => {
            const errors: FormErrors = {
                username: 'Username is required.',
                password: 'Password is required.',
                email: 'This email is invalid.',
            };

            const resetErrors = service.resetFormErrors(errors);

            expect(resetErrors['username']).toBeNull();
            expect(resetErrors['password']).toBeNull();
            expect(resetErrors['email']).toBeNull();
        });
    });

    describe('handleFormErrors', () => {
        let form: FormGroup;

        beforeEach(() => {
            form = new FormGroup({
                username: new FormControl('', Validators.required),
                password: new FormControl('', Validators.required),
                email: new FormControl('', Validators.email),
            });
        });

        it('should return an object with form errors', () => {
            const errors = service.handleFormErrors(form);

            expect(errors['username']).toBe('Username is required.');
            expect(errors['password']).toBe('Password is required.');
            expect(errors['email']).toBeNull();
        });

        it('should reset existing errors if errors parameter is provided', () => {
            form.get('username')?.setValue('test');
            form.get('password')?.setValue('test');
            form.get('email')?.setValue('test@test.test');

            const errors: FormErrors = {
                username: 'Custom error',
                password: 'Custom error',
                email: 'Custom error',
            };

            const resetErrors = service.handleFormErrors(form, errors);

            expect(resetErrors['username']).toBeNull();
            expect(resetErrors['password']).toBeNull();
            expect(resetErrors['email']).toBeNull();
        });
    });

    describe('replace', () => {
        it('should replace the elements of the string with the provided values', () => {
            const message = 'hello {{ name }}';
            const replacements = { name: 'world' };

            const replaced = service['replace'](message, replacements);

            expect(replaced).toBe('hello world');
        });
    });
});
