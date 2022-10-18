import { ToastrService } from 'ngx-toastr';
import { VodService } from './../../../../../../services/vod/vod.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VodProgram } from '../../../../../../models/vodprogram/vodprogram.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

@Component({
  selector: 'app-my-videos-program',
  templateUrl: './my-videos-program.component.html',
  styleUrls: ['./my-videos-program.component.css'],
})
export class MyVideosProgramComponent implements OnInit {
  @Input() program: VodProgram;
  @Input() isSingle: boolean;
  @Output() onPlayVideo: EventEmitter<any> = new EventEmitter();
  @Output() onResetProgramChoose: EventEmitter<any> = new EventEmitter();

  public category: string;

  constructor(
    public _router: Router,
    public _vodService: VodService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    console.log({ Program: this.program });
    switch (this.program.category_id) {
      case 9:
        this.category = 'Fitness';
        break;
      case 10:
        this.category = 'Nutrition';
        break;
      case 13:
        this.category = 'Wellness';
        break;
      default:
        this.category = '';
    }
  }

  public handlePlayVideo(program) {
    this.onPlayVideo.emit(program);
  }

  public chooseProgram() {
    this._router.navigate(['board/u/vod', 'my-videos', this.program.id]);
  }

  public resetChooseProgram() {
    this._router.navigate(['board/u/vod', 'my-videos']);
  }

  public removeProgram() {
    Swal.fire({
      title: 'Remove this Program?',
      text: "You can always add it again to your list via Series",
      // type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove',
    }).then((result) => {
      if (result.value === true) {
        this._vodService.removePurchasedProgram(this.program).subscribe(
          () => {
            this.toastService.info('Program Removed Successfully.');
            this._router.navigateByUrl('/', {skipLocationChange: true}).then(()=> {
              this._router.navigate(['/board/u/vod/my-videos']);
            });
          },
          (error) => {
            console.log({ error });
            Swal.fire(
              'Cancelled',
              'Could not remove program from your list. Please try again later',
              'error'
            );
          }
        );
      }
    });
  }
}