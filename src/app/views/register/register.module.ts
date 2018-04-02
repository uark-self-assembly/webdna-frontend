import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterRoutes } from './register.routing';

import { RegisterComponent } from './register.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(RegisterRoutes),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        RegisterComponent
    ]
})

export class RegisterModule {}
