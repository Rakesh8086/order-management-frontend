import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';
import { httpInterceptorProviders } from './helper/http.interceptor';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { InvoiceHistoryComponent } from './invoice-history/invoice-history.component';
import { FinanceDashboardComponent } from './finance-dashboard/finance-dashboard.component';
import { ProfileComponent } from './profile.component/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    AddProductComponent,
    ManageProductComponent,
    PlaceOrderComponent,
    OrderHistoryComponent,
    ManageOrderComponent,
    InvoiceHistoryComponent,
    FinanceDashboardComponent,
    ProfileComponent
 ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
