import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

declare var $: any;

@Component({
    selector: 'app-layout',
    templateUrl: './admin-layout.component.html'
})

export class AdminLayoutComponent implements OnInit {
    location: Location;
    private _router: Subscription;

    @ViewChild('sidebar') sidebar;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;
    constructor( private router: Router, location: Location ) {
      this.location = location;
    }

    ngOnInit() {
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
          this.navbar.sidebarClose();
        });

        const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows) {
            const $main_panel = $('.main-panel');
        }

    }
}
