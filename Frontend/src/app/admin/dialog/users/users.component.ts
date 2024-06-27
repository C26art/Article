import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../service/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ThemeService } from '../../../service/theme.service';
import { AppUserService } from '../../../service/app-user.service';
import { GlobalConstants } from '../../../shared/global-constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  onAddUser = new EventEmitter();
  onEditUser = new EventEmitter();
  usersForm!: FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  responseMessage: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    public themeService: ThemeService,
    private appUserService: AppUserService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<UsersComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.usersForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.usersForm.patchValue(this.dialogData.data);
      this.usersForm.controls['password'].setValue('password');
    }
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.ngxService.start();
    let formData = this.usersForm.value;
    let data = {
      email: formData.email,
      name: formData.name,
      password: formData.password
    };

    this.appUserService.addNewAppUser(data).subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.onAddUser.emit();
        this.responseMessage = response.message;
        this.snackBarService.openSnackBar(this.responseMessage);
      },
      error: (error: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        console.error(error);
        this.responseMessage = error.error?.message || GlobalConstants.genericError;
        this.snackBarService.openSnackBar(this.responseMessage);
      }
    });
  }

  edit() {
    this.ngxService.start();
    let formData = this.usersForm.value;
    let data = {
      id: this.dialogData.data.id,
      email: formData.email,
      name: formData.name
    };

    this.appUserService.updateUser(data).subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.onEditUser.emit();
        this.responseMessage = response.message;
        this.snackBarService.openSnackBar(this.responseMessage);
      },
      error: (error: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        console.error(error);
        this.responseMessage = error.error?.message || GlobalConstants.genericError;
        this.snackBarService.openSnackBar(this.responseMessage);
      }
    });
  }
}

