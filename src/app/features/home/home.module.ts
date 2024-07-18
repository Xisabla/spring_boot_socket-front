import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DummyComponent } from './dummy/dummy.component';

const routes: Routes = [{ path: '', component: DummyComponent }];

@NgModule({
    declarations: [DummyComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class HomeModule {}
