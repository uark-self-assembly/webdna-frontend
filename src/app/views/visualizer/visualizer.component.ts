import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Project } from '../../services/project/project';
import { ProjectService } from '../../services/project/project.service';
import { RequestService } from '../../services/request/request.service' ;

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
  
  @ViewChild('analysisLink') analysisLink: ElementRef;

  constructor(private projectService: ProjectService, private requestService: RequestService) {

  }

  ngOnInit() {
    this.loadProjects();
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
	
	this.setLink();
  }

  showHTMOL() {
    this.loading = false;
  }
  
  setLink() {
      var url = this.requestService.host + '/analysis/webpage/full_page.html?PROJECT_ID=' + this.selectedProject.id ;
      this.analysisLink.nativeElement.href = url ;
  }
}
