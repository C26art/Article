import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThemeService } from '../../../service/theme.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  article: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public themeService: ThemeService,
  ) { }

  ngOnInit(): void {
    this.article = this.dialogData.data;

  }

}
