import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    { path: 'auth', loadChildren: async () => (await import('./core/auth/auth.module')).AuthModule },
    {
        path: '',
        loadChildren: async () => (await import('./features/home/home.module')).HomeModule,
        canActivate: [authGuard],
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [RouterModule],
})
export class AppRoutingModule {}
