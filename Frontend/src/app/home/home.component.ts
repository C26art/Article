import { Component } from '@angular/core';
import { ThemeService } from '../service/theme.service';
import { ArticleService } from '../service/article.service';
import { SnackbarService } from '../service/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalConstants } from '../shared/global-constants';
import { ArticleDetailsComponent } from '../article-details/article-details.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  responseMessage: any;
  articles: any;
  searchText: string = '';

  constructor(public themeService: ThemeService,
    private articleService: ArticleService,
    private snackBarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.articleService.getAllPublishedArticle().subscribe({
      next: (response: any) => {
        this.articles = response;
        this.ngxService.stop();
      },
      error: (error: any) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        this.responseMessage = error.error?.message || GlobalConstants.genericError;
        this.snackBarService.openSnackBar(this.responseMessage);
      }
    });
  }

  filteredItems(): any {
    return this.articles?.filter(item =>
      item.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  changeTheme(color: string) {
    this.themeService.setTheme(color);
  }

  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ArticleDetailsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
}
