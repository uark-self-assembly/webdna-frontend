import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './views/layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './views/layouts/auth/auth-layout.component';
import { PageNotFoundComponent } from './views/page-not-found.component';
import { AuthGuard } from './services/auth-guard/auth.guard';

export const AppRoutes: Routes = [
    { path: '', redirectTo: '/register', pathMatch: 'full' },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: '',
            loadChildren: './views/login/login.module#LoginModule',
        }]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: '',
            loadChildren: './views/register/register.module#RegisterModule',
        }]
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: '',
            loadChildren: './views/dashboard/dashboard.module#DashboardModule'
        },
        {
            path: '',
            loadChildren: './views/visualizer/visualizer.module#VisualizerModule'
        },
        { path: '**', component: PageNotFoundComponent }]
    }];

@NgModule({
    imports: [RouterModule.forRoot(AppRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
