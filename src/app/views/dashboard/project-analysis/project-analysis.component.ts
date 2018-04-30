import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'app/services/project/project';
import { Script } from 'app/services/script/script';
import { ScriptService } from 'app/services/script/script.service';

@Component({
  selector: 'project-analysis',
  templateUrl: './project-analysis.component.html'
})
export class ProjectAnalysisComponent implements OnInit {

  @Input()
  public project: Project;

  @Input()
  public didClickBack: () => void;

  private scripts: Script[] = [
    new Script('count_h_bonds.py', 'This is a script that counts the number of Hydrogen bonds'),
    new Script('count_ladders.py', 'This script counts the number of whatevers you want')
  ];

  constructor(private scriptService: ScriptService) { }

  ngOnInit() {
    // this.scriptService.getScripts().then(response => {
    //   if (typeof response === 'string') {
    //     console.log(response);
    //   } else {
    //     this.scripts = response;
    //     console.log(this.scripts);
    //   }
    // }, error => {
    //   console.log(error);
    // });
  }

  backClicked() {
    this.didClickBack();
  }
}
