import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then(m => m.Login),
        title: 'Login'
    },
    {
        path: 'game',
        loadComponent: () => import('./game/game').then(m => m.Game),
        title: 'Play The Game!'
    },
    {
        path: '**',
        loadComponent: () => import('./not-found/not-found').then(m => m.NotFound),
        title: 'Not Found'
    }
];
