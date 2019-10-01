import { Component, OnInit } from '@angular/core';
import { Project } from '../../services/project/project';
import { ProjectService } from '../../services/project/project.service';
import { RequestService } from '../../../services/request/request.service' ;

@Component({
  selector: 'visualizer-cmp',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements OnInit {

  projects: Project[] = [];
  selectedProject: Project;

  loading = true;
  forcing = false;

  constructor(private projectService: ProjectService) {

  }

  ngOnInit() {
    this.loadProjects();
	this.setLink();
  }

  loadProjects() {
    this.projectService.getProjects().then(response => {
      if (typeof response !== 'string') {
        this.projects = response;
        if (Array.isArray(this.projects) && this.projects.length > 0) {
          this.selectedProject = this.projects[0];
        }
      }
    });
  }
  
  setLink() {
      url = this.requestService.host + '/analysis/webpage/full_page.html' ;
      document.getElementById('link_to_analysis').href = url ;
  }

  loadProject() {
    this.loading = true;

    console.log(this.selectedProject.id);

    const projectId = this.selectedProject.id;

    this.projectService.getProjectById(projectId).then(response => {
      if (response.running) {
        this.forcing = true;
        this.projectService.generateVisualization(projectId).then(_ => {
          this.forcing = false;
          this.showHTMOL();
        }, _ => {
          this.showHTMOL();
        });
      } else {
        this.showHTMOL();
      }
    });
  }

  showHTMOL() {
    this.loading = false;
  }
}
