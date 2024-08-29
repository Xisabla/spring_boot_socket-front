import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ErrorsService, FormErrors } from '../../services/errors.service';
import { UsersService } from '../../services/users.service';
import { available, EMAIL, matchControl, PASSWORD, USERNAME } from '../../utils/validators';

@Component({
    selector: 'app-auth-sign-up',
    templateUrl: './auth-sign-up.component.html',
    styleUrl: './auth-sign-up.component.scss',
})
export class AuthSignUpComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly usersService = inject(UsersService);
    private readonly errorService = inject(ErrorsService);

    //
    // Form
    //

    public signUpForm = new FormGroup({
        username: new FormControl('', {
            validators: USERNAME,
            asyncValidators: available(() => this.usersService.getTakenUsernames()),
        }),
        email: new FormControl('', {
            validators: EMAIL,
            asyncValidators: available(() => this.usersService.getTakenEmails()),
        }),
        password: new FormControl('', PASSWORD),
        passwordConfirm: new FormControl('', PASSWORD),
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
        this.signUpForm.get('passwordConfirm')?.addValidators(matchControl(this.signUpForm.get('password')!));
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
