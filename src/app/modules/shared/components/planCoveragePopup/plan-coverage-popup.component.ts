import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-plan-coverage-popup',
    templateUrl: './plan-coverage-popup.component.html',
    styleUrls: ['./plan-coverage-popup.component.css'],
})

export class PlanCoveragePopupComponent implements OnInit {
    @Input() neededMembership: number;
    @Output() emitChoosePlan = new EventEmitter();
    @Output() emitClosePlanCoveragePopup = new EventEmitter();

    public planName: string;
    public programType: string;

    constructor(
    ) {
    }

    ngOnInit() {
        // console.log({ neededMembership: this.neededMembership });
        switch (this.neededMembership) {
            case 3:
                this.planName = 'Premium';
                this.programType = 'Wellness';
                break;
            case 2:
                this.planName = 'Pro';
                this.programType = 'Nutrition';
                break;
            default:
                this.planName = 'Premium';
                this.programType = 'Fitness';
        }
    }

    closePlanCoveragePopup(e) {
        // e.stopPropagation();
        // if (!e.target.closest('.plan-coverage-popup')) {
        //     this.emitClosePlanCoveragePopup.emit();
        // }
        this.emitClosePlanCoveragePopup.emit();
    }

    openDialogPlan() {
        this.emitChoosePlan.emit();
        this.emitClosePlanCoveragePopup.emit();
    }
}



