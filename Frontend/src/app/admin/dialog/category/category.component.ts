import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../service/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../../service/category.service';
import { ThemeService } from '../../../service/theme.service';
import { GlobalConstants } from '../../../shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm!: FormGroup;
  dialogAction = "Add";
  action = "Add";
  responseMessage: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<CategoryComponent>,
    private ngxService: NgxUiLoaderService,
    public themeService: ThemeService,
  ) { }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.categoryForm.patchValue(this.dialogData.data);
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
    let formData = this.categoryForm.value;
    let data = {
      name: formData.name
    };

    this.categoryService.addNewCategory(data).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.onAddCategory.emit();
        this.responseMessage = response.message;
        this.snackBarService.openSnackBar(this.responseMessage);
      },
      error: (error: any) => {
        this.dialogRef.close();
        console.error(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBarService.openSnackBar(this.responseMessage);
      }
    });
  }

  edit() {
    let formData = this.categoryForm.value;
    let data = {
      id: this.dialogData.data.id,
      name: formData.name
    };

    this.categoryService.updateCategory(data).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.onEditCategory.emit();
        this.responseMessage = response.message;
        this.snackBarService.openSnackBar(this.responseMessage);
      },
      error: (error: any) => {
        this.dialogRef.close();
        console.error(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBarService.openSnackBar(this.responseMessage);
      }
    });
  }
}
