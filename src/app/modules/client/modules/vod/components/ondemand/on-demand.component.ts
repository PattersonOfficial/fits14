import { StorageService } from './../../../../../../services/auth/storage.service';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { VodService } from '../../../../../../services/vod/vod.service';
import { VodProgram } from '../../../../../../models/vodprogram/vodprogram.model';
import {User} from '../../../../../../models/user/user.model';

@Component({
    selector: 'app-client-ondemand',
    templateUrl: './on-demand.component.html',
    styleUrls: ['./on-demand.component.css'],
})

export class OnDemandComponent implements OnInit {
    public loading: boolean;
    public programsList: VodProgram[];
    public popularPrograms: VodProgram[];
    public fitnessPrograms: VodProgram[];
    public wellnessPrograms: VodProgram[];
    public nutritionPrograms: VodProgram[];

    @Input() user: User;
    @Output() onPlayVideo: EventEmitter<any> = new EventEmitter();
    @Output() onShowPaymentModal: EventEmitter<any> = new EventEmitter();
    @Output() onSubscribeVod: EventEmitter<any> = new EventEmitter();

    constructor(
        public _vodService: VodService,
        public _storageService: StorageService
    ) {
        this.loading = true;
        
    }

    ngOnInit() {
        this._storageService.refreshUserData();
        this.loading = true;
        this._vodService.getVodPrograms().subscribe(data => {
            this.programsList = data;

            this.popularPrograms = data.filter(program => program.order_in_popular && program.order_in_popular > 0)
                                        .sort((a, b) => a.order_in_popular < b.order_in_popular ? -1 : 1);
            this.popularPrograms.forEach((item, index) => item.order_in_popular = index + 1);

            this.fitnessPrograms = data.filter(program => program.category_id === 9);

            this.wellnessPrograms = data.filter(program => program.category_id === 13);

            this.nutritionPrograms = data.filter(program => program.category_id === 10);
            
            this.loading = false;
        });
    }

    public handlePlay(video) {
        this.onPlayVideo.emit(video);
    }

    public handlePaymentFormModal(data) {
        this.onShowPaymentModal.emit(data);
    }

    passToProgramVod(event) {
        this.onSubscribeVod.emit(event);
    }
}
