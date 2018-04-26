import { Routes } from '@angular/router';

import { VisualizerComponent } from './visualizer.component';
import { AuthGuard } from '../../services/auth-guard/auth.guard';

export const VisualizerRoutes: Routes = [{
    path: '',
    children: [{
        path: 'visualizer',
        component: VisualizerComponent,
        canActivate: [AuthGuard]
    }]
}];
