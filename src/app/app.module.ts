import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';

import { SidebarModule } from './views/shared/sidebar/sidebar.module';
import { FixedPluginModule } from './views/shared/fixedplugin/fixedplugin.module';
import { NavbarModule } from './views/shared/navbar/navbar.module';
import { PagesnavbarModule } from './views/shared/pagesnavbar/pagesnavbar.module';

import { AuthLayoutComponent } from './views/layouts/auth/auth-layout.component';
import { PageNotFoundComponent } from './views/page-not-found.component';
import { AppRoutingModule } from './app.routing';
import { AuthenticationService } from './services/auth-guard/auth.service';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { UserService } from './services/user/user.service';
import { ProjectService } from './services/project/project.service';
import { SweetAlertComponent } from './views/components/sweetalert/sweetalert.component';
import { AlertService } from './views/components/alert/alert.service';
import { RequestService } from './services/request/request.service';
import { StorageService } from './services/storage/storage.service';
import { ScriptService } from './services/script/script.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { DashboardLayoutComponent } from './views/layout/dashboard-layout.component';
import { DragDropService, DragDropConfig, DragDropSortableService } from 'ng2-dnd';


@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        AppRoutingModule,
        HttpModule,
        SidebarModule,
        NavbarModule,
        FixedPluginModule,
        PagesnavbarModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatListModule
    ],
    declarations: [
        AppComponent,
        DashboardLayoutComponent,
        AuthLayoutComponent,
        PageNotFoundComponent
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AuthenticationService,
        StorageService,
        RequestService,
        AuthGuard,
        UserService,
        ProjectService,
        SweetAlertComponent,
        AlertService,
        ScriptService,
        DragDropService,
        DragDropConfig,
        DragDropSortableService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
