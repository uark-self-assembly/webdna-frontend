import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LbdModule } from '../components/lbd/lbd.module';
import { DropdownModule } from 'ngx-dropdown';
import { AccordionModule } from 'ngx-accordion';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectTableComponent } from './project-list/project-table/project-table.component';
import { ProjectAddComponent } from './project-list/project-add/project-add.component';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { ProjectConfigComponent } from './project-config/project-config.component';
import { PanelsComponent } from '../components/panels/panels.component';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { ModalModule } from 'ngx-modal';
import { LogOutputComponent } from './log-output/log-output.component';
import { AppModule } from '../../app.module';
import { SharedModule } from '../shared/shared.module';
import { ProjectAnalysisComponent } from './project-analysis/project-analysis.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        LbdModule,
        DropdownModule,
        AccordionModule,
        JWBootstrapSwitchModule,
        ModalModule,
        SharedModule,
        MatTooltipModule
    ],
    declarations: [
      DashboardComponent,
      ProjectListComponent,
      ProjectTableComponent,
      ProjectAddComponent,
      ProjectConfigComponent,
      ProjectAnalysisComponent
    ]
})

export class DashboardModule {}
