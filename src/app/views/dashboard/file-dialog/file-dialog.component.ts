import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from '../../../services/project/project';
import { ProjectService } from '../../../services/project/project.service';
import { FileResponse } from '../../../services/request/request.service';
import { Response } from '@angular/http';

export interface FileDialogData {
    project: Project;
    projectFileType: string;
}

@Component({
    selector: 'file-dialog',
    templateUrl: './file-dialog.component.html'
})
export class FileDialogComponent implements OnInit {

    private fileLines: string[] = [];

    constructor(
        private projectService: ProjectService,
        public dialogRef: MatDialogRef<FileDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: FileDialogData) { }

    ngOnInit() {
        this.projectService.downloadFile(this.data.project.id, this.data.projectFileType).then((response: Response) => {
            console.log(response);
            try {
                this.fileLines = response.text().split('\n');
            } catch {
                this.onCloseClicked();
            }
        }, _ => {
            this.onCloseClicked();
        });
    }

    onCloseClicked(): void {
        this.dialogRef.close();
    }
}
