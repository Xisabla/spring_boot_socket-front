import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';

//
// Config
//

export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 32;

export const EMAIL_MAX_LENGTH = 128;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[/!@#$%^&*()\-_+.]).+$/;

//
// Validators
//

export const USERNAME = [
    Validators.required,
    Validators.minLength(USERNAME_MIN_LENGTH),
    Validators.maxLength(USERNAME_MAX_LENGTH),
];

export const EMAIL = [Validators.required, Validators.email, Validators.maxLength(EMAIL_MAX_LENGTH)];

export const PASSWORD = [
    Validators.required,
    Validators.pattern(PASSWORD_REGEX),
    Validators.minLength(PASSWORD_MIN_LENGTH),
    Validators.maxLength(PASSWORD_MAX_LENGTH),
];

//
// Methods
//

export function available<T = string>(getter: () => Observable<T[]>): AsyncValidatorFn {
    return function (control: AbstractControl): Observable<ValidationErrors | null> {
        return getter().pipe(
            map((taken) => {
                if (taken.includes(control.value)) {
                    return { unavailable: true };
                }

                return null;
            }),
        );
    };
}

export function matchControl(matchingControl: AbstractControl): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
        if (control.value !== matchingControl?.value) {
            return { mismatch: true };
        }

        return null;
    };
}
