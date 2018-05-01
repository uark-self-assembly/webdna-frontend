import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './views/layouts/admin/admin-layout.component';

import { DropdownModule } from 'ngx-dropdown';
import { AccordionModule } from 'ngx-accordion';
import { SidebarModule } from './views/shared/sidebar/sidebar.module';
import { FixedPluginModule } from './views/shared/fixedplugin/fixedplugin.module';
import { NavbarModule} from './views/shared/navbar/navbar.module';
import { PagesnavbarModule} from './views/shared/pagesnavbar/pagesnavbar.module';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';

import { AuthLayoutComponent } from './views/layouts/auth/auth-layout.component';
import { PageNotFoundComponent } from './views/page-not-found.component';
import { AppRoutes } from './app.routing';
import { AuthenticationService } from './services/auth-guard/auth.service';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { UserService } from './services/user/user.service';
import { ProjectService } from './services/project/project.service';
import { SweetAlertComponent } from './views/components/sweetalert/sweetalert.component';
import { AlertService } from './views/components/alert/alert.service';
import { ApiService } from './services/api-service/api.service';
import { RequestService } from './services/request/request.service';
import { StorageService } from './services/storage/storage.service';
import { PanelsComponent } from './views/components/panels/panels.component';
import { LogOutputComponent } from './views/dashboard/log-output/log-output.component';
import { DashboardModule } from './views/dashboard/dashboard.module';
import { VisualizerModule } from './views/visualizer/visualizer.module';
import { SharedModule } from './views/shared/shared.module';
import { ScriptService } from './services/script/script.service';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
    imports:      [
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes),
        HttpModule,
        SidebarModule,
        NavbarModule,
        FixedPluginModule,
        PagesnavbarModule,
        DropdownModule,
        AccordionModule,
        AngularDateTimePickerModule,
        MatTooltipModule
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
        PageNotFoundComponent
    ],
    providers: [
      {provide: LocationStrategy, useClass: HashLocationStrategy},
      AuthenticationService,
      StorageService,
      RequestService,
      AuthGuard,
      UserService,
      ProjectService,
      ApiService,
      SweetAlertComponent,
      AlertService,
      ScriptService
    ],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }
