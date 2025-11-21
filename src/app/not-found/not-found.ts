import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `<div>
                <br>
                <h1>404 Error</h1>
                <br>
                <h2>Page Not Found</h2>
                <br>
                <a href="/">Go to game</a>
            </div>`,
})
export class NotFound {
}
