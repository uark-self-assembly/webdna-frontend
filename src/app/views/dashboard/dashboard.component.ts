import { Component, OnInit } from '@angular/core';
import { User } from '../../services/user/user';
import { UserService } from '../../services/user/user.service';
import { AuthenticationService } from '../../services/auth-guard/auth.service';
import { Project } from '../../services/project/project';
import { StorageService } from '../../services/storage/storage.service';

declare var $: any;

export enum ProjectPage {
  TABLE, SETTINGS, ANALYSIS
}

@Component({
  selector: 'dashboard-cmp',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private ProjectPage = ProjectPage;

  private user: User = null;
  private loading = true;

  private currentPage: ProjectPage = ProjectPage.TABLE;
  private editingProject: Project = null;

  projectClicked = ((project: Project) => {
    this.editingProject = project;
    this.currentPage = ProjectPage.SETTINGS;
  }).bind(this);

  didClickBackFromConfig = (() => {
    this.editingProject = null;
    this.currentPage = ProjectPage.TABLE;
  }).bind(this);

  didClickAnalysis = (() => {
    this.currentPage = ProjectPage.ANALYSIS;
  }).bind(this);

  didClickBackFromAnalysis = (() => {
    this.currentPage = ProjectPage.SETTINGS;
  }).bind(this);

  constructor(private storageService: StorageService) {

  }

  ngOnInit() {
    this.user = this.storageService.user;
  }
}
