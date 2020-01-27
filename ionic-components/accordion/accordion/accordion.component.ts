import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'nxt-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {
    exploded = false;

    @Input() data: any = {};

    constructor() {
    }

    ngOnInit() {
        console.log("LINE", this.data);
    }

    toggleLayout() {
        this.exploded = !this.exploded;
    }

}
