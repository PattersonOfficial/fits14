import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { StorageService } from './storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private _router: Router,
        public _storageService: StorageService
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                // console.log(err.message, err.error);
                if (err.status === 401) {
                    this._storageService.reValidateSession();
                }
            }
        }));
    }
}
