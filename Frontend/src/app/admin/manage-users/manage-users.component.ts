import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../service/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppUserService } from '../../service/app-user.service';
import { ThemeService } from '../../service/theme.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-constants';
import { UsersComponent } from '../dialog/users/users.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'status', 'edit'];
  dataSource: any;
  responseMessage: any;

  constructor(
    private router: Router,
    private snackBarService: SnackbarService,
    public dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private appUserService: AppUserService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.appUserService.getAllAppUser().subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },
      error: (error: any) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        this.responseMessage = error.error?.message || GlobalConstants.genericError;
        this.snackBarService.openSnackBar(this.responseMessage);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(UsersComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const res = dialogRef.componentInstance.onAddUser.subscribe((response) => {
      this.tableData();
    });
  }


  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(UsersComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const res = dialogRef.componentInstance.onEditUser.subscribe((response) => {
      this.tableData();
    });
  }


  onChange(status: any, id: any) {
    this.ngxService.start();
    let data = {
      id: id,
      status: status.toString()
    }

    this.appUserService.updateUserStatus(data).subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackBarService.openSnackBar(this.responseMessage);
        this.tableData();
      },
      error: (error: any) => {
        this.ngxService.stop();
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message || GlobalConstants.genericError;
        }
        this.snackBarService.openSnackBar(this.responseMessage);
      }
    });
  }
}
