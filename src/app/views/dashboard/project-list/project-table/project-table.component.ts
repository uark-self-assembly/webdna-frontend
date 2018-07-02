import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Project, LogResponse } from '../../../../services/project/project';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { ProjectService } from '../../../../services/project/project.service';

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
            this._projects = newProjects;
            this.projectRows = this._projects.map(p => new ProjectRow(p));
        }
        this._projects = newProjects;
        if (this._projects) {
            this.projectRows = this._projects.map(p => new ProjectRow(p));
        }
        this.checkRunning();
    }

    get projects() {
        return this._projects;
    }

    private logHeight = 500;

    private outputString: string;
    private selectedProject: Project = null;
    private projectRunning = true;
    private oxDNALogText = '';
    private programLogText = '';

    private projectRows: ProjectRow[] = [];

    private timer: Observable<number>;
    private subscription: Subscription;

    constructor(private projectService: ProjectService) { }

    ngOnInit() {
        this.timer = TimerObservable.create(0, 600);
        this.subscription = this.timer.subscribe(_ => {
            if (this.selectedProject !== null && this.projectRunning) {
                this.updateLogText();
            }
        });
    }

    checkRunning() {
        for (const row of this.projectRows) {
            this.projectService.getRunningStatus(row.project.id).then(response => {
                if (typeof response !== 'string') {
                    row.running = response.running;
                }
            }, _ => {
                row.running = false;
            });
        }
    }

    setRunning(projectId: string, running: boolean) {
        for (const row of this.projectRows) {
            if (row.project.id === projectId) {
                row.running = running;
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    dateString(date: Date): string {
        return moment(date).format('MMMM DD, YYYY @ h:mm a');
    }

    updateLogText() {
        this.projectService.getCurrentOutput(this.selectedProject.id).then(response => {
            if (typeof response === 'string') {
                this.oxDNALogText = 'No logs found for this project.';
            } else {
                const logResponse = response as LogResponse;

                this.projectRunning = logResponse.running;
                this.oxDNALogText = logResponse.stdout;
                this.programLogText = logResponse.log;

                this.setRunning(this.selectedProject.id, logResponse.running);
            }
        }, _ => {
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
        this.projectService.stopSimulation(row.project.id).then(response => {
            row.running = false;
        }, _ => {
            row.running = false;
        });
    }
}
