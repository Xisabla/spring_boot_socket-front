import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { AuthSignUpComponent } from './auth-sign-up.component';

describe('AuthSignUpComponent', () => {
    let component: AuthSignUpComponent;
    let fixture: ComponentFixture<AuthSignUpComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AuthSignUpComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()],
            imports: [FormErrorComponent, ReactiveFormsModule, ToastrModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(AuthSignUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
