import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss'], // Corrigé en styleUrls
})
export class FormulaireComponent implements OnInit {
  products: any[] = [];
  categories: string[] = [];
  searchTerm: string = '';
  poductI: number = 0;
  newProduct: string = '';
  title: string = '';
  category: string = '';
  editingProductId: number | null = null; // ID du produit en cours de modification
  getcategory: string = '';
  selectedCategory: string = 'smartphones';
  private searchTerms = new Subject<string>();

  constructor(private ser: ApiService) {}

  ngOnInit(): void {
    this.getProductsByCategory();
    this.getCategories();
    this.getProduct(10); // on fait appelle dela methode sur ng auto ou bien sur templete
    this.getAllProducts();
    this.searchTerms
      .pipe(
        debounceTime(1000), // Ajustez le temps de debounce si nécessaire
        distinctUntilChanged()
      )
      .subscribe((term) => {
        console.log('term', term);
        this.search();
      });
  }

  // Récupérer la liste des produits
  getAllProducts() {
    this.ser.getAllProducts().subscribe((res: any) => {
      console.log('allproduct', res);
      this.totalRecords = res.total;

      this.products = res.products; // Assurez-vous d'accéder à la bonne propriété
    });
  }

  searchInputChanged($event: any): void {
    this.searchTerm = $event.target.value;
    this.searchTerms.next(this.searchTerm); // pour subject pour quelle puisse execute debounce et distingtime
  }

  search(): void {
    this.ser.getAllProducts(this.searchTerm).subscribe((res) => {
      console.log('respo', res);
      this.totalRecords = res.total;

      this.products = res.products; // Assurez-vous d'accéder à la bonne propriété
    });
  }

  first: number = 0; // first = indix

  rows: number = 10; // row = nombre de produit afficher sur page

  totalRecords: number = 0; //totalRecords = total produits viennent de api

  onPageChange(event: any) {
    console.log(`first: ${JSON.stringify(event)}`);
    this.first = event.first; // first valeur initiale = 0 f click ca vaut dire event page 2 index yabda b 10 page 3 index yabda b 30
    this.rows = event.rows; // hna event row clickut 3la 10 ghayab9aw 10 les produits clichut 3la 20 ghay taffichaw 20 o ghada
    this.ser
      .getAllProducts(this.searchTerm, this.rows, this.first)
      .subscribe((res) => {
        this.products = res.products;
        this.totalRecords = res.total;
        console.log('res', res);
      });
  }

  getProduct(id: number) {
    return this.ser.getProductById(id).subscribe((res) => {
      console.log('pId', res);
      this.poductI = res.id;
    });
  }

  deleteProduct(id: number) {
    this.ser.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter((p) => p.id !== id);
      console.log('p', this.products);
    });
  }
  addProduct(newProduct: { title: string; category: string }) {
    if ((this.title, this.category)) {
      this.ser.addProduct(newProduct).subscribe((product) => {
        console.log('product', product);
        this.products.push(product);
        // Réinitialisez les champs après l'ajout
        this.title = '';
        this.category = '';
      });
    }
  }
  // https://chatgpt.com/c/66ffdd97-8680-8013-a809-99b5220e9ec4
  updateProduct() {
    const updatedProduct = {
      id: this.editingProductId, // id li khdnaw bih
      title: this.title,
      category: this.category,
    };

    // Hna nakhdmo lmap bach n3odou l'array dyal products
    this.products = this.products.map((product) => {
      if (product.id === this.editingProductId) {
        return updatedProduct; // nmodifi l'objet
      }
      return product; // khlina l'objet khdmatsh
    });

    // Reset lform
    this.resetForm();
  }

  editProduct(product: any) {
    this.title = product.title;
    this.category = product.category;
    this.editingProductId = product.id;
    console.log('pld', product.id);
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.title = '';
    this.category = '';
    this.editingProductId = null;
  }

  getCategories() {
    this.ser.getCategories().subscribe((res) => {
      console.log('cat', res);
      this.categories = res.slug;
    });
  }

  getProductsByCategory() {
    if (this.selectedCategory) {
      this.ser
        .getProductsByCategory(this.selectedCategory)
        .subscribe((res: any) => {
          console.log('pl', res);
          this.products = res.products; // Assurez-vous de bien accéder à la propriété 'products'
        });
    }
  }
}
