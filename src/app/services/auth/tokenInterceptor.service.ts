import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {StorageService} from './storage.service';
import {Observable} from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private ignore: any[];

    constructor(public _storageService: StorageService) {
        this.ignore = [
            // 'http://api.countrylayer.com/v2/all?access_key=efee77a374f746cc9d950938fe599269'
        ];
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.ignore.indexOf(request.url, 0) === -1) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this._storageService.getCurrentToken()}`
                }
            });
        }

        return next.handle(request);
    }
}
