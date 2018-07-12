import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'ngx-dropdown';
import { AccordionModule } from 'ngx-accordion';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectTableComponent } from './project-list/project-table/project-table.component';
import { ProjectAddComponent } from './project-list/project-add/project-add.component';

import { DashboardComponent } from './dashboard.component';
import { VisualizerComponent } from '../visualizer/visualizer.component';
import { DashboardRoutes } from './dashboard.routing';
import { ProjectConfigComponent } from './project-config/project-config.component';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { ModalModule } from 'ngx-modal';
import { SharedModule } from '../shared/shared.module';
import { ProjectAnalysisComponent } from './project-analysis/project-analysis.component';
import { HtmolComponent } from '../visualizer/htmol/htmol.component';
import { AppMaterialModule } from '../../material/app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        ReactiveFormsModule,
        DropdownModule,
        AccordionModule,
        JWBootstrapSwitchModule,
        ModalModule,
        SharedModule,
        AppMaterialModule
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
