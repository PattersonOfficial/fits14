import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VodProgram } from '../../../../../../models/vodprogram/vodprogram.model';
import { User } from '../../../../../../models/user/user.model';

@Component({
  selector: 'app-client-programsslider',
  templateUrl: './programs-slider.component.html',
  styleUrls: ['./programs-slider.component.css'],
})
export class ProgramsSliderComponent implements OnInit {
  @Input() programs: VodProgram[];
  @Input() type: string;
  @Input() user: User;
  @Output() onPlayVideo: EventEmitter<any> = new EventEmitter();
  @Output() onShowPaymentModal: EventEmitter<any> = new EventEmitter();
  @Output() onSubscribeDemand: EventEmitter<any> = new EventEmitter();

  public carouselOptions;

  constructor() {}

  ngOnInit() {
    this.carouselOptions = {
      items: this.type === 'popular' ? 3 : 4,
      autoWidth: true,
      dots: false,
      loop: false,
      nav: true,
      autoplay: false,
      autoplayTimeout: 5000,
      responsiveClass:true,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 4,
        },
      },
    };
  }

  public handlePlayVideo(data) {
    this.onPlayVideo.emit(data);
  }

  public handlePaymentFormModal(data) {
    this.onShowPaymentModal.emit(data);
  }

  public handleProgramSubscription(data) {
    this.onSubscribeDemand.emit(data);
  }
}
