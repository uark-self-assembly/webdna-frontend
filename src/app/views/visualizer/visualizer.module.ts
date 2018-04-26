import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LbdModule } from '../components/lbd/lbd.module';
import { DropdownModule } from 'ng2-dropdown';
import { AccordionModule } from 'ng2-accordion';

import { PanelsComponent } from '../components/panels/panels.component';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { ModalModule } from 'ng2-modal';
import { LogOutputComponent } from '../dashboard/log-output/log-output.component';
import { VisualizerComponent } from './visualizer.component';
import { VisualizerRoutes } from './visualizer.routing';
import { SharedModule } from '../shared/shared.module';
import { HtmolComponent } from './htmol/htmol.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(VisualizerRoutes), // TODO CHANGE
        FormsModule,
        LbdModule,
        DropdownModule,
        AccordionModule,
        JWBootstrapSwitchModule,
        ModalModule,
        SharedModule
    ],
    declarations: [
      HtmolComponent,
      VisualizerComponent
    ]
})

export class VisualizerModule {}
