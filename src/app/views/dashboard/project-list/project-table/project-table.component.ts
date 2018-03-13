import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../../services/project/project';

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
                displayed: [project.name, project.created_on, project.job_running]
            });
        }

        this.tableData = {
            headerRow: [ 'Name', 'Created On', 'Running'],
            dataRows: dataRows
        };
    }
}
