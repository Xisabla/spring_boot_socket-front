import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormErrorComponent } from './form-error.component';

describe('FormErrorComponent', () => {
    let component: FormErrorComponent;
    let fixture: ComponentFixture<FormErrorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormErrorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FormErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have empty formErrors and controlName properties by default', () => {
        expect(component.formErrors).toEqual({});
        expect(component.controlName).toEqual('');
    });

    it('should return false for hasError when controlName is empty', () => {
        component.controlName = '';

        expect(component.hasError).toBe(false);
    });

    it('should return true for hasError when formErrors has a value for controlName', () => {
        component.controlName = 'email';
        component.formErrors = { email: 'Invalid email' };

        expect(component.hasError).toBe(true);
    });

    it('should return false for hasError when formErrors does not have a value for controlName', () => {
        component.controlName = 'email';
        component.formErrors = { password: 'Invalid password' };

        expect(component.hasError).toBe(false);
    });

    it('should return empty string for errorMessage when controlName is empty', () => {
        component.controlName = '';

        expect(component.errorMessage).toEqual('');
    });

    it('should return the error message for errorMessage when formErrors has a value for controlName', () => {
        component.controlName = 'email';
        component.formErrors = { email: 'Invalid email' };

        expect(component.errorMessage).toEqual('Invalid email');
    });

    it('should return empty string for errorMessage when formErrors does not have a value for controlName', () => {
        component.controlName = 'email';
        component.formErrors = { password: 'Invalid password' };

        expect(component.errorMessage).toEqual('');
    });
});
