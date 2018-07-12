import { Component, ViewEncapsulation } from '@angular/core';
import { Project } from '../../services/project/project';
import { StorageService } from '../../services/storage/storage.service';

export enum ProjectPage {
  TABLE, SETTINGS, ANALYSIS
}

@Component({
  selector: 'app-dashboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private ProjectPage = ProjectPage;

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

  constructor() { }
}
