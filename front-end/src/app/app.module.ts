import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

import { HttpClientModule } from '@angular/common/http';
import { SearchPipe } from './shared/pipes/search.pipe';
import { FavoriteStationPipe } from './shared/pipes/favorite-station.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SearchPipe,
    FavoriteStationPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
