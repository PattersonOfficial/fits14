import { SharedModule } from './modules/shared/shared.module';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { NumbersonlyModule } from './modules/common/numbersonly/numbersonly.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { InlineSVGModule } from 'ng-inline-svg';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/firestore';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './components/login/login.component';
import { ValidateComponent } from './components/validate/validate.component';
import { RecoveryComponent } from './components/recovery/recovery.component';
import { ThankYouComponent } from './components/register/thankyou/thankyou.component';
import { LoginService } from './components/login/login.service';
import { RecoveryService } from './components/recovery/recovery.service';
import { StorageService } from './services/auth/storage.service';
import { TokenInterceptor } from './services/auth/tokenInterceptor.service';
import { JwtInterceptor } from './services/auth/jwtInterceptor.service';
import { AuthorizatedGuard } from './services/auth/authorizate.service';
import { WindowRef } from './services/platform/window.service';
import { RegisterService } from './components/register/register.service';
import { FacebookModule } from 'ngx-facebook';
import { environment } from '../environments/environment';
import { OwlModule } from 'ngx-owl-carousel';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { RegisterComponent } from './components/register/register.component';
import { PackagesModule } from './modules/admin/modules/packages/packages.module';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { svgIcons } from './consts/icons';
import { MatIconRegistry } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FreeRegisterComponent } from './components/free-register/free-register.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgxSpinnerModule } from 'ngx-spinner';

// Material Design Imports
import {MatBadgeModule} from '@angular/material/badge';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';


//  sentry imports
import * as Sentry from "@sentry/angular";
import 'media-chrome';

// Social login credentials
const googleCredentials = '209289837651-qi77vohno6egnsb69n038omvfrcm92ss.apps.googleusercontent.com';
const facebookCredentials = '434987518098145';

// const config = new SocialAuthServiceConfig([
//   {
//     id: GoogleLoginProvider.PROVIDER_ID,
//     provider: new GoogleLoginProvider(
//       '209289837651-qi77vohno6egnsb69n038omvfrcm92ss.apps.googleusercontent.com'
//     ),
//     // provider: new GoogleLoginProvider(
//     //   '968090678048-auhlm4qo2mote0hej8env1ts9d41p9hl.apps.googleusercontent.com'
//     // ),
//   },
//   {
//     id: FacebookLoginProvider.PROVIDER_ID,
//     provider: new FacebookLoginProvider('434987518098145'),
//   },
// ]);

// export function provideConfig() {
//   return config;
// }

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RecoveryComponent,
    ValidateComponent,
    ThankYouComponent,
    FreeRegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    HttpClientModule,
    InlineSVGModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FacebookModule.forRoot(),
    BrowserAnimationsModule,
    OwlModule,
    ToastrModule.forRoot(),
    NgSelectModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
    ScrollingModule,
    MatIconModule,
    MatTabsModule,
    Ng2TelInputModule,
    PackagesModule,
    SocialLoginModule,
    FlexLayoutModule,
    NgOtpInputModule,
    NgxSpinnerModule,
    NumbersonlyModule,
  ],
  providers: [
    LoginService,
    RecoveryService,
    AngularFirestore,
    StorageService,
    AuthorizatedGuard,
    WindowRef,
    CookieService,
    RegisterService,
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        // showDialog: true,
      }),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    // {
    //   provide: AuthServiceConfig,
    //   useFactory: provideConfig,
    // },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              googleCredentials
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(facebookCredentials)
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    svgIcons.forEach(({ name, path }) =>
      this.iconRegistry.addSvgIcon(
        name,
        this.sanitizer.bypassSecurityTrustResourceUrl(path)
      )
    );
  }
 }
