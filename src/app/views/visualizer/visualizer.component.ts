import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';
import { Project } from '../../services/project/project';
import { ProjectService } from '../../services/project/project.service';
import { ApiService } from '../../services/api-service/api.service';

declare var $: any;

@Component({
  selector: 'visualizer-cmp',
  templateUrl: './visualizer.component.html'
})
export class VisualizerComponent implements OnInit {

  private projects: Project[] = [];
  private text = 'testing';
  private loading = true;
  private selectedProject: Project;
  private forcing = false;

  constructor(private projectService: ProjectService, private apiService: ApiService) {

  }

  ngOnInit() {
    this.loadProjects();
  }

  selectProject(project: Project) {
    this.selectedProject = project;
  }

  loadProjects() {
    this.projectService.getProjects().then(response => {
      if (typeof response === 'string') {
        console.log('error');
      } else {
        this.projects = response;
        if (Array.isArray(this.projects) && this.projects.length > 0) {
          this.selectedProject = this.projects[0];
        }
      }
    }, error => {
      console.log(error);
    });
  }

  loadProject() {
    this.loading = true;
    const projectId = this.selectedProject.id;
    this.apiService.getOutput(projectId).then(response => {
      if (typeof response !== 'string') {
        if (response.running) {
          this.forcing = true;
          this.apiService.forceVisualization(projectId).then(res => {
            this.forcing = false;
            this.showHTMOL();
          }, error => {
            this.showHTMOL();
          });
        } else {
          this.showHTMOL();
        }
      }
    }, error => {
      console.log(error);
    });
  }

  showHTMOL() {
    console.log(this.selectedProject);
    this.loading = false;
  }
}
