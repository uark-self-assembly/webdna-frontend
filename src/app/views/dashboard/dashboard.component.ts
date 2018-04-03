import { Component, OnInit } from '@angular/core';
import { User } from '../../services/user/user';
import { UserService } from '../../services/user/user.service';
import { AuthenticationService } from '../../services/auth-guard/auth.service';
import { Project } from '../../services/project/project';

//import * as Chartist from 'chartist';

declare var $:any;

@Component({
  selector: 'dashboard-cmp',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent {

  scannerList = true;
  scannerSettings = false;
  user: User;
  loading: boolean = true;

  editingProject: Project = {
    user: null,
    name: "Project Example",
    data_file: "empty",
    created_on: new Date()
  };

  private alive: boolean;

  private requestCancelled: boolean;

    constructor(
      private authService: AuthenticationService,
      private userService: UserService) {

    }

    ngOnInit() {
      this.userService.getUsers().then(profile => {
        this.user = profile[0];
      }, error => {
        console.log(error);
        return false;
      });
    }

    projectClicked = ((project: Project) => {
      this.editingProject = project;
    }).bind(this);

    didClickBackFromConfig = (() => {
      this.editingProject = null;
    }).bind(this);
}
