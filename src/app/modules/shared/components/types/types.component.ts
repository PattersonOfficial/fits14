import { QuestionsComponent } from "./../questions/questions.component";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

import { StorageService } from "../../../../services/auth/storage.service";
import { TypesService } from "./types.service";

@Component({
  selector: "app-user-types",
  templateUrl: "./types.component.html",
  styleUrls: ["./types.component.css"],
  providers: [],
})
export class TypesComponent implements OnInit {
  public types: any[];
  public width: number;
  public category: string;
  public loadingClientTypes: boolean;
  public userTypes: any[];
  public mainTitle: string;
  public user: any = [];
  public loadQuestions = false;

  @ViewChild("modalRef", { static: false }) modalRef: ModalDirective;
  @ViewChild(QuestionsComponent, { static: false })
  questionsRef: QuestionsComponent;

  constructor(
    public _typesService: TypesService,
    private _sanitizer: DomSanitizer,
    public _storageService: StorageService,
    public _route: ActivatedRoute,
    public _router: Router,
    public dialog: MatDialog
  ) {
    this.types = [];
    this.width = 100;
    this.loadingClientTypes = false;
    this.mainTitle = "";
  }

  ngOnInit() {
    this.user = this._storageService.getCurrentUser();
    this.userTypes = this.user.client.types;
  }

  openModal(id, title) {
    this.getTypesOfCategory(id, title);
    this.getMyClientTypes();
    this.modalRef.show();
  }

  getClientTypeIdForHome(id, title) {
    this._typesService
      .getTypesOfCategory({
        id: id,
        title: title,
      })
      .subscribe((data) => {
        const mainTypes = data.types;
        this._typesService.getMyClientTypes().subscribe((data1) => {
          for (let typeIndex = 0; typeIndex < mainTypes.length; typeIndex++) {
            if (
              data1.types.map((e) => e.id).indexOf(mainTypes[typeIndex].id) !=
              -1
            ) {
              return mainTypes[typeIndex].id;
            }
          }
        });
      });
  }

  getClientTypeIdForMyProgram(id, title, tab?) {
    this.modalRef.show();
    this.loadingClientTypes = true;
    this._typesService
      .getTypesOfCategory({
        id: id,
        title: title,
      })
      .subscribe(
        (data) => {
          const mainTypes = data.types;
          this._typesService.getMyClientTypes().subscribe(
            (data1) => {
              this.userTypes = data1.types;

              //  check if user has any types or call for questions
              if (data1.types.length === 0) {
                this.loadingClientTypes = false;
                this.goBack();
                this.loadQuestions = true;
              }

              for (
                let typeIndex = 0;
                typeIndex < mainTypes.length;
                typeIndex++
              ) {
                if (
                  data1.types
                    .map((e) => e.id)
                    .indexOf(mainTypes[typeIndex].id) !== -1
                ) {

                  this.loadQuestions = false;

                  const type =
                    this.userTypes[
                      this.existTypeInUser(mainTypes[typeIndex].id)
                    ];

                  if (type.pivot.start_date == null) {
                    this.startProgram(type.pivot.id);
                  }
                  this.goBack();
                  this.loadingClientTypes = false;
                  this._router.navigate([
                    "/board/u/myprogram/filter",
                    mainTypes[typeIndex].id,
                    title,
                    tab ? tab : id === 13 ? "yoga" : "daily-workout",
                  ]);
                } else {
                  this.goBack();
                  this.loadingClientTypes = false;
                }
              }

              if (this.loadQuestions === true) {
                this.openDialogQuestions();
              }

              // for (let typeIndex = 0; typeIndex < mainTypes.length; typeIndex++) {
              //     if (data1.types.map((e) => e.id).indexOf(mainTypes[typeIndex].id) !== -1) {
              //         const typesCategory = this.userTypes.filter(item => item.id == mainTypes[typeIndex].id);
              //         typesCategory.forEach(elem => {
              //             if (elem.pivot.status !== 3) {
              //                 this.startProgram(elem.pivot.id);
              //             }
              //             this.goBack();
              //             this.loadingClientTypes = false;
              //             this._router.navigate(['/board/u/myprogram/filter', elem.pivot.id, title, 'daily-workout']);
              //         });
              //     }
              // }
            },
            (error) => {
              console.log({ error });
              this.goBack();
              this.loadingClientTypes = false;
            }
          );
        },
        (error) => {
          console.log({ error });
          this.goBack();
          this.loadingClientTypes = false;
        }
      );
  }

  goBack() {
    this.modalRef.hide();
  }

  getTypesOfCategory(id, title) {
    this.mainTitle = title;
    this._typesService
      .getTypesOfCategory({
        id: id,
        title: title,
      })
      .subscribe((data) => {
        this.types = data.types;
        this.width = 100 / this.types.length;
        this.category = data.title;
      });
  }

  getMyClientTypes() {
    this.loadingClientTypes = true;
    this._typesService.getMyClientTypes().subscribe((data) => {
      this.userTypes = data.types;
      this.loadingClientTypes = false;
    });
  }

  existTypeInUser(type_id) {
    return this.userTypes.map((e) => e.id).indexOf(type_id);
  }

  startProgram(id) {
    this._typesService.startProgram(id).subscribe((data) => {
      // console.log(data);
    });
  }

  startMyProgram(id) {
    this._typesService.startMyProgram(id).subscribe((data) => {
      // console.log(data);
    });
  }

  goToContentOfType(id, title) {
    if (this.existTypeInUser(id) !== -1) {
      // console.log({id});
      // console.log(this.existTypeInUser(id));
      let type = this.userTypes[this.existTypeInUser(id)];
      if (type.pivot.start_date == null) {
        // console.log({startProgram: type.pivot.id });
        this.startProgram(type.pivot.id);
      }
      this.goBack();
      this._router.navigate([
        "/board/u/myprogram/filter",
        id,
        title,
        "daily-workout",
      ]);
    }
  }

  safeImageUrl(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  openDialogQuestions() {
    this.dialog.open(QuestionsComponent, {
      height: "100vh",
      hasBackdrop: false,
    }).afterClosed().subscribe((resp) => {
      // console.log({ resp });
      this.loadingClientTypes = false;
    });
  }
}
