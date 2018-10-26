import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UsersComponent } from './components/users/users.component';
import { ToastyComponent } from './toasty/toasty.component';
import { JsonPipe } from './pipes/json.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    ToastyComponent,
    JsonPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
