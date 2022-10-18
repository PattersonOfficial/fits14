import { VodService } from './../../../../../services/vod/vod.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { StorageService } from '../../../../../services/auth/storage.service';
import { User } from '../../../../../models/user/user.model';
import { Types } from '../../../../../models/types/types.model';
import { MatDialog } from '@angular/material/dialog';
import { WebViewComponent } from '../../../../admin/modules/packages/components/webview/webview.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { VodProgram } from '../../../../../models/vodprogram/vodprogram.model';
import { PaymentService } from '../../../../admin/modules/packages/components/payment/payment.service';
import { PaymentForm } from '../../../../../models/payment/form.model';
import { OrderSummaryComponent } from '../../../../shared/components/order-summary/order-summary.component';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-client-vod',
  templateUrl: './vod.component.html',
  styleUrls: ['./vod.component.css'],
})
export class VideoOnDemandComponent implements OnInit {
  public type: Types;
  public user: User;
  public loading: boolean;
  public tab: string;
  @ViewChild('paymentFormModal', { static: false })
  paymentFormModal: ModalDirective;
  paymentFormModalTitle: string;
  paymentFormConfig: PaymentForm = new PaymentForm();
  @ViewChild(WebViewComponent, { static: false })
  private webView: WebViewComponent;
  dataModel: any;

  constructor(
    public _storageService: StorageService,
    public _route: ActivatedRoute,
    public _router: Router,
    private _firestore: AngularFirestore,
    public dialog: MatDialog,
    public _paymentService: PaymentService,
    private toastService: ToastrService,
    public _vodService: VodService,
    private spinner: NgxSpinnerService
  ) {
    this.loading = true;

    this.paymentFormConfig.product_type =
      this._paymentService.vodProgramProductType;
    this.paymentFormConfig.callback_url = '/board/u/vod/my-videos';
  }

  public playVideo = (data) => {
    this.webView.playVideoByUrl(data);
  };

  public playVideoOnDemand = (data) => {
    this.webView.playVideoOnDemand(data);
  };

  ngOnInit() {
    this.user = new User();
    this.user = this._storageService.getCurrentUser();

    this._firestore.collection('users').doc(this.user.firestore_uid).set(
      {
        status: 2,
      },
      {
        merge: true,
      }
    );

    this._route.params.subscribe((params) => {
      this.tab = params['tab'] || 'on-demand';
    });
  }

  paymentCallback(isPaymentSuccess) {
    if (isPaymentSuccess) {
      this.paymentFormModal.hide();

      window['dataLayer'].push({
        event: 'VOD Subscription',
        subscribed: true,
        product_type: this.dataModel.payment,
        product_name: this.dataModel.title,
        used_coupon: this.dataModel.coupon_code ? true : false,
        coupon: this.dataModel.coupon_code,
      });

      this._router.navigate(['/board/u/vod/my-videos']);
    } else {
      window['dataLayer'].push({
        event: 'VOD Subscription',
        subscribed: false,
        product_type: this.dataModel.payment,
        product_name: this.dataModel.title,
        used_coupon: this.dataModel.coupon_code ? true : false,
        coupon: this.dataModel.coupon_code,
      });
    }
  }

  showPaymentFormModal(vodProgram: VodProgram) {
    const membership_id = this.user.client.membership.id;
    switch (membership_id) {
      case 1:
      case 2:
        this.paymentFormConfig.amount = vodProgram.pro_member_price;
        break;
      case 3:
        this.paymentFormConfig.amount = vodProgram.premium_member_price;
        break;
      case 4:
        this.paymentFormConfig.amount = vodProgram.free_member_price;
        break;
    }
    this.paymentFormConfig.product_id = vodProgram.id;
    this.paymentFormModalTitle = vodProgram.title;

    this.dataModel = {
      mode: 'VOD',
      paymentConfig: this.paymentFormConfig,
      title: this.paymentFormModalTitle,
      img: vodProgram.thumbnail,
      subtitle: vodProgram.subtitle,
    };

    this.dialog
      .open(OrderSummaryComponent, {
        data: {
          mode: 'VOD',
          paymentConfig: this.paymentFormConfig,
          title: this.paymentFormModalTitle,
          img: vodProgram.thumbnail,
          subtitle: vodProgram.subtitle,
        },
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.paymentFormConfig = {
            ...this.paymentFormConfig,
            amount: resp.price,
          };

          this.dataModel = { ...this.dataModel, amount: resp.price };

          if (resp.coupon_code) {
            this.paymentFormConfig = {
              ...this.paymentFormConfig,
              coupon_code: resp.coupon_code,
            };
            this.dataModel = {
              ...this.dataModel,
              coupon_code: resp.coupon_code,
            };
          }

          this.paymentFormModal.show();
        }
      });
  }

  subscribeToProgram(program) {
    this._vodService.purchaseProgram(program).subscribe(
      () => {
        this.toastService.success(`${program.title} successfully add to list`);
        this._router.navigate(['/board/u/vod/my-videos']);
      },
      (error) => {
        this.toastService.warning(`Could not add program to list, Try again later`);
        console.log({ error });
      }
    );
  }

  subscribeToProgramFromMyVideos(program) {
    this._vodService.purchaseProgram(program).subscribe(
      () => {
        this.toastService.success(`${program.title} successfully add to list`);
        this._router.navigateByUrl('/', {skipLocationChange: true}).then(()=> {
          this._router.navigate(['/board/u/vod/my-videos']);
        });
      },
      (error) => {
        this.toastService.warning(`Could not add program to list, Try again later`);
        console.log({ error });
      }
    );
  }
}
