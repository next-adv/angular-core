import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'nxt-accordion-lines',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss'],
})
export class AccordionLinesComponent implements OnInit {
    exploded = false;

    @Input() data: any = {};

    constructor() {
    }

    ngOnInit() {
        console.log('LINE', this.data);
    }

    toggleLayout() {
        this.exploded = !this.exploded;
    }

    myDecodeURIComponent(lastname) {
        return decodeURIComponent(lastname);
    }
}
