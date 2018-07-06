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

    get running() {
        return this.project.job && !this.project.job.finish_time;
    }

    get hasOutput() {
        return this.project.job;
    }

    get executionTime() {
        if (this.hasOutput) {
            if (!this.running) {
                const finishTime = new Date(this.project.job.finish_time).getTime();
                const startTime = new Date(this.project.job.start_time).getTime();
                const minutes = Math.floor((finishTime - startTime) / 60000);

                if (this.project.job.terminated) {
                    return 'Terminated after ' + minutes + ' min';
                } else {
                    return 'Finished after ' + minutes + ' min';
                }
            }

            const currentTime = new Date().getTime();
            const startTime = new Date(this.project.job.start_time).getTime();

            return '' + Math.floor((currentTime - startTime) / 60000) + ' min'
        } else {
            return 'Never run.';
        }
    }

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

    private logTimer: Observable<number>;
    private logSubscription: Subscription;

    constructor(private projectService: ProjectService) { }

    ngOnInit() {
        this.logTimer = TimerObservable.create(0, 600);
        this.logSubscription = this.logTimer.subscribe(_ => {
            if (this.selectedProject !== null && this.projectRunning) {
                this.updateLogText();
            }
        });
    }

    ngOnDestroy() {
        this.logSubscription.unsubscribe();
    }

    dateString(date: Date): string {
        return moment(date).format('MMMM DD, YYYY @ h:mm a');
    }

    refreshSelectedProject() {
        if (!this.selectedProject) {
            return;
        }

        this.projectService.getProjectById(this.selectedProject.id).then(response => {
            if (typeof response === 'string') {
                this.selectedProject = null;
            } else {
                this.selectedProject = response;
            }
        });
    }

    updateLogText() {
        this.projectService.getCurrentOutput(this.selectedProject.id).then(response => {
            if (typeof response === 'string') {
                this.oxDNALogText = 'No logs found for this project.';
            } else {
                const logResponse = response as LogResponse;

                this.oxDNALogText = logResponse.stdout;
                this.programLogText = logResponse.log;

                if (this.projectRunning !== logResponse.running) {
                    this.refreshSelectedProject();
                    this.projectRunning = logResponse.running;
                }
            }
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
        this.projectService.stopSimulation(row.project.id).then(_ => {
            this.projectService.getProjectById(row.project.id).then(response => {
                if (typeof response !== 'string') {
                    row.project = response;
                }
            });
        });
    }

    editClicked(row: ProjectRow) {
        this.projectClicked(row.project);
    }
}
