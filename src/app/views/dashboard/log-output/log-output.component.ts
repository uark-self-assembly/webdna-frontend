import { Component, Input } from '@angular/core';

declare var $: any;

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'log-output',
    templateUrl: './log-output.component.html'
})
export class LogOutputComponent {
    @Input()
    private logText: string;

    get lines(): string[] {
        return this.logText.split('\n');
    }
}
