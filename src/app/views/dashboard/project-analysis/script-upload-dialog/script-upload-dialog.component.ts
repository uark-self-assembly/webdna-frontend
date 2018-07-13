import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ScriptService } from '../../../../services/script/script.service';

@Component({
    selector: 'script-upload-dialog',
    templateUrl: './script-upload-dialog.component.html'
})
export class ScriptUploadDialogComponent {
    private scriptFile: File = null;
    private newScriptName;
    private newScriptDescription;

    get scriptFileChosen(): boolean {
        return !!this.scriptFile;
    }

    get uploadReady(): boolean {
        return this.scriptFileChosen;
    }

    constructor(
        public dialogRef: MatDialogRef<ScriptUploadDialogComponent>,
        private scriptService: ScriptService) { }

    onCloseClicked(): void {
        this.dialogRef.close();
    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.scriptFile = fileList[0];
            this.newScriptName = this.scriptFile.name;
        }
    }

    uploadClicked() {
        // TODO (jace) upload script
    }
}
