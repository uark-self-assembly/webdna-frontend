import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent }   from './app.component';
import { AdminLayoutComponent } from './views/layouts/admin/admin-layout.component';

import { DropdownModule } from "ng2-dropdown";
import { AccordionModule } from "ng2-accordion";
import { SidebarModule } from './views/shared/sidebar/sidebar.module';
import { FixedPluginModule } from './views/shared/fixedplugin/fixedplugin.module';
import { NavbarModule} from './views/shared/navbar/navbar.module';
import { PagesnavbarModule} from './views/shared/pagesnavbar/pagesnavbar.module';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { Select2Module } from 'ng2-select2';

import { AuthLayoutComponent } from './views/layouts/auth/auth-layout.component';
import { PageNotFoundComponent } from './views/page-not-found.component';
import { AppRoutes } from './app.routing';
import { AuthenticationService } from './services/auth-guard/auth.service';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { UserService } from './services/user/user.service';
import { ProjectService } from "./services/project/project.service";
import { SweetAlertComponent } from './views/components/sweetalert/sweetalert.component';
import { AlertService } from './views/components/alert/alert.service';


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
        Select2Module
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
      AuthGuard,
      UserService,
      ProjectService,
      SweetAlertComponent,
      AlertService
    ],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }
