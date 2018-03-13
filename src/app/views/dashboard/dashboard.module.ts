import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LbdModule } from '../components/lbd/lbd.module';
import { DropdownModule } from "ng2-dropdown";
import { AccordionModule } from "ng2-accordion";
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectTableComponent } from './project-list/project-table/project-table.component';
import { ProjectAddComponent } from './project-list/project-add/project-add.component';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        LbdModule,
        DropdownModule,
        AccordionModule
    ],
    declarations: [
      DashboardComponent,
      ProjectListComponent,
      ProjectTableComponent,
      ProjectAddComponent
    ]
})

export class DashboardModule {}
