import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { User } from '../../models';
import { AuthSignInComponent } from './auth-sign-in.component';

describe('AuthSignInComponent', () => {
    let component: AuthSignInComponent;
    let fixture: ComponentFixture<AuthSignInComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AuthSignInComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()],
            imports: [FormErrorComponent, ReactiveFormsModule, ToastrModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(AuthSignInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the signInForm with empty values', () => {
        const signInForm = component.signInForm;

        expect(signInForm.value).toEqual({
            username: '',
            password: '',
            remember: false,
        });
    });

    it('should set the username control as required', () => {
        const usernameControl = component.signInForm.get('username');

        expect(usernameControl?.hasError('required')).toBe(true);
    });

    it('should set the username control with minimum length of 4', () => {
        const usernameControl = component.signInForm.get('username');

        usernameControl?.setValue('a'.repeat(3));

        expect(usernameControl?.hasError('minlength')).toBe(true);
        expect(usernameControl?.getError('minlength')?.requiredLength).toBe(4);
    });

    it('should set the username control with maximum length of 32', () => {
        const usernameControl = component.signInForm.get('username');

        usernameControl?.setValue('a'.repeat(33));

        expect(usernameControl?.hasError('maxlength')).toBe(true);
        expect(usernameControl?.getError('maxlength')?.requiredLength).toBe(32);
    });

    it('should set the password control as required', () => {
        const passwordControl = component.signInForm.get('password');

        expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should set the password control with minimum length of 8', () => {
        const passwordControl = component.signInForm.get('password');

        passwordControl?.setValue('a'.repeat(7));

        expect(passwordControl?.hasError('minlength')).toBe(true);
        expect(passwordControl?.getError('minlength')?.requiredLength).toBe(8);
    });

    it('should set the password control with maximum length of 128', () => {
        const passwordControl = component.signInForm.get('password');

        passwordControl?.setValue('a'.repeat(129));

        expect(passwordControl?.hasError('maxlength')).toBe(true);
        expect(passwordControl?.getError('maxlength')?.requiredLength).toBe(128);
    });

    it('should set the remember control with initial value of false', () => {
        const rememberControl = component.signInForm.get('remember');

        expect(rememberControl?.value).toBe(false);
    });

    it('should call errorService.handleFormErrors when onSubmit is called', () => {
        spyOn(component['errorService'], 'handleFormErrors');

        component.onSubmit();

        expect(component['errorService'].handleFormErrors).toHaveBeenCalledWith(
            component.signInForm,
            component.formErrors,
        );
    });

    it('should return early when signInForm is invalid', () => {
        spyOn(component['authService'], 'login');

        component.signInForm.setErrors({ invalid: true });
        component.onSubmit();

        expect(component['authService'].login).not.toHaveBeenCalled();
    });

    it('should call authService.login with correct values when signInForm is valid', () => {
        const formValues = {
            username: 'testuser',
            password: 'testpassword',
            remember: true,
        };

        const authServiceSpy = spyOn(component['authService'], 'login');

        authServiceSpy.and.returnValue(new Observable<User>());

        component.signInForm.setValue(formValues);
        component.onSubmit();

        expect(authServiceSpy).toHaveBeenCalledWith(formValues);
    });
});
