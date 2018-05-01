import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { RequestService } from '../../../services/request/request.service';

declare var $: any;
declare var window: any;

@Component({
  selector: 'htmol-cmp',
  templateUrl: './htmol.component.html'
})
export class HtmolComponent implements AfterViewInit {

  private projectId = 'dfce4a51-091c-4ae8-ab37-11876180a544';

  @ViewChild('htmolFrame') htmolFrame: ElementRef;

  constructor(private http: Http, private requestService: RequestService) {
    window.PROJECT_ID = this.projectId;
  }

  ngAfterViewInit() {
    // this.htmolFrame.nativeElement.src = './static/HTMoL.html';
    this.htmolFrame.nativeElement.srcdoc = '<html><body>Loading visualizer...</body></html>';
    this.getMainHtmolPage();
  }

  getMainHtmolPage() {
    this.http.get(this.requestService.host + '/static/HTMoL.html').map(res => res.text())
      .subscribe(response => {
        this.htmolFrame.nativeElement.srcdoc = response.replace('%%PROJECTID%%', this.projectId);
      });
  }
}
