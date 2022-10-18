import { StorageService } from './../services/auth/storage.service';
import { SENTRY_DSN, SENTRY_ENVIRONMENT } from './config'; //this is where i retrieve my sentry dsn and sentry environment from my configs
import { Injectable, ErrorHandler as AngularErrorHandler, Injector } from '@angular/core';
import * as Sentry from "@sentry/browser";


Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT ? SENTRY_ENVIRONMENT:'dev'
});

@Injectable({
  providedIn: 'root'
})
export class SentryErrorHandler implements AngularErrorHandler{
  constructor(
    public _storageService: StorageService,
  ) {

  }

    async handleError(error: any) {
        let user = this.getUser();
        //const router = this.injector.get(Router);
        //Check if Sentry Environment is in production or development to capture exception else capture only console logs => weird environment
        if (SENTRY_ENVIRONMENT.includes('prod') || SENTRY_ENVIRONMENT.includes('dev')) {
            Sentry.withScope(scope => {
                //scope.setExtra('battery', 0.7);
                //scope.setTag('user_mode', 'admin');
                if (this.isValidUser(user) === true) {
                    let currentUser = user;
                    scope.setUser(currentUser);
                }

                //lets capture message for Sentry
                const eventId = Sentry.captureException(error.originalError || error);

                //check if its not http error else show dialog box
                /*if (Error instanceof HttpErrorResponse) {} else {
                Sentry.showReportDialog({ eventId });
                }*/
                //uninmportant only turned on in local development by developers to get more info on parsed values to sentry
                console.log("Invoked Sentry Capture", {error:error});
            });
        } else {
            //i dont report errors that are in testing phase not necessary for me
            console.log('SENTRY_ERROR_CAUGHT', {error: error, user: user});
        }
        //open error route
        //router.navigate(['error']);
    }

    /* Depending on how you get user details via your ngx or state management retrieved user details here */
    private getUser() {
        try {
            let user = this._storageService.getCurrentUser();
            //add your user details here
            return {
                name: user.name + ' ' + user.last_name,
                email: user.email,
                uid: user.id,
            };
        } catch (e) {
            console.log("Error caught is valid", e);
            return {
                name: '',
                email: '',
                uid: '',
            };
        }
    }

    /* This simply checks that the user object is valid from your state management */
    private isValidUser(user: any) {
        try {
            console.log("******************************************")
            console.log("Captured Data::User", user)
            console.log("******************************************")
            return (user !== undefined && user !== null) ? true : false;
        } catch (e) {
            console.log("Error caught is valid", e);
            return false;
        }
    }
}
