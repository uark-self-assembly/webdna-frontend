import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Project } from '../../../services/project/project';
import { Script } from '../../../services/script/script';
import { ScriptService } from '../../../services/script/script.service';
import { User } from '../../../services/user/user';
import { StorageService } from '../../../services/storage/storage.service';
import { ScriptUploadDialogComponent } from './script-upload-dialog/script-upload-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { ProjectPage } from '../dashboard.component';


@Component({
    selector: 'project-analysis',
    templateUrl: './project-analysis.component.html',
    styleUrls: ['./project-analysis.component.css']
})
export class ProjectAnalysisComponent implements OnInit, OnDestroy {

    @Input()
    public project: Project;

    @Input()
    public didClickBack: () => void;

    @Input()
    public currentPage: ProjectPage;

    get user(): User {
        return this.storageService.user;
    }

    private newScript: Script = new Script();
    private newScriptFile: File = null;

    private scripts: Script[] = [];
    private pipeline: Script[] = [];

    private isDragging = false;

    private analysisLogTimer: Observable<number>;
    private analysisLogSubscription: Subscription;
    private analysisLogText = 'Analysis has not been run. Click "Save and Run" to run the first execution';

    constructor(
        private scriptService: ScriptService,
        private storageService: StorageService,
        private dialog: MatDialog) { }

    ngOnInit() {
        this.scriptService.getScripts().then(scripts => {
            if (typeof scripts !== 'string') {
                this.scripts = scripts;
            }

            this.fetchScriptChain();
        });

        this.analysisLogTimer = TimerObservable.create(0, 1500);
        this.analysisLogSubscription = this.analysisLogTimer.subscribe(_ => {
            if (this.currentPage === ProjectPage.ANALYSIS) {
                this.updateAnalysisLog();
            }
        });
    }

    ngOnDestroy() {
        this.analysisLogSubscription.unsubscribe();
    }

    backClicked() {
        this.didClickBack();
    }

    refreshScripts() {
        this.scriptService.getScripts().then(scripts => {
            this.scripts = scripts;
        });
    }

    fetchScriptChain() {
        this.scriptService.getScriptChain(this.project.id).then((response: string[]) => {
            if (typeof response !== 'string') {
                this.setPipeline(response);
            } else {
                this.pipeline = [];
            }
        });
    }

    updateAnalysisLog() {
        this.scriptService.getAnalysisLog(this.project.id).then(response => {
            if (typeof response === 'string') {
                this.analysisLogText = response;
            }
        });
    }

    setPipeline(uuids: string[]) {
        this.pipeline = [];
        for (const uuid of uuids) {
            const scriptIndex = this.scripts.findIndex(value => {
                return value.id === uuid;
            });
            this.pipeline.push(this.scripts[scriptIndex]);
        }
    }

    saveClicked() {
        this.scriptService.setPipeline(this.project.id, this.pipeline).then(response => {

        });
    }

    saveAndRunClicked() {
        this.scriptService.setPipeline(this.project.id, this.pipeline).then(_ => {
            this.scriptService.runAnalysis(this.project.id).then(response => {

            });
        });
    }

    scriptDropSuccess(event) {
        if (event.dragData.fromScripts) {
            this.pipeline.push(event.dragData.script);
        }
    }

    removeScript(index: number) {
        this.pipeline.splice(index, 1);
    }

    uploadScriptClicked() {
        const dialogRef = this.dialog.open(ScriptUploadDialogComponent, {});
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshScripts();
            }
        });
    }

    manageScriptsClicked() {
        // TODO (jace) implement scripts page and link to it here
    }
}
