import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material-module';
import { NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, SPINNER } from 'ngx-ui-loader';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ThemeService } from './service/theme.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TokenInterceptor } from './service/token.interceptor';
import { QuillModule } from 'ngx-quill'
import { SharedModule } from './shared/shared.module';
import { ArticleDetailsComponent } from './article-details/article-details.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: "Loading...",
  textColor: "#FFFFFF",
  textPosition: "center-center",
  pbColor: "#FFFFFF",
  bgsColor: "#FFFFFF",
  fgsColor: "#FFFFFF",
  fgsType: SPINNER.ballSpinClockwise,
  fgsSize: 100,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ArticleDetailsComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatToolbarModule,
    FormsModule,
    MaterialModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    QuillModule.forRoot(),
    SharedModule
  ],
  providers: [provideHttpClient(), { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }, ThemeService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
