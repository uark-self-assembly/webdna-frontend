import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../services/user/user';
import { Project } from '../../../services/project/project';
import { ProjectService } from '../../../services/project/project.service';
import { AuthenticationService } from '../../../services/auth-guard/auth.service';

declare var $: any;

@Component({
    selector: 'project-list',
    templateUrl: './project-list.component.html'
})

export class ProjectListComponent implements OnInit {
    @Input()
    user: User;

    @Input()
    public projectClicked: (project: Project) => void;

    addingProject = false;

    get firstName() {
        if (!this.user) {
            return '';
        } else {
            return this.user.first_name;
        }
    }

    projects: Project[];

    addProjectConfirmed = ((project: Project) => {
        this.projectService.createProject(project).then(response => {
            if (typeof response === 'string') {
                console.log(response);
            } else {
                this.projects.push(response as Project);
                this.addingProject = false;
            }
        });
    }).bind(this);

    runClicked = ((project: Project) => {
        console.log('Do something with this ...');
    }).bind(this);

    deleteClicked = ((project: Project) => {
        this.projectService.deleteProject(project).then(deleted => {
            if (deleted) {
                this.projects = this.projects.filter((p) => p.id !== project.id);
            } else {
                console.log('could not delete project');
            }
        });
    }).bind(this);

    constructor(
        private authService: AuthenticationService,
        private projectService: ProjectService) {

    }

    ngOnInit() {
        this.projectService.getProjects().then(response => {
            if (typeof response === 'string') {
                console.log(response);
            } else {
                this.projects = response as Project[];
            }
        });
    }

    addProjectClicked() {
        this.addingProject = true;
    }

    cancelAddProjectClicked() {
        this.addingProject = false;
    }
}
