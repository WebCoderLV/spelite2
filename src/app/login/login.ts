import { Component, inject, signal } from '@angular/core';
import { UserModel } from '../models/userModel';
import { form, Field, maxLength, minLength, required } from '@angular/forms/signals';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { UserGlobalSignal } from '../globalSignals/user-global-signal';

@Component({
  selector: 'app-login',
  imports: [Field],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  globalUser: UserGlobalSignal = inject(UserGlobalSignal);

  userSignal = signal<UserModel>({ name: '', password: '', playedGames: 0, wonGames: 0 });

  loginForm = form(this.userSignal, (p) => {
    required(p.name, { message: 'Name is required' });
    minLength(p.name, 3, { message: 'Name must be at least 3 characters' });
    maxLength(p.name, 25, { message: 'Name cannot exceed 25 characters' });

    required(p.password, { message: 'Password is required' });
    minLength(p.password, 4, { message: 'Password must be at least 4 characters' });
    maxLength(p.password, 50, { message: 'Password cannot exceed 50 characters' });
  });

  onClick() {
    this.userService.login(this.userSignal()).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body !== null) {
          this.globalUser.userGlobalSignal.update(() => ({
            id: response.body.id as number,
            name: this.loginForm.name().value(),
            password: this.loginForm.password().value(),
            playedGames: response.body.playedGames as number,
            wonGames: response.body.wonGames as number
          }));
          this.router.navigate(['/game']);
        } else {
          console.log('Login failed with status:', response.status);
          this.router.navigate(['/not-found']);
        }
      },
      error: (error) => {
        console.error('Error details:', error.message || error);
        this.router.navigate(['/not-found']);
      }
    });
  }





}
