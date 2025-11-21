import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserModel } from '../models/userModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly URL: string = environment.apiUrl;

  http = inject(HttpClient);

  public deleteAccount(userId: number) {
    return this.http.delete<void>(`${this.URL}/user/${userId}`, {
      observe: 'response'
    });
  }

  public login(user: UserModel): Observable<any> {
    return this.http.post<number>(this.URL + '/user', user, {
      observe: 'response'
    });
  }

}
