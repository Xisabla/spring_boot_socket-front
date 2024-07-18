import { Component, Input } from '@angular/core';
import { FormErrors } from '../../../core/services/errors.service';

@Component({
    selector: 'app-form-error',
    standalone: true,
    imports: [],
    templateUrl: './form-error.component.html',
    styleUrl: './form-error.component.scss',
})
export class FormErrorComponent {
    @Input() public formErrors: FormErrors;
    @Input() public controlName: string;

    constructor() {
        this.formErrors = {};
        this.controlName = '';
    }

    get hasError(): boolean {
        if (this.controlName === '') {
            return false;
        }

        return Boolean(this.formErrors[this.controlName]);
    }

    get errorMessage(): string {
        if (this.controlName === '') {
            return '';
        }

        return this.formErrors[this.controlName] ?? '';
    }
}
