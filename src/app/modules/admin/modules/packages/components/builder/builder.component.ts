import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
  HttpResponse,
  HttpEvent,
  HttpEventType,
  HttpParams,
} from '@angular/common/http';
import { Subscription } from 'rxjs';
import { QuillEditorComponent } from 'ngx-quill/src/quill-editor.component';
import { Contents } from '../../../../../../models/contents/contents.model';
import { RecipeDescriptionTable } from '../../../../../../models/contents/recipeDescriptionTable.model';
import { RecipeNutrientsTable } from '../../../../../../models/contents/recipeNutrientsTable.model';
import { Data, toFiles } from '../../../../../../models/contents/data.model';
import { Categories } from '../../../../../../models/categories/categories.model';
import { CategoriesService } from '../categories/categories.service';
import { BuilderService } from './builder.service';
import { environment } from '../../../../../../../environments/environment';
import { StorageService } from '../../../../../../services/auth/storage.service';
import { RecipeVideo } from 'src/app/models/contents/RecipeVideo.model';
import { Meal } from '../../../../../../models/meal/meal.model';
import { Calories } from '../../../../../../models/calories/calories.model';
import { User } from '../../../../../../models/user/user.model';
import { UsersService } from '../../../users/components/users/users.service';
import { Global } from '../../../../../../app.global';
import { CropperComponent } from 'angular-cropperjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-builder-contents',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css'],
})
export class BuilderComponent implements OnInit {
  public url: string;
  public contentPostHtml = '';
  public accept = '*';
  public maxSize = 500024;
  public files: File[];
  public thumbnail: File[];
  public progress: number;
  public loadingBuilder = false;
  public isModal = false;
  public isReady = false;
  public isValid = false;
  public categories: Categories[];
  public recipes: any[];
  public isMultiValue: any[];
  public form: FormGroup;
  public toFormData: FormData;
  public thumbToFormData: FormData;
  public httpEmitter: Subscription;
  public httpEvent: HttpEvent<any>;
  public customNutrients: RecipeNutrientsTable;
  public custom: RecipeDescriptionTable;
  public allSubcategories = [];
  public subcategoriesForCategory = [];
  public dailyCalories = [];
  public mealId = [];
  public tags = [];
  public newTag = '';
  public isInitCategory = false;

  public mentors: User[];

