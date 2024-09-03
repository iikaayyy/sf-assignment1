import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent, NavbarComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, CommonModule],
  providers: [provideClientHydration(), provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
