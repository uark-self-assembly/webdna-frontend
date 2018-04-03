import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../../services/project/project';

declare var $:any;

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'project-add',
    templateUrl: './project-add.component.html'
})
export class ProjectAddComponent {
    _project: Project;

    @Input()
    addProjectConfirmed: (project: Project) => void;

    ngOnInit() {
        this._project = new Project();
    }

    addProjectClicked() {
        this.addProjectConfirmed(this._project);
    }
}
