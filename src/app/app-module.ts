import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';
import { httpInterceptorProviders } from './helper/http.interceptor';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent
 ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
