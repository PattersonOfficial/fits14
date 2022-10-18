import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable ,  throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { UserStory } from '../../../../models/story/userstory.model';

@Injectable({
  providedIn: 'root'
})
export class StoriesService {
  public url: string;
  constructor(private http: HttpClient) {
    this.url = environment.api;
  }

  getUserAndFriendsStoriesData(data: any): Observable<any[]> {
    const path = '/posts/get';
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any[]>(this.url + path, data, { headers: headers });
  }

  getFriendsStoriesById(id): Observable<any[]> {
    const path = '/posts/get-friend/';
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<any[]>(this.url + path + id, { headers: headers });
  }

  saveUserStory(formData: FormData): Observable<any> {
    const path = '/posts/save';
    return this.http.post(this.url + path, formData, { observe: 'events',  reportProgress: true })
        .pipe(
            catchError(err => this.handleError(err))
        );
  }

  deleteUserStory(id): Observable<any> {
    const path = '/posts/delete';
    return this.http.post<any[]>(this.url + path, {post_id: id});
  }

  private handleError(error: any) {
    return throwError(error);
  }
}
