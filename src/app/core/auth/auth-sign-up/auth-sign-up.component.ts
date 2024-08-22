import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { FormErrors } from '../../form-errors';
import { AuthService } from '../../services/auth.service';
import { ErrorsService, PASSWORD_REGEX } from '../../services/errors.service';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-auth-sign-up',
    templateUrl: './auth-sign-up.component.html',
    styleUrl: './auth-sign-up.component.scss',
})
export class AuthSignUpComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly usersService = inject(UsersService);
    private readonly errorService = inject(ErrorsService);

    private takenUsernames: string[] = [];
    private takenEmails: string[] = [];

    //
    // Validators
    // @NOTE: Later, those validators could be moved to a dedicated service or directory.
    //

    private usernameAvailableValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        if (this.takenUsernames.includes(control.value)) {
            return { usernameUnavailable: true };
        }

        return null;
    };

    private emailAvailableValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        if (this.takenEmails.includes(control.value)) {
            return { emailUnavailable: true };
        }

        return null;
    };

    private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        if (control.value !== this.signUpForm?.get('password')?.value) {
            return { passwordMismatch: true };
        }

        return null;
    };

    //
    // Form
    //

    public signUpForm = new FormGroup({
        username: new FormControl('', [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(32),
            this.usernameAvailableValidator,
        ]),
        email: new FormControl('', [
            Validators.required,
            Validators.email,
            Validators.maxLength(128),
            this.emailAvailableValidator,
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128),
            Validators.pattern(PASSWORD_REGEX),
        ]),
        passwordConfirm: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128),
            Validators.pattern(PASSWORD_REGEX),
            this.passwordMatchValidator.bind(this),
        ]),
    });

    public formErrors: FormErrors<'username' | 'email' | 'password' | 'passwordConfirm'> = {
        username: null,
        email: null,
        password: null,
        passwordConfirm: null,
    };

    //
    // Lifecycle
    //

    ngOnInit(): void {
        forkJoin({
            usernames: this.usersService.getTakenUsernames(),
            emails: this.usersService.getTakenEmails(),
        }).subscribe({
            next: ({ usernames, emails }) => {
                this.takenUsernames = usernames;
                this.takenEmails = emails;
            },
            error: (err) => this.errorService.handleHttpError(err),
        });

        this.signUpForm.valueChanges.subscribe(() => {
            this.errorService.handleFormErrors(this.signUpForm, this.formErrors);
        });
    }

    onSubmit() {
        this.errorService.handleFormErrors(this.signUpForm, this.formErrors);

        if (this.signUpForm.invalid) {
            return;
        }

        this.signUp();
    }

    //
    // Sign Up
    //

    protected signUp() {
        const { username, email, password } = this.signUpForm.value;

        this.authService.register({ username: username!, email: email!, password: password! }).subscribe({
            next: (user) => this.errorService.toastInfo(`Welcome, ${user.username}!`),
            error: (err) => this.errorService.handleHttpError(err),
        });
    }
}
