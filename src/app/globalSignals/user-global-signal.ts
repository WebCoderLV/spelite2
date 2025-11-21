import { Injectable, signal } from '@angular/core';
import { UserModel } from '../models/userModel';

@Injectable({
  providedIn: 'root',
})
export class UserGlobalSignal {

  public userGlobalSignal = signal<UserModel>({ id: 0, name: '', password: '', playedGames: 0, wonGames: 0 });
}
