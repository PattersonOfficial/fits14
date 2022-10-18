import { DateTimeFormatFilterPipe } from './../../pipes/date-time-format-filter.pipe';
import { NumbersonlyModule } from "./../common/numbersonly/numbersonly.module";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap/modal";
import { ngfModule } from "angular-file";
import { TimeAgoPipe } from "time-ago-pipe";
import { NgSelectModule } from "@ng-select/ng-select";
import { RouterModule } from "@angular/router";
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { InlineSVGModule } from "ng-inline-svg";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { QuotesComponent } from "./components/quotes/quotes.component";
import { CardComponent } from "./components/card/card.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { PlanCoveragePopupComponent } from "./components/planCoveragePopup/plan-coverage-popup.component";
import { FlagComponent } from "./components/flag/flag.component";
import { FriendsComponent } from "./components/friends/friends.component";
import { SleepComponent } from "./components/sleep/sleep.component";
import { WaterComponent } from "./components/water/water.component";
import { CigarsComponent } from "./components/cigars/cigars.component";
import { AlertComponent } from "./components/alert/alert.component";
import { TypesComponent } from "./components/types/types.component";
import { FeedComponent } from "./components/feed/feed.component";
import { QuestionsComponent } from "./components/questions/questions.component";
import { ContactsComponent } from "./components/contacts/contacts.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { FitnessComponent } from "./components/fitness/fitness.component";
import { NutritionComponent } from "./components/nutrition/nutrition.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialogModule } from "@angular/material/dialog";
import { CardOpenDialogComponent } from "./components/creditcarddetail/creditcarddetail.component";
import { ChangePlanComponent } from "./components/change-plan/change-plan.component";
import { PlanQuestionsComponent } from "./components/planquestions/planquestions.component";
import {
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatStepperModule,
} from "@angular/material";
import { SearchPipe } from "../../pipes/search.pipe";
import { StoriesComponent } from "./components/stories/stories.component";
import { OwlModule } from "ngx-owl-carousel";
import { Ng2TelInputModule } from "ng2-tel-input";
import { PackagesModule } from "../admin/modules/packages/packages.module";
import { FilterOnUserIdPipe } from "../../pipes/filterOnUserId.pipe";
import { FilterClientTypesByCategoryPipe } from "../../pipes/filterClientTypesByCategory.pipe";
import { PlayVideoButtonComponent } from "./components/playvideobutton/play-video-button.component";
import { PlayVideoButtonTwoComponent } from "./components/playvideobuttontwo/play-video-button.component";
import { ConfirmModalComponent } from "./components/confirm-modal/confirm-modal.component";
import { CancelPlanComponent } from "./components/cancel-plan/cancel-plan.component";
import { ReportPostComponent } from "./components/report-post/report-post.component";
import { GradePlanComponent } from "./components/grade-plan/grade-plan.component";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatInputModule } from "@angular/material/input";
import { OrderSummaryComponent } from "./components/order-summary/order-summary.component";
import { ModalComponent } from "./components/modal/modal.component";
import { FitnutsExperienceComponent } from './components/fitnuts-experience/fitnuts-experience.component';
import { CongratsComponent } from "./components/congrats/congrats.component";

export const translationConfig = {
  loader: {
    provide: TranslateLoader,
    useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
    deps: [HttpClient],
  },
  defaultLanguage: "en",
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    InlineSVGModule.forRoot(),
    TranslateModule.forRoot(translationConfig),
    ngfModule,
    NgSelectModule,
    RouterModule,
    PickerModule,
    NgxChartsModule,
    IonRangeSliderModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTabsModule,
    MatDialogModule,
    MatStepperModule,
    MatDatepickerModule,
    OwlModule,
    Ng2TelInputModule,
    PackagesModule,
    MatButtonModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatInputModule,
    NumbersonlyModule,
  ],
  declarations: [
    QuotesComponent,
    SleepComponent,
    WaterComponent,
    CigarsComponent,
    CardComponent,
    ProfileComponent,
    PlanCoveragePopupComponent,
    FlagComponent,
    CalendarComponent,
    FitnessComponent,
    FriendsComponent,
    AlertComponent,
    TypesComponent,
    FeedComponent,
    TimeAgoPipe,
    QuestionsComponent,
    NutritionComponent,
    ContactsComponent,
    CardOpenDialogComponent,
    ChangePlanComponent,
    PlanQuestionsComponent,
    SearchPipe,
    StoriesComponent,
    FilterOnUserIdPipe,
    FilterClientTypesByCategoryPipe,
    PlayVideoButtonComponent,
    PlayVideoButtonTwoComponent,
    ConfirmModalComponent,
    CancelPlanComponent,
    ReportPostComponent,
    GradePlanComponent,
    OrderSummaryComponent,
    ModalComponent,
    FitnutsExperienceComponent,
    CongratsComponent,
    DateTimeFormatFilterPipe
  ],
  exports: [
    QuotesComponent,
    CardComponent,
    SleepComponent,
    WaterComponent,
    CigarsComponent,
    NutritionComponent,
    FitnessComponent,
    CalendarComponent,
    TypesComponent,
    FlagComponent,
    FriendsComponent,
    AlertComponent,
    FeedComponent,
    QuestionsComponent,
    ContactsComponent,
    PlanQuestionsComponent,
    StoriesComponent,
    ProfileComponent,
    PlanCoveragePopupComponent,
    PlayVideoButtonComponent,
    PlayVideoButtonTwoComponent,
    ConfirmModalComponent,
    TranslateModule,
    MatInputModule,
    MatIconModule,
    FlexLayoutModule,
  ],
  bootstrap: [],
  entryComponents: [
    CardOpenDialogComponent,
    ChangePlanComponent,
    PlanQuestionsComponent,
    QuestionsComponent,
    CancelPlanComponent,
    OrderSummaryComponent,
    GradePlanComponent,
    ModalComponent,
    FitnutsExperienceComponent,
    CongratsComponent
  ],
})
export class SharedModule {}
