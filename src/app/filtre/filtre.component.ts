import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-filtre',
  templateUrl: './filtre.component.html',
  styleUrl: './filtre.component.scss',
})
export class FiltreComponent implements OnInit {
  listProductCategory: any = [];
  constructor(private ser: ApiService) {}

  ngOnInit() {
    this.getProductCategoryList();
  }

  getProductCategoryList() {
    this.ser.getProductCategoryList().subscribe((res) => {
      this.listProductCategory = res;
      console.log('listProductCategory', res);
    });
  }
}