  public editorConfig = {
    autoUpdateElement: true,
    language: 'en',
  };
  public caloriesList: Calories[];
  public mealsList: Meal[];
  public dropdownSettingsMeal = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // enableCheckAll: false,
    itemsShowLimit: 6,
    // allowSearchFilter: true
  };

  public dropdownSettingsCalories = {
    singleSelection: false,
    idField: 'quantity',
    textField: 'quantity',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 6,
  };

  public defaultNutrients: RecipeNutrientsTable[] = [
    {
      nutrients_name: 'Calories',
      nutrients_value: '0',
      content_id: undefined,
      id: undefined,
    },
    {
      nutrients_name: 'Protein',
      nutrients_value: '0',
      content_id: undefined,
      id: undefined,
    },
    {
      nutrients_name: 'Carbs',
      nutrients_value: '0',
      content_id: undefined,
      id: undefined,
    },
    {
      nutrients_name: 'Fat',
      nutrients_value: '0',
      content_id: undefined,
      id: undefined,
    },
  ];
  public cropperConfig = {
    movable: true,
    scalable: true,
    zoomable: true,
    viewMode: 0,
    aspectRatio: 16 / 9,
    autoCropArea: 1,
  };
  public showCropper = false;
  public thumbnailUrl: SafeUrl;
  public thumbFileName: string;

  @Input() content: Contents;
  @Output() newContent = new EventEmitter<string>();
  @ViewChild('modalRef', { static: false }) modalRef: ModalDirective;
  @ViewChild('editor', { static: false }) editor: QuillEditorComponent;
  @ViewChild('thumbnailImageCropper', { static: false })
  public thumbnailImageCropper: CropperComponent;
  @ViewChild('thumbnailFileInput', { static: false })
  public thumbnailFileInput: ElementRef;

  constructor(
    public fb: FormBuilder,
    private _storageService: StorageService,
    public _categoriesService: CategoriesService,
    public _builderService: BuilderService,
    public _userService: UsersService,
    private sanitizer: DomSanitizer
  ) {
    this.content = new Contents();
    this.content.title = '';
    this.content.type = 0;
    this.content.category = 0;
    this.content.subcategory_id = 0;
    this.content.data = [];
    this.content.video_path = [];
    this.content.recipe_description = [];
    this.content.recipe_nutrients = [];
    this.url = environment.api;
    this.files = [];
    this.thumbnail = [];
    this.form = fb.group({
      editor: ['test'],
    });
    this.custom = new RecipeDescriptionTable();
    this.customNutrients = new RecipeNutrientsTable();
  }

  ngOnInit() {
    this.listMentors();
    this.listCategories();
    this.listMeals();
    this.listCalories();
  }

  public listCategories(): void {
    this._categoriesService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  public listMeals(): void {
    this._categoriesService.getMeals().subscribe((data) => {
      this.mealsList = data;
    });
  }

  public listCalories(): void {
    this._categoriesService.getCaloriesList().subscribe((data) => {
      this.caloriesList = data;
    });
  }

  public listMentors() {
    const params = new HttpParams().append(
      'role_id',
      String(Global.roles.mentor)
    );
    this._userService.getUsers(params).subscribe((mentors) => {
      this.mentors = mentors;
    });
  }

  public deleteTag(tagIndex) {
    this.tags.splice(tagIndex, 1);
  }

  public addTag() {
    this.tags.push(this.newTag);
    this.newTag = '';
  }

  loadSubcategoriesByCategory(id) {
    this._builderService.getSubcategoriesByCategoryId(id).subscribe((data) => {
      this.subcategoriesForCategory = data;
    });
  }

  // public listRecipes(): void {
  //     this._builderService.getRecipes(this.content.type_id).subscribe(
  //         data => {
  //             this.recipes = data;
  //         }
  //     );
  // }

  public insertNewAnswer(): void {
    if (
      this.custom.ingredient_name != null &&
      this.custom.ingredient_value != null
    ) {
      // console.log(this.content.recipe_description);
      // console.log(this.content);
      this.content.recipe_description.push(this.custom);
      this.content.recipe_description = [...this.content.recipe_description];
      // console.log(this.content);
      // console.log("+++++++++++++-------------------++++++++++++++++++");
      this.custom = new RecipeDescriptionTable();
    }
  }

  public insertNewNutrient(): void {
    if (!this.content.recipe_nutrients) {
      this.content.recipe_nutrients = [];
    }

    if (
      this.customNutrients.nutrients_name != null &&
      this.customNutrients.nutrients_value !=
        null /* && this.content.recipe_nutrients.length < 7*/
    ) {
      // console.log(this.content.recipe_nutrients);
      // console.log(this.content);
      this.content.recipe_nutrients.push(this.customNutrients);
      this.content.recipe_nutrients = [...this.content.recipe_nutrients];
      // console.log(this.content);
      // console.log("+++++++++++++-------------------++++++++++++++++++");
      this.customNutrients = new RecipeNutrientsTable();
    }
  }

  public delAnswer(recipeDescriptionMeta) {
    if (recipeDescriptionMeta.id != null) {
      this._builderService.delAnswers(recipeDescriptionMeta).subscribe(() => {
        this.content.recipe_description.splice(
          this.content.recipe_description.indexOf(recipeDescriptionMeta),
          1
        );
      });
    } else {
      this.content.recipe_description.splice(
        this.content.recipe_description.indexOf(recipeDescriptionMeta),
        1
      );
    }
  }

  public delNutrients(recipeNutrientsMeta) {
    if (recipeNutrientsMeta.id != null) {
      this._builderService.delNutrients(recipeNutrientsMeta).subscribe(() => {
        this.content.recipe_nutrients.splice(
          this.content.recipe_nutrients.indexOf(recipeNutrientsMeta),
          1
        );
      });
    } else {
      this.content.recipe_nutrients.splice(
        this.content.recipe_nutrients.indexOf(recipeNutrientsMeta),
        1
      );
    }
  }

  public openModal(type, formatFileUpload, category?): void {
    this.isInitCategory = !!category;
    this.isModal = true;
    this.accept = formatFileUpload;
    this.progress = 0;

    this.files = [];
    this.content = new Contents();
    this.content.title = '';
    this.content.category = category
      ? category
      : type === 8 || type === 9
      ? 10
      : 0;
    this.content.meal_type_ids = [];
    this.mealId = [];
    this.content.daily_calories = [];
    this.tags = [];
    this.dailyCalories = [];
    // this.content.subcategory_id = 0;
    this.content.type = type;
    this.content.data = [];
    this.content.video_path = [];
    this.content.recipe_description = [];
    this.content.recipe_nutrients = this.defaultNutrients;
    if (this.content.category) {
      this.loadSubcategoriesByCategory(this.content.category);
    }
  }

  public editContent(content, isCopy?: boolean) {
    this.isModal = true;
    this.loadingBuilder = true;

    if (content.category_id === 9) {
      this.loadSubcategoriesByCategory(9);
      this.content.subcategory_id = content.subcategory
        ? content.subcategory.id
        : 0;
    }

    this._builderService.getContent(content).subscribe((data) => {
      console.log(data);
      this.loadingBuilder = false;
      this.content = { ...data };
      this.content.category = data.category_id;
      this.mealId = [];
      this.dailyCalories = [];
      this.thumbnail = [];

      if (data.category_id === 13) {
        this.loadSubcategoriesByCategory(13);
        this.content.subcategory_id = data.subcategory
          ? data.subcategory.id
          : 0;
      }

      if (data.data.length > 0) {
        this.contentPostHtml = data.data[0].content;
      }

      if (data.meal_type_ids && data.meal_type_ids.length !== 0) {
        data.meal_type_ids.forEach((type) => {
          this.mealId.push(this.mealsList.filter((meal) => meal.id == type)[0]);
        });
      }

      if (data.daily_calories && data.daily_calories.length !== 0) {
        data.daily_calories.forEach((cal) => {
          this.dailyCalories.push(
            this.caloriesList.filter((listItem) => listItem.quantity == cal)[0]
          );
        });
      }

      if (data.tags.length) {
        this.tags = data.tags.split(',');
      }

      this.defaultNutrients.forEach((nutrient) => {
        if (
          data.recipe_nutrients.filter(
            (contNutr) =>
              contNutr.nutrients_name.toLowerCase() ===
              nutrient.nutrients_name.toLowerCase()
          ).length == 0
        ) {
          this.content.recipe_nutrients.unshift(nutrient);
        }
      });

      this.isReady = false;
      this.isValid = true;
      if (isCopy) {
        this.content.id = null;
      }
      // this.listRecipes();

      this.changeAccept();
    });
  }

  public putToFilesEdit(data) {
    let content: any[] = this.files;
    for (var i = 0; i < data.length; i++) {
      let item: toFiles = new toFiles();
      item.name = data[i].title;
      item.type = data[i].type;
      item.size = data[i].size;
      content.push(item);
    }

    // console.log(this.files);
  }

  public changeAccept(): void {
    let current = this.content.type;
    let types: any[] = [
      '.mp4,.3gp,.avi,video/*',
      '.mp3,.mp4,.wav,audio/*',
      '.png,.jpg,.gif,.svg,.jpeg,image/*',
      '',
      '*',
    ];

    if (this.content.title == '') {
      this.files = [];
      this.mealId = [];
      this.dailyCalories = [];
      this.tags = [];
      this.content = new Contents();
      this.content.title = '';
      this.content.category = 0;
      this.content.subcategory_id = 0;
      this.content.type = current;
      this.content.data = [];
      this.content.video_path = [];
      this.content.recipe_description = [];
      this.progress = 0;
      this.isReady = false;
    }

    this.accept = types[current - 1];
  }

  public checkIsNutrientDefault(name) {
    return (
      this.defaultNutrients.filter(
        (item) => item.nutrients_name.toLowerCase() === name.toLowerCase()
      ).length !== 0
    );
  }

  public hideModal(): void {
    this.isModal = false;
    this.isInitCategory = false;

    this.files = [];
    this.content = new Contents();
    this.content.title = '';
    this.content.category = 0;
    this.content.subcategory_id = 0;
    this.content.type = 1;
    this.content.data = [];
    this.content.video_path = [];
    this.content.recipe_description = [];
    this.isReady = false;
  }

  onContentChanged() {
    let data = new Data();
    let content: any[] = [];

    if (this.content.id) {
      data.parent = this.content.id.toString();
    }

    data.content = this.contentPostHtml;

    content.push(data);
    this.content.data = content;
    this.validate();

    // console.log(this.content.data);
  }

  public putFilesToContent(upload) {
    for (var i = 0; i < upload.length; i++) {
      let data = new Data();
      if (this.content.id) {
        data.parent = this.content.id.toString();
      }
      data.title = upload[i].filename;
      data.type = upload[i].type;
      data.size = upload[i].size;
      data.content = upload[i].public_url;
      data.public_url = upload[i].public_url;
      data.local_storage = upload[i].local_storage;

      this.content.data.push(data);
      // console.log(data, this.content.data);
    }
  }

  public putRecipeFilesToContent(upload) {
    for (var i = 0; i < upload.length; i++) {
      let video_path = new RecipeVideo();
      if (this.content.id) {
        video_path.parent = this.content.id.toString();
      }
      video_path.title = upload[i].filename;
      video_path.type = upload[i].type;
      video_path.size = upload[i].size;
      video_path.content = upload[i].public_url;
      video_path.public_url = upload[i].public_url;
      video_path.local_storage = upload[i].local_storage;

      this.content.video_path.push(video_path);
      // console.log(video_path, this.content.video_path);
    }
  }

  public changeComboDropFile() {
    this.progress = 0;
  }

  public changeComboThumbnailDropFile() {
    this.loadingBuilder = true;
    setTimeout(() => {
      this.uploadThumbnail();
    }, 2000);
  }

  public uploadThumbnail() {
    this.loadingBuilder = true;

    setTimeout(() => {
      this.thumbToFormData.append('type', this.content.type.toString());
      this.thumbToFormData.append('category', this.content.category.toString());

      this._builderService.uploadFiles(this.thumbToFormData).subscribe(
        (upload) => {
          this.httpEvent = upload;

          if (upload.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * upload.loaded) / upload.total);
          }

          if (upload instanceof HttpResponse) {
            if (upload.body.length != 0) {
              this.content.thumbnail =
                upload.body[upload.body.length - 1].public_url;
            } else {
              this.content.thumbnail = '';
            }

            this.thumbnail = [];

            this.loadingBuilder = false;

            this.showCropper = false;
            this.thumbnailUrl = null;

            this.validate();
          }
        },
        () => {
          this.loadingBuilder = false;
        }
      );
    }, 2000);

    // this._builderService
    //   .uploadFiles(this.thumbToFormData)
    //   .subscribe((upload) => {
    //     this.httpEvent = upload;

    //     if (upload.type === HttpEventType.UploadProgress) {
    //       this.progress = Math.round((100 * upload.loaded) / upload.total);
    //     }

    //     if (upload instanceof HttpResponse) {
    //       if (upload.body.length != 0) {
    //         this.content.thumbnail =
    //           upload.body[upload.body.length - 1].public_url;
    //       } else {
    //         this.content.thumbnail = '';
    //       }

    //       this.thumbnail = [];

    //       this.loadingBuilder = false;

    //       this.showCropper = false;
    //       this.thumbnailUrl = null;

    //       this.validate();
    //     }
    //   });
  }

  public uploadFiles(files: File[]): Subscription {
    this.loadingBuilder = true;

    this.toFormData.append('type', this.content.type.toString());
    this.toFormData.append('category', this.content.category.toString());

    this.progress = 0;
    return (this.httpEmitter = this._builderService
      .uploadFiles(this.toFormData)
      .subscribe(
        (upload) => {
          this.httpEvent = upload;
          if (upload.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * upload.loaded) / upload.total);
          }
          if (upload instanceof HttpResponse) {
            delete this.httpEmitter;
            // console.log(upload.body);
            this.putFilesToContent(upload.body);
            this.files = [];
            this.loadingBuilder = false;
            this.isReady = true;
            this.validate();
          }
        },
        () => {
          this.isReady = false;
        }
      ));
  }

  public uploadRecipeFiles(files: File[]): Subscription {
    this.loadingBuilder = true;

    this.toFormData.append('type', this.content.type.toString());
    this.toFormData.append('category', this.content.category.toString());

    this.progress = 0;
    return (this.httpEmitter = this._builderService
      .uploadFiles(this.toFormData)
      .subscribe(
        (upload) => {
          this.httpEvent = upload;
          if (upload.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * upload.loaded) / upload.total);
          }
          if (upload instanceof HttpResponse) {
            delete this.httpEmitter;
            // console.log(upload.body);
            this.putRecipeFilesToContent(upload.body);
            this.files = [];
            this.loadingBuilder = false;
            this.isReady = true;
            this.validate();
          }
        },
        (error) => {
          this.isReady = false;
        }
      ));
  }

  public validate() {
    let status = true;

    if (this.content.title == '') {
      status = false;
    }

    if (this.content.category == 0) {
      status = false;
    }

    if (this.content.type == 0) {
      status = false;
    }

    if (
      this.content.type == 9 &&
      (this.mealId.length == 0 || this.dailyCalories.length == 0)
    ) {
      status = false;
    }

    if (String(this.content.data) == 'undefined') {
      status = false;
    }
    if (String(this.content.video_path) == 'undefined') {
      status = false;
    }

    if (String(this.content.recipe_description) == 'undefined') {
      status = false;
    }

    this.isValid = status;
  }

  public postContent(): void {
    console.log({ ContentData: this.content });

    if (this.content.type === 4) {
      this.onContentChanged();
    }

    if (this.content.type === 9) {
      this.content.meal_type_ids = this.mealId.map(function (item) {
        return item.id;
      });
      const tempDailyCal = [];
      this.dailyCalories.forEach((val) => tempDailyCal.push(val));
      this.content.daily_calories = tempDailyCal;
      this.content.tags = this.tags.join(',');
    }

    this.loadingBuilder = true;

    if (this.content.id == null) {
      this._builderService.saveContent(this.content).subscribe((data) => {
        this.newContent.emit(data.model);
        this.loadingBuilder = false;
        this.hideModal();
      });
    } else {
      this._builderService.updateContent(this.content).subscribe((data) => {
        this.newContent.emit(data.model);
        this.loadingBuilder = false;
        this.hideModal();
      });
    }
  }

  // Cropper
  saveCroppedImage(cropperComponent, image_type) {
    if (cropperComponent) {
      this.loadingBuilder = true;

      cropperComponent.cropper.getCroppedCanvas().toBlob(
        (blob) => {
          const blobFile = new File([blob], this.thumbFileName);
          this.thumbnail = [];
          this.thumbnail.push(blobFile);

          // setTimeout(() => {
          //   this.uploadThumbnail();
          // }, 500);

          this.uploadThumbnail();
        },
        'image/jpeg',
        1
      );
    }
  }

  cropperSetDragMode(cropperComponent: any, mode: string) {
    if (cropperComponent) {
      cropperComponent.cropper.setDragMode(mode);
    }
  }

  cropperDestroy(cropperComponent, imageType) {
    if (cropperComponent) {
      (this[`${imageType}Url`] = undefined),
        (this[`${imageType}CropperComponent`] = false);
    }
  }

  setCropper(input, type: string) {
    const file = input.files[0];
    if (file) {
      this.thumbnail = input.files;
      this.thumbFileName = file.name;
      this[`${type}CropperComponent`] = false;
      setTimeout(() => {
        this.thumbnailUrl = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        );
        // this[`${type}CropperComponent`] = true;
        this.thumbnailFileInput.nativeElement.value = '';
      }, 1);
    }
  }
}
