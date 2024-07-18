import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-dummy',
    templateUrl: './dummy.component.html',
    styleUrl: './dummy.component.scss',
})
export class DummyComponent implements OnInit {
    private readonly authService = inject(AuthService);
    public user!: User;

    ngOnInit(): void {
        this.user = this.authService.getUser()!;
    }

    onLogout() {
        this.authService.logout().subscribe({
            error: console.error,
        });
    }
}
