import { Component, OnInit, Input } from '@angular/core';
import { User } from "../../../services/user/user";
import { Project } from '../../../services/project/project';
import { ProjectService } from '../../../services/project/project.service';
import { AuthenticationService } from '../../../services/auth-guard/auth.service';

declare var $:any;

@Component({
    selector: 'project-config',
    templateUrl: './project-config.component.html'
})

export class ProjectConfigComponent {
    @Input()
    project: Project;

    constructor(private projectService: ProjectService) {

    }

    ngOnInit() {
        console.log("showing");
    }
}
