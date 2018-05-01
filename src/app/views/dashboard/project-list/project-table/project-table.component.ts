import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Project } from '../../../../services/project/project';
import { ApiService, LogResponse } from '../../../../services/api-service/api.service';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

declare var $: any;

export class ProjectRow {
    project: Project;
    running = false;

    constructor(project: Project) {
        this.project = project;
    }
}

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
        this.projectRows = this._projects.map(p => new ProjectRow(p));
        this.checkRunning();
    }

    get projects() {
        return this._projects;
    }

    private logHeight = 500;

    private outputString: string;
    private selectedProject: Project = null;
    private projectRunning = true;
    private logText = '';

    private projectRows: ProjectRow[] = [];

    private timer: Observable<number>;
    private subscription: Subscription;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.timer = TimerObservable.create(0, 600);
        this.subscription = this.timer.subscribe(value => {
            if (this.selectedProject !== null && this.projectRunning) {
                this.updateLogText();
            }
        });
    }

    checkRunning() {
        for (const row of this.projectRows) {
            this.apiService.checkRunning(row.project.id).then(response => {
                if (typeof response !== 'string') {
                    row.running = response.running;
                }
            }, error => {
                row.running = false;
            });
        }
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

                this.projectRunning = logResponse.running;

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
            this.projectRunning = true;
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
        this.projectRunning = true;
    }

    closeModal() {
        this.logmodal.close();
        this.selectedProject = null;
        this.projectRunning = true;
    }

    projectCancelled(row: ProjectRow) {
        this.apiService.terminate(row.project.id).then(response => {
            row.running = false;
        }, error => {
            row.running = false;
        });
    }
}
