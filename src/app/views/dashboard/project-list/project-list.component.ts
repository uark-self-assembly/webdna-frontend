import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Project } from '../../../services/project/project';
import { ProjectService } from '../../../services/project/project.service';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import { ProjectPage } from '../dashboard.component';
import { StorageService } from '../../../services/storage/storage.service';
import { User } from '../../../services/user/user';

declare var $: any;

@Component({
    selector: 'project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.css']
})

export class ProjectListComponent implements OnInit, OnDestroy {
    @Input()
    public projectClicked: (project: Project) => void;

    @Input()
    currentPage: ProjectPage;

    addingProject = false;

    projects: Project[];

    addProjectConfirmed = ((project: Project) => {
        this.projectService.createProject(project).then(response => {
            if (typeof response === 'string') {
                console.log(response);
            } else {
                this.projects.unshift(response);
                this.addingProject = false;
            }
        });
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

    duplicateClicked = ((project: Project) => {
        this.projectService.duplicateProject(project.id).then(response => {
            console.log('duplicated');
            console.log(response);
            this.projects.unshift(response);
            const tempProjects = this.projects;
            this.projects = new Array<Project>();
            tempProjects.forEach(p => this.projects.push(p));
            console.log(this.projects);
        });
    }).bind(this);

    get user(): User {
        return this.storageService.user;
    }

    private projectsTimer: Observable<number>;
    private projectsSubscription: Subscription;

    constructor(
        private storageService: StorageService,
        private projectService: ProjectService) {

    }

    ngOnInit() {
        this.projectsTimer = TimerObservable.create(0, 5000);
        this.projectsSubscription = this.projectsTimer.subscribe(_ => {
            if (!this.addingProject && this.currentPage === ProjectPage.TABLE) {
                this.refreshAllProjects();
            }
        });
        // this.refreshAllProjects();
    }

    ngOnDestroy() {
        this.projectsSubscription.unsubscribe();
    }

    refreshAllProjects() {
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
