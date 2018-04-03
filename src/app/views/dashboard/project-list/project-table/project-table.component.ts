import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../../services/project/project';
import { ApiService } from '../../../../services/api-service/api.service';

declare var $:any;

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'project-table',
    templateUrl: './project-table.component.html'
})
export class ProjectTableComponent {
    _projects: Project[];

    @Input()
    projectClicked: (project: Project) => void;

    @Input()
    runClicked: (project: Project) => void;

    @Input()
    deleteClicked: (project: Project) => void;

    @Input()
    set projects(newProjects) {
        this._projects = newProjects;
        this.updateTable();
    }

    get projects() {
        return this._projects;
    }

    tableData: TableData = {
        headerRow: [],
        dataRows: []
    };

    private outputString: string;
    private selectedProject: Project = new Project();
    private logText: string = '';

    constructor(private apiService: ApiService) {

    }

    ngOnInit() {
        this.updateTable();
    }

    updateTable() {
        if (this._projects == undefined) {
            return;
        }

        let dataRows = []

        for (let i = 0; i < this._projects.length; i++) {
            let project = this._projects[i];
            dataRows.push({
                project: project,
                displayed: [project.name, project.created_on]
            });
        }

        this.tableData = {
            headerRow: [ 'Name', 'Created On', 'Running'],
            dataRows: dataRows
        };
    }

    status(project: Project) {
        return "Example"
    }

    hyperlinkEntered(object: HTMLAnchorElement) {
        object.style['text-decoration'] = 'underline';
    }

    hyperlinkExited(object: HTMLAnchorElement) {
        object.style['text-decoration'] = 'initial';
    }

    hyperlinkClicked(project: Project) {
        this.selectedProject = project;
        this.apiService.getOutput(project.id).then((response) => {
            let running = response['running'];
            let stdout = response['stdout'];
            let log = response['log'];

            if (!running) {
                this.logText = log + '\n\n\nCONSOLE OUTPUT:\n' + stdout;
                return;
            }

            if (stdout.length == 0) {
                this.logText = log;
            } else {
                this.logText = stdout;
            }
        });
    }
}
