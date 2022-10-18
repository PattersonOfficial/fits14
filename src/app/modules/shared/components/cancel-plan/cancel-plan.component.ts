import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/user/user.model';
import { StorageService } from '../../../../services/auth/storage.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../admin/modules/users/components/users/users.service';

@Component({
    selector: 'app-cancel-plan',
    templateUrl: './cancel-plan.component.html',
    styleUrls: ['./cancel-plan.component.scss']
})

export class CancelPlanComponent implements OnInit {
    public user: User;
    public loader = false;
    public planCanceled = false;

    constructor(
        public _storageService: StorageService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CancelPlanComponent>,
        private _userService: UsersService,
    ) {
    }

    ngOnInit() {
        this.user = this._storageService.getCurrentUser();
    }

    closeModal(action?: any): void {
        console.log({ action });
        this.loader = false;
        this.dialogRef.close(action);
    }

    cancelPlan() {
        this.loader = true;
        this._userService.cancelPlan().subscribe(() => {
            this.planCanceled = true;
            this.loader = false;
        });
    }
}
