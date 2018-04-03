import { Component, OnInit, Input } from '@angular/core';
import { User } from "../../../services/user/user";
import { Project } from '../../../services/project/project';
import { ProjectService } from '../../../services/project/project.service';
import { AuthenticationService } from '../../../services/auth-guard/auth.service';

declare var $:any;

@Component({
    selector: 'project-list',
    templateUrl: './project-list.component.html'
})

export class ProjectListComponent {
    @Input()
    user: User;

    @Input()
    public projectClicked: (project: Project) => void;

    addingProject: boolean = false;

    get firstName() {
        if (!this.user) {
            return "";
        } else {
            return this.user.first_name;
        }
    }
  
    projects: Project[];

    constructor(
        private authService: AuthenticationService,
        private projectService: ProjectService) {

    }

    ngOnInit() {
        this.projectService.getProjects().then(projects => {
            this.projects = projects;
        }, error => {
            console.log(error);
            return false;
        });
    }

    addProjectClicked() {
        this.addingProject = true;
    }

    cancelAddProjectClicked() {
        this.addingProject = false;
    }

    addProjectConfirmed = ((project: Project) => {
        this.projectService.createProject(project).then(response => {
            this.projects.push(response);
            this.addingProject = false;
        });
    }).bind(this);

    runClicked = ((project: Project) => {
        console.log("Do something with this ...");
    }).bind(this);

    deleteClicked = ((project: Project) => {
        this.projectService.deleteProject(project).then(deleted => {
            if (deleted) {
                this.projects = this.projects.filter((p) => p.id !== project.id);
            } else {
                console.log("could not delete project");
            }
        });
    }).bind(this);
}
