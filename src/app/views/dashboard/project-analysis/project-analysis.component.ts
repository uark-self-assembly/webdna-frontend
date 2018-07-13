import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../services/project/project';
import { Script } from '../../../services/script/script';
import { ScriptService } from '../../../services/script/script.service';
import { User } from '../../../services/user/user';
import { StorageService } from '../../../services/storage/storage.service';
import { ScriptUploadDialogComponent } from './script-upload-dialog/script-upload-dialog.component';
import { MatDialog } from '@angular/material/dialog';

class PipelineNode {
  script: Script;
}

@Component({
  selector: 'project-analysis',
  templateUrl: './project-analysis.component.html',
  styleUrls: ['./project-analysis.component.css']
})
export class ProjectAnalysisComponent implements OnInit {

  @Input()
  public project: Project;

  @Input()
  public didClickBack: () => void;

  get user(): User {
    return this.storageService.user;
  }

  private newScript: Script = new Script();
  private newScriptFile: File = null;

  private scripts: Script[] = [];
  private nodes: PipelineNode[] = [];

  constructor(
    private scriptService: ScriptService,
    private storageService: StorageService,
    private dialog: MatDialog) { }

  ngOnInit() {

  }

  backClicked() {
    this.didClickBack();
  }

  saveClicked() {
    // TODO (jace) save the analysis settings
  }

  saveAndRunClicked() {
    // TODO (jace) save the analysis settings and run the analysis
  }

  uploadScriptClicked() {
    this.dialog.open(ScriptUploadDialogComponent, {});
  }
}
