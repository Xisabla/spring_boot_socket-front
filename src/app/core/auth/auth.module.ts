import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FormErrorComponent } from '../../shared/components/form-error/form-error.component';
import { AuthSignInComponent } from './auth-sign-in/auth-sign-in.component';
import { AuthSignUpComponent } from './auth-sign-up/auth-sign-up.component';

const routes: Routes = [
    { path: 'sign-in', component: AuthSignInComponent },
    { path: 'sign-up', component: AuthSignUpComponent },
    { path: '**', redirectTo: 'sign-in' },
];

@NgModule({
    declarations: [AuthSignInComponent, AuthSignUpComponent],
    imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule, FormErrorComponent],
})
export class AuthModule {}
