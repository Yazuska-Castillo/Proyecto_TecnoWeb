import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import localeEsCl from '@angular/common/locales/es-CL';
registerLocaleData(localeEsCl);


import { GestionPromocionesComponent } from './components/gestion-promociones/gestion-promociones.component';

@NgModule({
  declarations: [
    AppComponent,
    GestionPromocionesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CL' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
