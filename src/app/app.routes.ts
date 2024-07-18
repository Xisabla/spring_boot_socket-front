import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    // { path: 'login', loadChildren: AuthModule },
    // { path: 'register', loadChildren: AuthModule },
    // { path: 'messaging', loadChildren: MessagingModule, canActive: [AuthGuard] },
    { path: '', redirectTo: '/messaging', pathMatch: 'full' },
    { path: '**', redirectTo: '/messaging' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
