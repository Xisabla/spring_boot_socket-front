import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

//
// Constants
//

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[/!@#$%^&*()\-_+.]).+$/;

//
// Types
//

export type FormErrors<T extends string = string> = Record<T, string | null>;

export interface FormErrorMessage {
    control?: string;
    error: string;
    message: string;
}

//
// Service
//

@Injectable({
    providedIn: 'root',
})
export class ErrorsService<T extends string = string> {
    //
    // Toasts
    //

    private toast = inject(ToastrService);

    public toastSuccess(message: string, title?: string, config?: Partial<IndividualConfig>): void {
        this.toast.success(message, title, config);
    }

    public toastError(message: string, title?: string, config?: Partial<IndividualConfig>): void {
        this.toast.error(message, title, config);
    }

    public toastWarning(message: string, title?: string, config?: Partial<IndividualConfig>): void {
        this.toast.warning(message, title, config);
    }

    public toastInfo(message: string, title?: string, config?: Partial<IndividualConfig>): void {
        this.toast.info(message, title, config);
    }

    public toastClear(): void {
        this.toast.clear();
    }

    //
    // HTTP Errors
    //

    private readonly httpErrorMessages: Record<number, string> = {
        400: 'Bad request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not found',
        408: 'Request timeout',
        409: 'Conflict',
        500: 'Server error',
    };

    public handleHttpError(error: HttpErrorResponse): void {
        console.error('HTTP error', error);

        if (error.error) {
            this.toast.error(error.error.message);

            return;
        }

        const message = this.httpErrorMessages[error.status] ?? 'Unknown error';

        this.toast.error(message);
    }

    //
    // Form errors
    //

    private readonly formErrorMessages: FormErrorMessage[] = [
        // Control specific
        { control: 'username', error: 'required', message: 'Username is required.' },
        { control: 'username', error: 'usernameUnavailable', message: 'Username is already taken.' },
        { control: 'email', error: 'emailUnavailable', message: 'An account with this email already exists.' },
        { control: 'password', error: 'required', message: 'Password is required.' },
        {
            control: 'password',
            error: 'minlength',
            message: 'Password must be at least {{ requiredLength }} characters long.',
        },
        {
            control: 'password',
            error: 'pattern',
            message:
                'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
        },
        { control: 'passwordConfirm', error: 'passwordMismatch', message: 'Passwords do not match.' },

        // Generic
        { error: 'required', message: 'This field is required.' },
        { error: 'email', message: 'This email is invalid.' },
        { error: 'minlength', message: 'This field must be at least {{ requiredLength }} characters long.' },
        { error: 'maxlength', message: 'This field must be at most {{ requiredLength }} characters long.' },
    ];

    private getFormErrorMessage(control: string, error: string, replacements: Record<string, unknown> = {}): string {
        const message =
            this.formErrorMessages.find((err) => err?.control === control && err.error === error)?.message ??
            this.formErrorMessages.find((err) => err.control === undefined && err.error === error)?.message ??
            'Invalid input';

        return this.replace(message, replacements);
    }

    public resetFormErrors(errors: FormErrors<T>): FormErrors<T> {
        Object.keys(errors).forEach((key) => {
            errors[key as T] = null;
        });

        return errors;
    }

    public handleFormErrors(form: FormGroup, errors?: FormErrors<T>): FormErrors<T> {
        const formErrors = errors
            ? this.resetFormErrors(errors)
            : Object.keys(form.controls).reduce((acc, key) => ({ ...acc, [key]: null }), {} as FormErrors<T>);

        return Object.keys(form.controls).reduce((errors, key) => {
            const control = form.get(key);

            if (control?.errors) {
                const error = Object.keys(control.errors)[0];
                const replacements = Object.values(control.errors)[0];

                const message = this.getFormErrorMessage(key, error, replacements);

                errors[key as T] = message;
            }

            return errors;
        }, formErrors);
    }

    //
    // Helpers
    //

    private replace(str: string, replacements: Record<string, unknown>): string {
        return str.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
            return `${replacements[key]}` || match;
        });
    }
}
