import {Component, OnInit, ViewChild} from '@angular/core';
import { User } from '../../../../../../models/user/user.model';
import { StorageService } from '../../../../../../services/auth/storage.service';
import { QuestionsComponent } from '../../../../../shared/components/questions/questions.component';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html'
})

export class UserComponent implements OnInit {
    @ViewChild(QuestionsComponent, {static: false}) questionsRef: QuestionsComponent;
    public user: User;
    public id: string;


    constructor(
        public _storageService: StorageService,
        public dialog: MatDialog,
        public _route: ActivatedRoute,
    ) {


    }

    ngOnInit() {
        this.user = new User();
        if (this._storageService.isAuthenticated()) {
            this.user = this._storageService.getCurrentUser();
        }
        this._route.params.subscribe(params => {
            this.id = params.id;
            // alert('reload')
            // window.location.reload();
        });
    }

}
