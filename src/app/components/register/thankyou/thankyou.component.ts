import {Component, OnInit} from '@angular/core';
import {Global} from '../../../app.global';


@Component({
    selector: 'app-thankyou',
    templateUrl: './thankyou.component.html',
    styleUrls: ['./thankyou.component.css']
})

export class ThankYouComponent implements OnInit {
    homeRoute: string;

    constructor() {
        this.homeRoute = Global.mains[1];
    }

    ngOnInit() {
    }
}
