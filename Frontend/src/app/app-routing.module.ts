import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RouterGuardService } from './service/router-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  {
    path: 'article_Hub',
    loadChildren: () => import('./admin/admin.module').then(m=> m.AdminModule),
    canActivate: [RouterGuardService]

  },

  { path: '**', component: HomeComponent }
]



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    CommonModule,
    RouterModule
  ]
})
export class AppRoutingModule { }
