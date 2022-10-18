import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { CategoriesService } from './categories.service';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { Categories } from "../../../../../../models/categories/categories.model";

@Component({
  selector: 'app-contents',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public categories: Categories[];
  public dtTrigger: Subject<any> = new Subject();
  public dtOptions;
  public isModalCategories: boolean = false;
  public category: Categories;

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(
    public _categoriesService: CategoriesService
  ) {
    this.category = new Categories;
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": " "
      }
    };
    this.listCategories();
  }


  /**
   * Obtiene lista de contenidos de paquete
   *
   * @return void
   */
  public listCategories(): void {
    this._categoriesService.getCategories().subscribe(
      data => {
        this.categories = data;
        this.dtTrigger.next();
      }
    )
  }


  /**
   * Obtiene lista de contenidos de paquete
   *
   * @return void
   */
  public trashCategory(category: Categories): void {
    this._categoriesService.trashCategory(category).subscribe(
      data => {
        this.destroyDtInstance();
        this.listCategories();
      }
    )
  }


  /**
   * Destruye instancia activa DataTables
   *
   * @return void
   */
  public destroyDtInstance(): void {
    this.dtElement.dtInstance.then(dtInstance => {
      dtInstance.destroy();
    });
  }



  /**
   * Abre modal de configuración de categorías
   *
   * @param  pack   Objecto de la lista de categorias a editar
   * @return void
   */
  public openModalCategories(item): void {
    this.category.id = item.id;
    this.category.title = item.title;

    this.isModalCategories = true;
  }


  /**
   * Oculta modal de edición de categorías
   *
   * @return void
   */
  public hideModalCategories(): void {
    this.isModalCategories = false;
  }


  /**
   * Guarda categoría
   *
   * @return void
   */
  public saveCategory() {
    if (this.category.id == null) {
      this._categoriesService.postCategory(this.category).subscribe(
        data => {
          this.destroyDtInstance();
          this.listCategories();
          this.hideModalCategories();
        }
      )
    } else {
      this._categoriesService.putCategory(this.category).subscribe(
        data => {
          this.destroyDtInstance();
          this.listCategories();
          this.hideModalCategories();
        }
      )
    }

  }


}
