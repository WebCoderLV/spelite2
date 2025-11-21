import { Component, inject, input, output } from '@angular/core';
import { UserService } from '../services/user-service';
import { UserGlobalSignal } from '../globalSignals/user-global-signal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  user = input.required<UserGlobalSignal>();
  userService = inject(UserService);
  router: Router = inject(Router);
  rulesBoolean: boolean = true;
  rules = output<boolean>();
  newGame = output<void>();

  exitGame() {
    this.user().userGlobalSignal.set({ id: 0, name: '', password: '', playedGames: 0, wonGames: 0 });
    this.router.navigate(['/login']);
  }
  startNewGame() {
    this.newGame.emit();
  }

  showGameRules() {
    this.rulesBoolean = !this.rulesBoolean;
    this.rules.emit(this.rulesBoolean);
  }

  deleteAccount() {
    this.userService.deleteAccount(this.user().userGlobalSignal().id!).subscribe(response => {
      if (response.status === 204) {
        this.user().userGlobalSignal.set({ id: 0, name: '', password: '', playedGames: 0, wonGames: 0 });
        this.exitGame();
      } else {
        console.log('Failed to delete account with status:', response.status);
      }
    });
  }
}
