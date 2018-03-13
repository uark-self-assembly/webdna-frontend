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
        console.log("Adding project: " + project.name);
        this.projectService.putProject(project).then(response => {
            if (response.status == 200) {
                this.projects.push(response.response as Project);
                this.addingProject = false;
            } else {
                console.log("Error creating project...");
            }
        });
    }).bind(this);

    projectClicked = ((project: Project) => {
        console.log(this);
        this.projectService.executeProject(project).then(status => {
            console.log(status);
        });
    }).bind(this);
}
