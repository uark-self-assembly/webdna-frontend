import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Project } from '../../../../services/project/project';
import { ApiService, LogResponse } from '../../../../services/api-service/api.service';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

declare var $: any;

@Component({
    selector: 'project-table',
    templateUrl: './project-table.component.html'
})
export class ProjectTableComponent implements OnInit, OnDestroy {
    _projects: Project[];

    @ViewChild('logmodal') logmodal;

    @Input()
    projectClicked: (project: Project) => void;

    @Input()
    runClicked: (project: Project) => void;

    @Input()
    deleteClicked: (project: Project) => void;

    @Input()
    set projects(newProjects) {
        if (newProjects) {
            newProjects.forEach(project => {
                project.created_on = new Date(project.created_on);
            });
        }
        this._projects = newProjects;
    }

    get projects() {
        return this._projects;
    }

    private logHeight = 500;

    private outputString: string;
    private selectedProject: Project = null;
    private logText = '';

    private timer: Observable<number>;
    private subscription: Subscription;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.timer = TimerObservable.create(0, 600);
        this.subscription = this.timer.subscribe(value => {
            if (this.selectedProject !== null) {
                this.updateLogText();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    dateString(date: Date): string {
        return moment(date).format('MMMM DD, YYYY @ h:mm a');
    }

    updateLogText() {
        this.apiService.getOutput(this.selectedProject.id).then((response) => {
            if (typeof response === 'string') {
                this.logText = 'No logs found for this project.';
            } else {
                const logResponse = response as LogResponse;

                if (!logResponse.running) {
                    this.logText = logResponse.log + '\n\n\nCONSOLE OUTPUT:\n' + logResponse.stdout;
                    return;
                }

                if (logResponse.stdout.length === 0) {
                    this.logText = logResponse.log;
                } else {
                    this.logText = logResponse.stdout;
                }
            }
        }, error => {
            this.closeModal();
            this.selectedProject = null;
        });
    }

    hyperlinkEntered(object: HTMLAnchorElement) {
        object.style['text-decoration'] = 'underline';
    }

    hyperlinkExited(object: HTMLAnchorElement) {
        object.style['text-decoration'] = 'initial';
    }

    hyperlinkClicked(project: Project) {
        this.selectedProject = project;
    }

    closeModal() {
        this.logmodal.close();
        this.selectedProject = null;
    }
}
