import { Component, Input, OnInit } from '@angular/core';
import { SimulationOption } from '../project-config.component';

@Component({
    selector: 'simulation-file-upload',
    templateUrl: './simulation-file-upload.component.html'
})
export class SimulationFileUploadComponent implements OnInit {
    @Input()
    option: SimulationOption;

    private existingFile = false;

    constructor() { }

    ngOnInit() {
        // TODO (jace) check if file already exists
    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.option.value = fileList[0];
        }
    }

    fileButtonClicked() {
        document.getElementById(this.option.propertyName).click();
    }

    viewExistingClicked() {
        // TODO (jace) display current file
    }
}
