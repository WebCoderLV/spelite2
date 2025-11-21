import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GameDTO } from '../models/gameDTO';
import { GameModel } from '../models/gameModel';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly URL = environment.apiUrl;
  http = inject(HttpClient);

  public createGame(userId: number): Observable<any> {
    return this.http.post<number>(this.URL + "/game/start/" + userId, {}, {
      observe: 'response',
    });
  }

  checkGame(game: GameModel): Observable<any> {
    console.log('Checking game with data:', game);
    return this.http.post<GameDTO>(this.URL + "/game/check", game, {
      observe: 'response',
    });
  }

}
