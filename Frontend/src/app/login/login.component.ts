import { ThemeService } from './../service/theme.service';
import { Component, OnInit } from '@angular/core';
import { AppUserService } from '../service/app-user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../service/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  passwordVisible = false;
  loginForm!: FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private appUserService: AppUserService,
    private snackBarService: SnackbarService,
    public themeService: ThemeService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]]
    });
  }

  handleSubmit() {
    this.ngxService.start();
    let formData = this.loginForm.value;
    let data = {
      email: formData.email,
      password: formData.password
    };

    this.appUserService.login(data).subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        localStorage.setItem('token', response.token);
        this.router.navigate(['/article_Hub/dashboard']);
      },
      error: (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBarService.openSnackBar(this.responseMessage);
      }
    });
  }

  onBack(){
    this.router.navigate(['/']);
  }
}
