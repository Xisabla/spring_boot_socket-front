import { Component, inject, Injectable, OnInit } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
    providedIn: 'root',
})
class RxStompService extends RxStomp {
    constructor() {
        super();
    }
}

@Component({
    selector: 'app-dummy',
    templateUrl: './dummy.component.html',
    styleUrl: './dummy.component.scss',
})
export class DummyComponent implements OnInit {
    private readonly authService = inject(AuthService);
    public user!: User;

    private readonly ws = webSocket(environment.wsURL);
    private readonly stomp = new RxStompService();

    ngOnInit(): void {
        this.user = this.authService.getUser()!;

        this.ws.subscribe({
            next: console.log,
            error: console.error,
        });

        this.stomp.configure({
            brokerURL: environment.wsURL,
        });
        this.stomp.activate();

        this.stomp.watch('/topic/greetings').subscribe({
            next: (msg) => console.log(msg.body),
            error: console.error,
        });

        this.stomp.publish({ destination: '/app/hello', body: `${this.user.username}` });
    }

    onLogout() {
        this.authService.logout().subscribe({
            next: () => {
                this.ws.complete();
                this.stomp.deactivate();
            },
            error: console.error,
        });
    }
}
