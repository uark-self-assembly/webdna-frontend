import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../services/user/user';
import { StorageService } from '../../../services/storage/storage.service';

declare var $: any;

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

// Menu Items
export const ROUTES: RouteInfo[] = [{
    path: '/dashboard',
    title: 'Dashboard',
    type: 'link',
    icontype: 'pe-7s-graph'
}
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit, AfterViewInit {
    user: User = new User();

    public menuItems: any[];

    constructor(private storageService: StorageService) {

    }

    isNotMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    ngOnInit() {
        const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        this.menuItems = ROUTES.filter(menuItem => menuItem);

        if (isWindows) {
            $('html').addClass('perfect-scrollbar-off');
        } else {
            $('html').addClass('perfect-scrollbar-off');
        }

        this.user = this.storageService.user;
    }

    ngAfterViewInit() {
        const $sidebarParent = $('.sidebar .nav > li.active .collapse li.active > a').parent().parent().parent();
        const collapseId = $sidebarParent.siblings('a').attr('href');
    }
}
