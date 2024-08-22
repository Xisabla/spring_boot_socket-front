import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ErrorsService, FormErrors } from '../../services/errors.service';

@Component({
    selector: 'app-auth-sign-in',
    templateUrl: './auth-sign-in.component.html',
    styleUrl: './auth-sign-in.component.scss',
})
export class AuthSignInComponent {
    private readonly authService = inject(AuthService);
    private readonly errorService = inject(ErrorsService);

    public signInForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
        password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]),
        remember: new FormControl(false),
    });

    public formErrors: FormErrors<'username' | 'password'> = {
        username: null,
        password: null,
    };

    onSubmit() {
        this.errorService.handleFormErrors(this.signInForm, this.formErrors);

        if (this.signInForm.invalid) {
            return;
        }

        this.signIn();
    }

    protected signIn() {
        const { username, password, remember } = this.signInForm.value;

        this.authService.login({ username: username!, password: password!, remember: remember! }).subscribe({
            next: (user) => this.errorService.toastInfo(`Welcome back, ${user.username}!`),
            error: (err) => this.errorService.handleHttpError(err),
        });
    }
}
