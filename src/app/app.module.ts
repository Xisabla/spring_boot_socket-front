import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ToastNoAnimationModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes), ToastNoAnimationModule.forRoot()],
    providers: [provideHttpClient()],
})
export class AppModule {}
