import { Component, OnInit, Input, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { Project, LogResponse } from '../../../../services/project/project';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { ProjectService } from '../../../../services/project/project.service';

declare var $: any;

export class ProjectRow {
    project: Project;
    downloading = false;

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
                    return 'Terminated: ' + minutes + ' min';
                } else {
                    return 'Finished: ' + minutes + ' min';
                }
            }

            const currentTime = new Date().getTime();
            const startTime = new Date(this.project.job.start_time).getTime();

            return 'Running: ' + Math.floor((currentTime - startTime) / 60000) + ' min'
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
export class ProjectTableComponent implements OnInit, OnDestroy, AfterViewChecked {
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

    private openedProjectId: string;
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

    setDropdownBehavior() {
        $('[data-toggle="collapse-hover"]').each(() => {
            const thisdiv = $(this).attr('data-target');
            $(thisdiv).addClass('collapse-hover');
        });

        $('[data-toggle="collapse-hover"]').hover(() => {
            const thisdiv = $(this).attr('data-target');
            if (!$(this).hasClass('state-open')) {
                $(this).addClass('state-hover');
                $(thisdiv).css({
                    'height': '30px'
                });
            }

        }, () => {
            const thisdiv = $(this).attr('data-target');
            $(this).removeClass('state-hover');

            if (!$(this).hasClass('state-open')) {
                $(thisdiv).css({
                    'height': '0px'
                });
            }
        }).click(event => {
            event.preventDefault();

            const thisdiv = $(this).attr('data-target');
            const height = $(thisdiv).children('.panel-body').height();

            if ($(this).hasClass('state-open')) {
                $(thisdiv).css({
                    'height': '0px',
                });
                $(this).removeClass('state-open');
            } else {
                $(thisdiv).css({
                    'height': height + 30,
                });
                $(this).addClass('state-open');
            }
        });

        if ($('.dropdown').hasClass('show-dropdown')) {
            $('.dropdown').addClass('open');
        }
    }

    ngAfterViewChecked() {
        this.setDropdownBehavior();
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

    groupOpened(row: ProjectRow) {
        this.openedProjectId = row.project.id;
    }

    groupClosed(row: ProjectRow) {
        if (this.openedProjectId === row.project.id) {
            this.openedProjectId = '';
        }
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

    restartClicked(row: ProjectRow) {
        // TODO (jace) restart simulation
    }

    startClicked(row: ProjectRow) {
        // TODO (jace) start simulation
    }

    viewOutputClicked(row: ProjectRow) {
        console.log('View output clicked on ' + row.project.id);
        this.hyperlinkClicked(row.project);
        this.logmodal.open();
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
