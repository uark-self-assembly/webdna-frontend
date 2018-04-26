import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';

declare var $: any;

@Component({
  selector: 'visualizer-cmp',
  templateUrl: './visualizer.component.html'
})
export class VisualizerComponent implements OnInit {

  private text = 'testing';

  constructor(private storageService: StorageService) {

  }

  ngOnInit() {

  }
}
