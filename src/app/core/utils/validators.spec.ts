/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { available, EMAIL, matchControl, PASSWORD, PASSWORD_REGEX, USERNAME } from './validators';

describe('Validators', () => {
    const runValidatorsHelper = (validators: any[], value: any) => {
        return validators.map((validator) => {
            const control = new FormControl(value);

            return validator(control);
        });
    };

    describe('USERNAME', () => {
        it('should return an error for empty value', () => {
            const result = runValidatorsHelper(USERNAME, '');

            expect(result).toContain({ required: true });
        });

        it('should return an error if the value is too short', () => {
            const result = runValidatorsHelper(USERNAME, 'a'.repeat(3));

            expect(result).toContain({ minlength: { requiredLength: 4, actualLength: 3 } });
        });

        it('should return an error if the value is too long', () => {
            const result = runValidatorsHelper(USERNAME, 'a'.repeat(33));

            expect(result).toContain({ maxlength: { requiredLength: 32, actualLength: 33 } });
        });
    });

    describe('EMAIL', () => {
        it('should return an error for empty value', () => {
            const result = runValidatorsHelper(EMAIL, '');

            expect(result).toContain({ required: true });
        });

        it('should return an error for invalid email', () => {
            const result = runValidatorsHelper(EMAIL, 'invalidEmail');

            expect(result).toContain({ email: true });
        });

        it('should return an error if the value is too long', () => {
            const result = runValidatorsHelper(EMAIL, 'a'.repeat(129));

            expect(result).toContain({ maxlength: { requiredLength: 128, actualLength: 129 } });
        });
    });

    describe('PASSWORD', () => {
        it('should return an error for empty value', () => {
            const result = runValidatorsHelper(PASSWORD, '');

            expect(result).toContain({ required: true });
        });

        it('should return an error for invalid password', () => {
            const result = runValidatorsHelper(PASSWORD, 'invalidPassword');

            expect(result).toContain(
                jasmine.objectContaining({ pattern: jasmine.objectContaining({ actualValue: 'invalidPassword' }) }),
            );
        });

        it('should return an error if the value is too short', () => {
            const result = runValidatorsHelper(PASSWORD, 'a'.repeat(7));

            expect(result).toContain({ minlength: { requiredLength: 8, actualLength: 7 } });
        });

        it('should return an error if the value is too long', () => {
            const result = runValidatorsHelper(PASSWORD, 'a'.repeat(129));

            expect(result).toContain({ maxlength: { requiredLength: 128, actualLength: 129 } });
        });
    });

    describe('PASSWORD_REGEX', () => {
        it('should match a strong password', () => {
            const result = PASSWORD_REGEX.test('StrongPassword1!');

            expect(result).toBeTrue();
        });

        it('should not match a password without lowercase letters', () => {
            const result = PASSWORD_REGEX.test('STRONGPASSWORD1!');

            expect(result).toBeFalse();
        });

        it('should not match a password without uppercase letters', () => {
            const result = PASSWORD_REGEX.test('strongpassword1!');

            expect(result).toBeFalse();
        });

        it('should not match a password without numbers', () => {
            const result = PASSWORD_REGEX.test('StrongPassword!');

            expect(result).toBeFalse();
        });

        it('should not match a password without special characters', () => {
            const result = PASSWORD_REGEX.test('StrongPassword1');

            expect(result).toBeFalse();
        });
    });

    describe('available', () => {
        const taken = ['taken1', 'taken2'];
        const getter = () => of(taken);

        it('should return null if value is not taken', () => {
            const control = new FormControl('notTaken');

            (available(getter)(control) as Observable<ValidationErrors | null>).subscribe((result) =>
                expect(result).toBeNull(),
            );
        });

        it('should return { unavailable: true } if value is taken', () => {
            const control = new FormControl('taken1');

            (available(getter)(control) as Observable<ValidationErrors | null>).subscribe((result) =>
                expect(result).toEqual({ unavailable: true }),
            );
        });
    });

    describe('matchControl', () => {
        const matchingControl = new FormControl('matchingValue');

        it('should return null if value matches the matching control value', () => {
            const control = new FormControl('matchingValue');

            const result = matchControl(matchingControl)(control);

            expect(result).toBeNull();
        });

        it('should return { mismatch: true } if value does not match the matching control value', () => {
            const control = new FormControl('nonMatchingValue');

            const result = matchControl(matchingControl)(control);

            expect(result).toEqual({ mismatch: true });
        });
    });
});
