import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { DummyComponent } from './dummy.component';

describe('DummyComponent', () => {
    let authService: AuthService;

    let component: DummyComponent;
    let fixture: ComponentFixture<DummyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DummyComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        authService = TestBed.inject(AuthService);

        fixture = TestBed.createComponent(DummyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        spyOn(authService, 'getUser').and.returnValue({ username: 'test' } as User);

        expect(component).toBeTruthy();
    });
});
