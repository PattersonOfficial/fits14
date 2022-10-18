import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable()
export class AuthorizatedGuard implements CanActivate {
  public url: string;
  public state: any;

  constructor(
    private _router: Router,
    private _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }


  /**
   * Valida si el usuario esta autorizado para navegar en la ruta
   *
   * @param  route ActivatedRouteSnapshot
   * @return boolean
   */
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.state = this._storageService.isAuthenticated();
    if (this.state) {
      if (this.isValid(route)) {
        this._storageService.setExtraDataSession('lastPath', state.url);
        return true;
      }
    }
    this._storageService.removeCurrentSession();
    this._router.navigate(['/login']);
    return false;
  }

  /**
   * Condicionales que validan la ejecución de la ruta
   *
   * @param  route Objecto con información de la ruta activa
   * @return boolean
   */
  public isValid(route: any) {
    const expectedRole = route.data.expectedRole;
    const currentUser = this._storageService.getCurrentUser();

    if (expectedRole instanceof Array) {
      for (let i = 0; i < expectedRole.length; i++) {
        if (expectedRole[i] === currentUser.rol.id) {
          return true;
        }
      }
    } else if (expectedRole === currentUser.rol.id) {
      return true;
    }

    return false;
  }
}
