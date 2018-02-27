# [Light Bootstrap Dashboard Pro Angular Cli](http://lbd-pro-cli.creative-tim.com/)
[![version][version-badge]][CHANGELOG]
![alt text](https://s3.amazonaws.com/creativetim_bucket/products/54/opt_lbdp_angular_thumbnail.jpg)

**[Light Bootstrap Dashboard PRO Angular Cli](http://lbd-pro-cli.creative-tim.com/)** is a Bootstrap Admin Theme designed to look simple and beautiful. Forget about boring dashboards and grab yourself a copy to kickstart new project! It is the easiest way to save time and money for your development.
What it is
Light Bootstrap Dashboard PRO is built over Bootstrap and Angular Cli and it comes integrated with a large number of third-party apps redesigned to fit in with the rest of the elements.

If you want to see the basic version of the dashboard, please check out this link. You can download it for free and play around to see if you like the look and feel of it.

This product came as a result of users asking for more functionality than the basic version. We developed it based your feedback and apps you are building. It is very powerful tool, that will allow you to build products ranging to admin panels to content managements systems.


Special thanks
To create this dashboard, we used already existing tools from awesome developers. We want to thank them for creating cool stuff and support them in the future:
[Angular](https://angular.io/) for the core structure
[Robert McIntosh](https://github.com/mouse0270) for the notification system
[Chartist](https://gionkunz.github.io/chartist-js/) for the wonderful charts
[Zhixin Wen](https://github.com/wenzhixin) for the [DataTables](http://bootstrap-table.wenzhixin.net.cn/documentation/)
[Tristan Edwards](https://twitter.com/t4t5) for the [Sweet Alert](https://limonte.github.io/sweetalert2/)
[Eonasdan](https://github.com/Eonasdan) for the [DateTimPicker](https://eonasdan.github.io/bootstrap-datetimepicker/)
Kirill Lebedev for [jVector Maps](http://jvectormap.com/)
[Vincent Gabriel](https://twitter.com/gabrielva) for the [Bootstrap Wizard](http://vinceg.github.io/twitter-bootstrap-wizard/)
We hope you will go great stuff with this tool. We look forward to hearing your thoughts, suggestions and feedback!


## Links:

+ [Live Preview](http://lbd-pro-cli.creative-tim.com/)
+ [Purchase Link](https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-angular2) ($49)
+ [Free Angular Version](http://lbd-angular2.creative-tim.com/)
+ [Free HTML Version](https://www.creative-tim.com/product/light-bootstrap-dashboard)
+ [PRO HTML Version](https://www.creative-tim.com/product/light-bootstrap-dashboard)($39)

## Quick Start:

Quick start options:

+ [Download from Creative Tim](http://www.creative-tim.com/product/light-bootstrap-dashboard-pro-angular2).

## Terminal Commands

1. Install NodeJs from [NodeJs Official Page](https://nodejs.org/en).
2. Open Terminal
3. Go to your file project
4. Run in terminal: ```npm install -g @angular/cli```
5. Then: ```npm install```
6. And: ```ng serve```
7. Navigate to: [http://localhost:4200/](http://localhost:4200/)

### What's included

Within the download you'll find the following directories and files:

```
lbd-pro-angular2
├── CHANGELOG.md
├── README.md
├── angular-cli.json
├── e2e
├── karma.conf.js
├── package.json
├── protractor.conf.js
├── src
│   ├── app
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── app.routing.ts
│   │   ├── calendar
│   │   │   ├── calendar.component.html
│   │   │   ├── calendar.component.ts
│   │   │   ├── calendar.module.ts
│   │   │   └── calendar.routing.ts
│   │   ├── charts
│   │   │   ├── charts.component.html
│   │   │   ├── charts.component.ts
│   │   │   ├── charts.module.ts
│   │   │   └── charts.routing.ts
│   │   ├── components
│   │   │   ├── buttons
│   │   │   │   ├── buttons.component.html
│   │   │   │   └── buttons.component.ts
│   │   │   ├── components.module.ts
│   │   │   ├── components.routing.ts
│   │   │   ├── grid
│   │   │   │   ├── grid.component.html
│   │   │   │   └── grid.component.ts
│   │   │   ├── icons
│   │   │   │   ├── icons.component.html
│   │   │   │   └── icons.component.ts
│   │   │   ├── notifications
│   │   │   │   ├── notifications.component.html
│   │   │   │   └── notifications.component.ts
│   │   │   ├── panels
│   │   │   │   ├── panels.component.html
│   │   │   │   └── panels.component.ts
│   │   │   ├── sweetalert
│   │   │   │   ├── sweetalert.component.html
│   │   │   │   └── sweetalert.component.ts
│   │   │   └── typography
│   │   │       ├── typography.component.html
│   │   │       └── typography.component.ts
│   │   ├── dashboard
│   │   │   ├── dashboard.component.html
│   │   │   ├── dashboard.component.ts
│   │   │   ├── dashboard.module.ts
│   │   │   └── dashboard.routing.ts
│   │   ├── forms
│   │   │   ├── equal-validator.directive.ts
│   │   │   ├── extendedforms
│   │   │   │   ├── extendedforms.component.html
│   │   │   │   └── extendedforms.component.ts
│   │   │   ├── forms.module.ts
│   │   │   ├── forms.routing.ts
│   │   │   ├── regularforms
│   │   │   │   ├── regularforms.component.html
│   │   │   │   └── regularforms.component.ts
│   │   │   ├── validationforms
│   │   │   │   ├── password-validator.component.ts
│   │   │   │   ├── validationforms.component.html
│   │   │   │   └── validationforms.component.ts
│   │   │   └── wizard
│   │   │       ├── wizard.component.html
│   │   │       └── wizard.component.ts
│   │   ├── layouts
│   │   │   ├── admin
│   │   │   │   ├── admin-layout.component.html
│   │   │   │   └── admin-layout.component.ts
│   │   │   └── auth
│   │   │       ├── auth-layout.component.html
│   │   │       └── auth-layout.component.ts
│   │   ├── lbd
│   │   │   ├── lbd-chart
│   │   │   │   ├── lbd-chart.component.html
│   │   │   │   └── lbd-chart.component.ts
│   │   │   ├── lbd-table
│   │   │   │   ├── lbd-table.component.html
│   │   │   │   └── lbd-table.component.ts
│   │   │   ├── lbd-task-list
│   │   │   │   ├── lbd-task-list.component.html
│   │   │   │   └── lbd-task-list.component.ts
│   │   │   └── lbd.module.ts
│   │   ├── maps
│   │   │   ├── fullscreenmap
│   │   │   │   ├── fullscreenmap.component.html
│   │   │   │   └── fullscreenmap.component.ts
│   │   │   ├── googlemaps
│   │   │   │   ├── googlemaps.component.html
│   │   │   │   └── googlemaps.component.ts
│   │   │   ├── maps.module.ts
│   │   │   ├── maps.routing.ts
│   │   │   └── vectormaps
│   │   │       ├── vectormaps.component.html
│   │   │       └── vectormaps.component.ts
│   │   ├── pages
│   │   │   ├── lock
│   │   │   │   ├── lock.component.html
│   │   │   │   └── lock.component.ts
│   │   │   ├── login
│   │   │   │   ├── login.component.html
│   │   │   │   └── login.component.ts
│   │   │   ├── pages.module.ts
│   │   │   ├── pages.routing.ts
│   │   │   └── register
│   │   │       ├── register.component.html
│   │   │       └── register.component.ts
│   │   ├── shared
│   │   │   ├── fixedplugin
│   │   │   │   ├── fixedplugin.component.html
│   │   │   │   ├── fixedplugin.component.ts
│   │   │   │   └── fixedplugin.module.ts
│   │   │   ├── footer
│   │   │   │   ├── footer.component.html
│   │   │   │   ├── footer.component.ts
│   │   │   │   └── footer.module.ts
│   │   │   ├── navbar
│   │   │   │   ├── navbar.component.html
│   │   │   │   ├── navbar.component.ts
│   │   │   │   └── navbar.module.ts
│   │   │   └── pagesnavbar
│   │   │       ├── pagesnavbar.component.css
│   │   │       ├── pagesnavbar.component.html
│   │   │       ├── pagesnavbar.component.spec.ts
│   │   │       ├── pagesnavbar.component.ts
│   │   │       └── pagesnavbar.module.ts
│   │   ├── sidebar
│   │   │   ├── sidebar.component.html
│   │   │   ├── sidebar.component.ts
│   │   │   └── sidebar.module.ts
│   │   ├── tables
│   │   │   ├── datatable.net
│   │   │   │   ├── datatable.component.html
│   │   │   │   └── datatable.component.ts
│   │   │   ├── extendedtable
│   │   │   │   ├── extendedtable.component.html
│   │   │   │   └── extendedtable.component.ts
│   │   │   ├── regulartable
│   │   │   │   ├── regulartable.component.html
│   │   │   │   └── regulartable.component.ts
│   │   │   ├── tables.module.ts
│   │   │   └── tables.routing.ts
│   │   └── userpage
│   │       ├── user.component.html
│   │       ├── user.component.ts
│   │       ├── user.module.ts
│   │       └── user.routing.ts
│   ├── assets
│   │   ├── css
│   │   │   ├── bootstrap.min.css
│   │   │   ├── demo.css
│   │   │   ├── light-bootstrap-dashboard.css
│   │   │   ├── light-bootstrap-dashboard.css.map
│   │   │   └── pe-icon-7-stroke.css
│   │   ├── fonts
│   │   ├── img
│   │   ├── js
│   │   │   ├── jquery-jvectormap.js
│   │   │   ├── perfect-scrollbar.min.js
│   │   │   └── sweetalert2.js
│   │   └── sass
│   │       ├── lbd
│   │       └── light-bootstrap-dashboard.scss
│   ├── environments
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.css
│   ├── test.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.spec.json
│   └── typings.d.ts
├── tsconfig.json
├── tslint.json
├── typings
└── typings.json
```

### Version logs

V1.0.0 - 22 Feb 2017 [initial Release]

V1.0.0 - 1 Mar 2017 [Added Sketch Files]

V1.0.1 - 21 Mar 2017
- added "@types/core-js": "0.9.35" in package


## Useful Links

More products from Creative Tim: <https://www.creative-tim.com/bootstrap-themes>

Tutorials: <https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w>

Freebies: <https://www.creative-tim.com/products>

Affiliate Program (earn money): <https://www.creative-tim.com/affiliates/new>

Social Media:

Twitter: <https://twitter.com/CreativeTim>

Facebook: <https://www.facebook.com/CreativeTim>

Dribbble: <https://dribbble.com/creativetim>

Google+: <https://plus.google.com/+CreativetimPage>

Instagram: <https://instagram.com/creativetimofficial>

[CHANGELOG]: ./CHANGELOG.md

[LICENSE]: ./LICENSE

[version-badge]: https://img.shields.io/badge/version-1.2.1-blue.svg

<!-- [license-badge]: https://img.shields.io/badge/license-MIT-blue.svg -->
