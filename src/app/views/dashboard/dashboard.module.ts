import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LbdModule } from '../components/lbd/lbd.module';
import { DropdownModule } from 'ngx-dropdown';
import { AccordionModule } from 'ngx-accordion';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectTableComponent } from './project-list/project-table/project-table.component';
import { ProjectAddComponent } from './project-list/project-add/project-add.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DashboardComponent } from './dashboard.component';
import { VisualizerComponent } from '../visualizer/visualizer.component';
import { DashboardRoutes } from './dashboard.routing';
import { ProjectConfigComponent } from './project-config/project-config.component';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { ModalModule } from 'ngx-modal';
import { SharedModule } from '../shared/shared.module';
import { ProjectAnalysisComponent } from './project-analysis/project-analysis.component';
import { HtmolComponent } from '../visualizer/htmol/htmol.component';

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
        MatTooltipModule,
        MatExpansionModule,
        MatButtonModule,
        MatCardModule
    ],
    declarations: [
        DashboardComponent,
        VisualizerComponent,
        HtmolComponent,
        ProjectListComponent,
        ProjectTableComponent,
        ProjectAddComponent,
        ProjectConfigComponent,
        ProjectAnalysisComponent
    ]
})

export class DashboardModule { }
