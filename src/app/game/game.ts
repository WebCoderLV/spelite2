import { Component, inject, OnInit, signal } from '@angular/core';
import { UserGlobalSignal } from '../globalSignals/user-global-signal';
import { Header } from "../header/header";
import { Router } from '@angular/router';
import { GameService } from '../services/game-service';
import { GameModel } from '../models/gameModel';
import { form, Field, required, min, max, schema } from '@angular/forms/signals';
import { HTML_CONSTANT } from '../../../public/rules';
import { GameDTO } from '../models/gameDTO';
import { DecimalPipe } from '@angular/common';



@Component({
  selector: 'app-game',
  imports: [Header, Field, DecimalPipe],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game implements OnInit {
  readonly rules = HTML_CONSTANT;

  globalUser = inject(UserGlobalSignal);
  router = inject(Router);
  gameService = inject(GameService);
  gameSignal = signal<GameModel>({
    guessNumber1: 0,
    guessNumber2: 0,
    guessNumber3: 0,
    guessNumber4: 0,
  });

  rulesBoolean = signal<boolean>(true);

  resultsCard = signal<boolean>(true);

  attempts = signal<{ result: GameDTO; inputedNumbers: number[] }[]>([]);

  // Init metode pieprasa no backenda ģenerēt jaunu spēli, ja eksistē lietotājs
  // Ja lietotājs nav pieslēdzies, tad pāradresē uz login lapu
  ngOnInit() {
    this.startNewGame();
  }

  startNewGame() {
    this.resultsCard.set(true);
    if (this.globalUser.userGlobalSignal().id === 0) {
      this.router.navigate(['/login']);
    } else {
      this.gameSignal.set({
        guessNumber1: 0,
        guessNumber2: 0,
        guessNumber3: 0,
        guessNumber4: 0,
      });
      this.attempts.set([]);
      this.globalUser.userGlobalSignal.update(user => ({ ...user, playedGames: user.playedGames + 1 }));
      this.gameService.createGame(this.globalUser.userGlobalSignal().id!).subscribe({
        next: (response) => {
          if (response.status === 201 && response.body !== null) {
            this.gameSignal.update((g) => ({ ...g, gameId: response.body as number }));
          } else {
            console.log('Failed to start game - invalid response');
          }
        },
        error: (error) => {
          console.error('Error creating game:', error);
        }
      });
    }
  }

  clearInput(input: HTMLInputElement) {
    input.value = '';

  }

  private customUniqueValidator(): boolean {
    const game = this.gameSignal();
    const numbers = [game.guessNumber1, game.guessNumber2, game.guessNumber3, game.guessNumber4];
    if (numbers.every(num => num !== 0) && numbers.length === new Set(numbers).size) {
      return true;
    } else {
      alert('Please fill all fields correctly and ensure all numbers are different!');
    }
    return false;
  }

  private inputValidatorSchema = schema<GameModel>((p) => {
    required(p.guessNumber1);
    min(p.guessNumber1, 1);
    max(p.guessNumber1, 9);
  });

  protected readonly gameForm = form(this.gameSignal, this.inputValidatorSchema)

  onRules(event: boolean) {
    this.rulesBoolean.set(event);
  }

  incrementWonGames() {
    this.globalUser.userGlobalSignal.update(user => ({ ...user, wonGames: user.wonGames + 1 }));
  }

  submitGuess() {
    if (this.gameForm().valid() && this.customUniqueValidator()) {
      this.gameService.checkGame(this.gameSignal()).subscribe({
        next: (response) => {
          if (response.status === 200 && response.body !== null) {
            this.resultsCard.set(false);
            const gameResult = response.body as GameDTO;
            if (gameResult.win) {
              let ok: boolean = confirm('Apsveicam! Jūs uzvarējāt! Sākam jaunu spēli.');
              if (ok) {
                this.incrementWonGames();
                this.startNewGame();
              } else {
                this.incrementWonGames();

              }
              return;
            }
            this.attempts.update(attempts => [...attempts, {
              result: gameResult,
              inputedNumbers: [
                this.gameSignal().guessNumber1,
                this.gameSignal().guessNumber2,
                this.gameSignal().guessNumber3,
                this.gameSignal().guessNumber4
              ]
            }]);
          } else {
            console.log('Failed to check game - invalid response');
          }
        },
        error: (error) => {
          console.error('Error checking game:', error);
        }
      });
    }
  }
}
