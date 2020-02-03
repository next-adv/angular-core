import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'nxt-button-switch',
    templateUrl: './button-switch.component.html',
    styleUrls: ['./button-switch.component.scss'],
})
export class ButtonSwitchComponent implements OnInit {

    @Input() options: string[];
    @Input() selected: string;
    @Output() onselect = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
        this.options.length = 2;
    }

    click(event: any) {
        this.selected = event;
        this.onselect.emit(event);
    }

}
