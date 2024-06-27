import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from '../shared/material-module';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HelpDetailsComponent } from './help-details/help-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { ThemeService } from '../service/theme.service';
import { LayoutComponent } from './layout/layout.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { UsersComponent } from './dialog/users/users.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { CategoryComponent } from './dialog/category/category.component';
import { QuillModule } from 'ngx-quill'
import { SharedModule } from '../shared/shared.module';
import { ManageArticleComponent } from './manage-article/manage-article.component';
import { ArticleComponent } from './dialog/article/article.component';
import { ViewComponent } from './dialog/view/view.component';


@NgModule({
  declarations: [
    ConfirmationComponent,
    DashboardComponent,
    HelpDetailsComponent,
    LayoutComponent,
    ManageUsersComponent,
    UsersComponent,
    ManageCategoryComponent,
    CategoryComponent,
    ManageArticleComponent,
    ArticleComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatToolbarModule,
    FormsModule,
    MaterialModule,
    QuillModule.forRoot(),
    SharedModule
  ],
  providers: [provideHttpClient(), ThemeService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }
