import { Component, OnInit } from '@angular/core';
import { User } from '../../services/user/user';
import { UserService } from '../../services/user/user.service';
import { AuthenticationService } from '../../services/auth-guard/auth.service';
import { Project } from '../../services/project/project';
import { StorageService } from '../../services/storage/storage.service';

declare var $: any;

@Component({
  selector: 'dashboard-cmp',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  scannerList = true;
  scannerSettings = false;
  user: User = null;
  loading = true;

  editingProject: Project = null;

  private alive: boolean;

  private requestCancelled: boolean;

  projectClicked = ((project: Project) => {
    this.editingProject = project;
  }).bind(this);

  didClickBackFromConfig = (() => {
    this.editingProject = null;
  }).bind(this);

  constructor(
    private storageService: StorageService,
    private userService: UserService) {

  }

  ngOnInit() {
    this.user = this.storageService.user;
  }
}
