//
// TODO: Transform this shit into a service
//

import { FormGroup } from '@angular/forms';

export type FormErrors<T extends string = string> = Record<T, string | null>;

export interface FormErrorMessage {
    control?: string;
    error: string;
    message: string;
}

export const FORM_ERROR_MESSAGES: FormErrorMessage[] = [
    { error: 'required', message: 'This field is required.' },
    { error: 'email', message: 'This email is invalid.' },
    { error: 'minlength', message: 'This field must be at least {{ requiredLength }} characters long.' },
    { error: 'maxlength', message: 'This field must be at most {{ requiredLength }} characters long.' },
];

export function replaceMessage(message: string, replacements: Record<string, string>): string {
    return message.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
        return replacements[key] || match;
    });
}

export function getMatchingErrorMessage(control: string, error: string, replacements: Record<string, string>): string {
    const message =
        FORM_ERROR_MESSAGES.find((err) => err?.control === control && err.error === error)?.message ??
        FORM_ERROR_MESSAGES.find((err) => err.control === undefined && err.error === error)?.message ??
        'Invalid input';

    return replaceMessage(message, replacements);
}

export function getFormErrors(form: FormGroup): FormErrors {
    const errors: FormErrors = initFormErrors(form);

    Object.keys(form.controls).forEach((key) => {
        const control = form.get(key);

        if (control?.errors) {
            const error = Object.keys(control.errors)[0];
            const replacements = Object.values(control.errors)[0];

            const message = getMatchingErrorMessage(key, error, replacements);

            errors[key] = message;
        }
    });

    return errors;
}

export function initFormErrors<T extends string = string>(form: FormGroup): FormErrors {
    const errors: FormErrors<T> = {} as FormErrors<T>;

    Object.keys(form.controls).forEach((key) => (errors[key as T] = null));

    return errors;
}
