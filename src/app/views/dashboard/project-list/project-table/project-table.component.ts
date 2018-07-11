import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Project, LogResponse } from '../../../../services/project/project';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import { ProjectService } from '../../../../services/project/project.service';

declare var $: any;

export class ProjectRow {
    project: Project;
    starting = false;
    restarting = false;
    downloading = false;

    constructor(project: Project) {
        this.project = project;
    }
}

@Component({
    selector: 'project-table',
    templateUrl: './project-table.component.html',
    styleUrls: ['./project-table.component.css']
})
export class ProjectTableComponent implements OnInit, OnDestroy {
    _projects: Project[];

    @ViewChild('logmodal') logModal;

    @Input()
    projectClicked: (project: Project) => void;

    @Input()
    runClicked: (project: Project) => void;

    @Input()
    deleteClicked: (project: Project) => void;

    @Input()
    duplicateClicked: (project: Project) => void;

    @Input()
    set projects(newProjects) {
        console.log('setter ' + newProjects);
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
    private logOpen = false;

    private openedProjectId: string;
    private selectedRow: ProjectRow = null;
    private oxDNALogText = '';
    private programLogText = '';

    private projectRows: ProjectRow[] = [];

    private logTimer: Observable<number>;
    private logSubscription: Subscription;

    constructor(private projectService: ProjectService) { }

    ngOnInit() {
        this.logTimer = TimerObservable.create(0, 600);
        this.logSubscription = this.logTimer.subscribe(_ => {
            if (this.selectedRow && this.selectedRow.project.running && this.logOpen) {
                this.updateLogText();
            }
        });
    }

    ngOnDestroy() {
        this.logSubscription.unsubscribe();
    }

    refreshSelectedProject() {
        if (!this.selectedRow) {
            return;
        }

        this.projectService.getProjectById(this.selectedRow.project.id).then(response => {
            if (typeof response === 'string') {
                this.selectedRow = null;
            } else {
                this.selectedRow.project = response;
            }
        });
    }

    groupOpened(row: ProjectRow) {
        this.openedProjectId = row.project.id;
        this.selectedRow = row;
    }

    groupClosed(row: ProjectRow) {
        if (this.openedProjectId === row.project.id) {
            this.openedProjectId = '';
            this.selectedRow = null;
        }
    }

    updateLogText() {
        this.projectService.getCurrentOutput(this.selectedRow.project.id).then(response => {
            if (typeof response === 'string') {
                this.oxDNALogText = 'No logs found for this project.';
            } else {
                const logResponse = response as LogResponse;

                this.oxDNALogText = logResponse.stdout;
                this.programLogText = logResponse.log;

                if (this.selectedRow.project.running !== logResponse.running) {
                    this.refreshSelectedProject();
                }
            }
        });
    }

    closeModal() {
        this.logModal.close();
        this.logOpen = false;
        this.oxDNALogText = '';
        this.programLogText = '';
    }

    startSimulation(row: ProjectRow) {
        this.projectService.runSimulation(row.project.id, false).then(_ => {
            this.projectService.getProjectById(row.project.id).then(response => {
                if (typeof response !== 'string') {
                    row.project = response;
                }
                row.starting = false;
                row.restarting = false;
            });
        });
    }

    restartClicked(row: ProjectRow) {
        row.restarting = true;
        if (row.project.running) {
            this.projectService.stopSimulation(row.project.id).then(_ => {
                this.startSimulation(row);
            }, error => {
                this.startSimulation(row);
            });
        } else {
            this.startSimulation(row);
        }
    }

    startClicked(row: ProjectRow) {
        row.starting = true;
        this.startSimulation(row);
    }

    viewOutputClicked(row: ProjectRow) {
        this.logOpen = true;
        this.logModal.open();
        this.selectedRow = row;
        this.updateLogText();
    }

    cancelClicked(row: ProjectRow) {
        this.projectService.stopSimulation(row.project.id).then(_ => {
            this.projectService.getProjectById(row.project.id).then(response => {
                if (typeof response !== 'string') {
                    row.project = response;
                }
            });
        });
    }

    downloadClicked(row: ProjectRow) {
        row.downloading = true;
        this.projectService.downloadZipFile(row.project).then(value => {
            const url = window.URL.createObjectURL(value.data);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = value.fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove(); // remove the element
            row.downloading = false;
        });
    }

    editClicked(row: ProjectRow) {
        this.projectClicked(row.project);
    }
}
