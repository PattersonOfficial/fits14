import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {MentorsService} from './mentors.service';
import {DataTableDirective} from 'angular-datatables';
import {Router, ActivatedRoute} from '@angular/router';
import {Global} from '../../../../../../app.global';
import {User} from '../../../../../../models/user/user.model';

@Component({
    selector: 'app-users',
    templateUrl: './mentors.component.html',
    styleUrls: ['./mentors.component.css']
})
export class MentorsComponent implements OnInit {

    public users;
    public dtTrigger: Subject<any> = new Subject();
    public dtOptions: DataTables.Settings = {};

    @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

    constructor(
        public _mentorsService: MentorsService,
        public _route: ActivatedRoute,
        public _router: Router
    ) {
    }

    ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            language: {
                'search': ' '
            }
        };
        this.listUsers(Global.roles.mentor);
    }

    public listUsers(role): void {
        this._mentorsService.getUsers(role).subscribe(
            data => {
                this.users = data;
                this.dtTrigger.next();
            }
        );
    }

    public pushNewContent(event) {
        this.destroyDtInstance();
        this.listUsers(Global.roles.mentor);
    }

    public trashUser(user: User): void {
        this._mentorsService.trashUser(user).subscribe(
            data => {
                this.destroyDtInstance();
                this.listUsers(Global.roles.mentor);
            }
        );
    }

    public destroyDtInstance(): void {
        this.dtElement.dtInstance.then(dtInstance => {
            dtInstance.destroy();
        });
    }
}
