import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ngfModule, ngf} from 'angular-file';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {InlineSVGModule} from 'ng-inline-svg';
import {IonRangeSliderModule} from 'ng2-ion-range-slider';
import {SharedModule} from '../../../shared/shared.module';
import {NestableModule} from 'ngx-nestable';
import {PackagesModule} from '../../../admin/modules/packages/packages.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {OwlModule} from 'ngx-owl-carousel';
import {VodRoutingModule} from './vod.routing';
import {VideoOnDemandComponent} from './components/vod.component';
import {OnDemandComponent} from './components/ondemand/on-demand.component';
import {MyVideosComponent} from './components/myvideos/my-videos.component';
import {ProgramCategoryComponent} from './components/programcategory/program-category.component';
import {MostPopularComponent} from './components/mostpopular/most-popular.component';
import {ProgramsSliderComponent} from './components/programsslider/programs-slider.component';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {MyVideosProgramComponent} from './components/myvideosprogram/my-videos-program.component';
import {MyVideosLessonCardComponent} from './components/myvideoslessoncard/my-videos-lesson-card.component';
import {MyVideosArticleCardComponent} from './components/myvideosarticlecard/my-videos-article-card.component';
import {VodContentViewerComponent} from './components/vodcontentviewer/vod-content-viewer.component';
@NgModule({
    imports: [
        HttpClientModule,
        VodRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SweetAlert2Module,
        IonRangeSliderModule,
        InlineSVGModule.forRoot(),
        SharedModule,
        NgxChartsModule,
        NestableModule,
        ngfModule,
        PackagesModule,
        OwlModule,
        SlickCarouselModule,
    ],
    declarations: [
        VideoOnDemandComponent,
        OnDemandComponent,
        MyVideosComponent,
        ProgramCategoryComponent,
        MostPopularComponent,
        ProgramsSliderComponent,
        MyVideosProgramComponent,
        MyVideosLessonCardComponent,
        MyVideosArticleCardComponent,
        VodContentViewerComponent,
    ],
    exports: [VideoOnDemandComponent]
})
export class VideoOnDemandModule {
}
