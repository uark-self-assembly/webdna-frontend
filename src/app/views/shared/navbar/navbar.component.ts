import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthenticationService } from '../../../services/auth-guard/auth.service';
import { StorageService } from '../../../services/storage/storage.service';

const misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;

    @ViewChild('navbar-cmp') button;

    constructor(location: Location,
        private renderer: Renderer,
        private element: ElementRef,
        private storageService: StorageService,
        private router: Router) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);

        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if ($('body').hasClass('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        $('#minimizeSidebar').click(function () {
            const $btn = $(this);

            if (misc.sidebar_mini_active === true) {
                $('body').removeClass('sidebar-mini');
                misc.sidebar_mini_active = false;

            } else {
                setTimeout(function () {
                    $('body').addClass('sidebar-mini');

                    misc.sidebar_mini_active = true;
                }, 300);
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            const simulateWindowResize = setInterval(function () {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function () {
                clearInterval(simulateWindowResize);
            }, 1000);
        });
    }

    isMobileMenu() {
        if ($(window).width() < 991) {
            return false;
        }
        return true;
    }

    logout() {
        this.storageService.logOut();
        this.router.navigate(['login']);
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');
        this.sidebarVisible = true;
    }
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    }

    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }
    /*********************************************
    **  Gets title to put on Navbar            ***
    *********************************************/
    getTitle() {
        let titlee = this.location.prepareExternalUrl(this.location.path());

        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }

        for (let item = 0; item < this.listTitles.length; item++) {
            const parent = this.listTitles[item];
            if (parent.path === titlee) {
                return parent.title;
            } else if (parent.children) {
                const children_from_url = titlee.split('/')[2];
                for (let current = 0; current < parent.children.length; current++) {
                    if (parent.children[current].path === children_from_url) {
                        return parent.children[current].title;
                    }
                }
            }
        }
        return 'Dashboard';
    }

    getPath() {
        return this.location.prepareExternalUrl(this.location.path());
    }
}
