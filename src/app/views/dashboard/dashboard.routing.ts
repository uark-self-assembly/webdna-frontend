import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../services/auth-guard/auth.guard';

export const DashboardRoutes: Routes = [{
    path: '',
    children: [{
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    }]
}];
