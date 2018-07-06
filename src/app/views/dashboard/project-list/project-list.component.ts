import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { User } from '../../../services/user/user';
import { Project } from '../../../services/project/project';
import { ProjectService } from '../../../services/project/project.service';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';

declare var $: any;

@Component({
    selector: 'project-list',
    templateUrl: './project-list.component.html'
})

export class ProjectListComponent implements OnInit, OnDestroy {
    @Input()
    user: User;

    @Input()
    public projectClicked: (project: Project) => void;

    addingProject = false;
    editingProject = false;

    @Input()
    set isCurrentPage(value: boolean) {
        if (value) {
            this.editingProject = false;
        }
    }

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

    deleteClicked = ((project: Project) => {
        this.projectService.deleteProject(project).then(deleted => {
            if (deleted) {
                this.projects = this.projects.filter((p) => p.id !== project.id);
            } else {
                console.log('could not delete project');
            }
        });
    }).bind(this);

    private projectsTimer: Observable<number>;
    private projectsSubscription: Subscription;

    projectClickedList = ((project: Project) => {
        this.editingProject = true;
        this.projectClicked(project);
    }).bind(this);

    constructor(private projectService: ProjectService) {

    }

    ngOnInit() {
        this.projectsTimer = TimerObservable.create(0, 1000);
        this.projectsSubscription = this.projectsTimer.subscribe(_ => {
            if (!this.addingProject && !this.isCurrentPage) {
                this.refreshAllProjects();
            }
        });
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
