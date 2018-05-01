import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Project } from 'app/services/project/project';
import { Script } from 'app/services/script/script';
import { ScriptService } from 'app/services/script/script.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

class PipelineNode {
  script: Script;
}

@Component({
  selector: 'project-analysis',
  templateUrl: './project-analysis.component.html'
})
export class ProjectAnalysisComponent implements OnInit, OnDestroy {

  @ViewChild('uploadModal') uploadModal;

  @Input()
  public project: Project;

  @Input()
  public didClickBack: () => void;

  private newScript: Script = new Script();
  private newScriptFile: File = null;

  private scripts: Script[] = [];
  private nodes: PipelineNode[] = [];

  private logText = 'Analysis not started.';
  private logHeight = '300';

  private timer: Observable<number>;
  private subscription: Subscription;

  constructor(private scriptService: ScriptService) { }

  ngOnInit() {
    this.refreshScripts();
  }

  ngOnDestroy() {
  }

  backClicked() {
    this.didClickBack();
  }

  deleteScript(script: Script) {
    this.scriptService.deleteScript(script.id).then(response => {
      this.refreshScripts();
    }, error => {
      console.log(this);
    })
  }

  fileChange(event) {
    // do something
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.newScriptFile = fileList[0];
      this.newScript.file_name = this.newScriptFile.name;
    }
  }

  scriptWithName(name: string): Script {
    const index = this.scripts.findIndex((value) => {
      return value.file_name === name
    });

    if (index >= 0) {
      return this.scripts[index];
    } else {
      return null;
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

        this.fetchPipeline();

        if (this.nodes.length === 0 && this.scripts.length > 0) {
          const newNode = new PipelineNode();
          newNode.script = this.scripts[0];
          this.nodes.push(newNode);
        }

        let i = 0;
        while (i < this.nodes.length) {
          const foundScript = this.scriptWithName(this.nodes[i].script.file_name);
          if (foundScript === null) {
            this.nodes = this.nodes.splice(i, 1);
          } else {
            i++;
          }
        }
      }
    }, error => {
      console.log(error);
    });
  }

  fetchPipeline() {
    this.scriptService.getPipeline(this.project.id).then(response => {
      const scripts = response.split(',');
      this.nodes = [];
      for (const script of scripts) {
        const foundScript = this.scriptWithName(script);
        if (foundScript !== null) {
          const newNode = new PipelineNode();
          newNode.script = foundScript;
          this.nodes.push(newNode);
        }
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

  refreshAnalysis() {
    this.scriptService.getAnalysisLog(this.project.id).then(response => {
      if (typeof response === 'string') {
        this.logText = response;
      } else {
        this.logText = response.join('\n');
      }
    }, error => {
      this.logText = 'Analysis not started.';
    });
  }

  insertRowClicked() {
    if (this.scripts.length === 0) {
      return;
    }

    const newNode = new PipelineNode();
    newNode.script = this.scripts[0];
    this.nodes.push(newNode);
  }

  deleteRowClicked(node: PipelineNode) {
    const index = this.nodes.indexOf(node);
    if (index !== -1) {
      this.nodes.splice(index, 1);
    }
  }

  chooseScript(node: PipelineNode, script: Script) {
    node.script = script;
  }

  executeAnalysisClicked() {
    this.scriptService.setPipeline(this.project.id, this.nodes.map(n => n.script)).then(response => {
      console.log(response);
    }, error => {
      console.log(error);
    })
  }
}
