import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Project } from 'app/services/project/project';
import { Script } from 'app/services/script/script';
import { ScriptService } from 'app/services/script/script.service';

@Component({
  selector: 'project-analysis',
  templateUrl: './project-analysis.component.html'
})
export class ProjectAnalysisComponent implements OnInit {

  @ViewChild('uploadModal') uploadModal;

  @Input()
  public project: Project;

  @Input()
  public didClickBack: () => void;

  private newScript: Script = new Script();
  private newScriptFile: File = null;

  private scripts: Script[] = [];

  constructor(private scriptService: ScriptService) { }

  ngOnInit() {
    this.refreshScripts();
  }

  backClicked() {
    this.didClickBack();
  }

  deleteScript(script: Script) {
    // TODO (jace) delete this script
    console.log(script);
  }

  fileChange(event) {
    // do something
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.newScriptFile = fileList[0];
      this.newScript.file_name = this.newScriptFile.name;
    }
  }

  refreshScripts() {
    this.newScript = new Script();
    this.newScriptFile = null;
    this.scriptService.getScripts().then(response => {
      if (typeof response === 'string') {
        console.log(response);
      } else {
        this.scripts = response;
        console.log(this.scripts);
      }
    }, error => {
      console.log(error);
    });
  }

  uploadClicked() {
    this.uploadModal.open();
  }

  closeModal() {
    this.uploadModal.close();
    console.log(this.newScript);
    console.log(this.newScriptFile);
  }

  uploadScriptClicked() {
    if (!this.newScriptFile || !this.newScript.file_name || !this.newScript.description) {
      return;
    }

    this.closeModal();

    if (!this.newScript.file_name.endsWith('.py')) {
      this.newScript.file_name = this.newScript.file_name + '.py';
    }

    this.scriptService.uploadScript(this.newScriptFile, this.newScript).then(response => {
      this.refreshScripts();
    }, error => {
      console.log(error);
    });
  }
}
