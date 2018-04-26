import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutes } from './login.routing';

import { LoginComponent } from './login.component';
import { ComponentsModule } from '../components/components.module';
import { AlertService } from '../components/alert/alert.service';
import { AuthenticationService } from '../../services/auth-guard/auth.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(LoginRoutes),
        FormsModule,
        ReactiveFormsModule,
        ComponentsModule
    ],
    declarations: [
        LoginComponent
    ],
    providers: [
        AlertService,
        AuthenticationService
    ]
})

export class LoginModule {}
