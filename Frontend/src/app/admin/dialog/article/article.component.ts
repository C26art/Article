import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../service/category.service';
import { SnackbarService } from '../../../service/snackbar.service';
import { ThemeService } from '../../../service/theme.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleService } from '../../../service/article.service';
import { GlobalConstants } from '../../../shared/global-constants';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  onAddArticle = new EventEmitter();
  onEditArticle = new EventEmitter();
  articleForm!: FormGroup;
  dialogAction = "Add";
  action = "Add";
  responseMessage: any;
  categorys: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<ArticleComponent>,
    private ngxService: NgxUiLoaderService,
    public themeService: ThemeService,
    private articleService: ArticleService
  ) { }

  ngOnInit() {
    this.articleForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      status: [null, [Validators.required]]
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.articleForm.patchValue(this.dialogData.data);
    }
    this.getAllCategory();
    this.ngxService.start();
  }

  getAllCategory(){
    this.categoryService.getAllCategory().subscribe({
      next: (response: any) => {
        this.categorys = response;
        this.ngxService.stop();
      },
      error: (error: any) => {
        this.ngxService.stop();
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

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    let formData = this.articleForm.value;
    let data = {
      title: formData.title,
      content: formData.content,
      categoryId: formData.categoryId,
      status: formData.status
    };

    this.articleService.addNewArticle(data).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.ngxService.stop();
        this.onAddArticle.emit();
        this.responseMessage = response.message;
        this.snackBarService.openSnackBar(this.responseMessage);
      },
      error: (error: any) => {
        this.dialogRef.close();
        this.ngxService.stop();
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
    let formData = this.articleForm.value;
    let data = {
      id: this.dialogData.data.id,
      title: formData.title,
      content: formData.content,
      categoryId: formData.categoryId,
      status: formData.status
    };

    this.articleService.updateArticle(data).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.onEditArticle.emit();
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
