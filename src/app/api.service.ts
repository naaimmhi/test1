import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.URL;

  constructor(private http: HttpClient) {}

  // Appel pour obtenir les informations de l'utilisateur authentifié
  // me(): Observable<any> {
  //   return this.http.get(this.baseUrl + '/auth/me');
  // }

  // Appel pour se connecter
  login(username: string, password: string): Observable<any> {
    return this.http.post(this.baseUrl + '/auth/login', { username, password });
  }
  // logout(): Observable<any> {
  //   return this.http.post(this.baseUrl + '/logout', {});
  // }

  refreshToken(): Observable<string> {
    return this.http.post<string>(this.baseUrl + '/refresh', {
      refreshToken: localStorage.getItem('refreshToken'),
    });
  }

  // Obtenir la liste des employés
  // api.service.ts
  getAllProducts(
    trem?: string,
    limit?: number,
    skip?: number,
    sort?: string, //  selon id ou title (designation)
    order?: string // selon ascedant ou descendant
  ): Observable<any> {
    let url = '';
    //  term
    //   ? `https://dummyjson.com/products/search?q=${term}`
    //   : 'https://dummyjson.com/products';
    if (trem) {
      url = `https://dummyjson.com/products/search?q=${trem}&limit=${
        limit ?? 10 // limit = nombre max de produit a afficher
      }&skip=${skip ?? 0}&sortBy=${sort ?? 'title'}&orderBy=${order ?? 'asc'}`; // skip = indice 0 = premier produit i= 1;
    } else {
      url = `https://dummyjson.com/products?limit=${limit ?? 10}&skip=${
        skip ?? 0
      }&sortBy=${sort ?? 'title'}&orderBy=${order ?? 'asc'}`;
    }
    return this.http.get<any>(url); //if with lambda language
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`https://dummyjson.com/products/${id}`);
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete('https://dummyjson.com/products/' + id);
  }
  addProduct(newProduct: any): Observable<any> {
    return this.http.post('https://dummyjson.com/products/add', newProduct);
  }

  updateProduct(
    id: number,
    updatedProduct: { title: string; category: string }
  ): Observable<any> {
    return this.http.put(
      `https://dummyjson.com/products/${id}`,
      updatedProduct
    );
  }

  getCategories(): Observable<any> {
    return this.http.get<any>('https://dummyjson.com/products/categories');
  }
  getProductsByCategory(category: string): Observable<any> {
    return this.http.get<any>(
      `https://dummyjson.com/products/category/${category}`
    );
  }
  getProductCategoryList(): Observable<any> {
    return this.http.get('https://dummyjson.com/products/category-list');
  }
}

// // Ajouter un employé
// addEmploye(employe: any): Observable<any> {
//   return this.http.post<any>(this.baseUrl, employe);
// }

// // Mettre à jour un employé
// updateEmploye(id: number, employe: any): Observable<any> {
//   return this.http.put<any>(`${this.baseUrl}/${id}`, employe);
// }

// // Supprimer un employé
// deleteEmploye(id: number): Observable<any> {
//   return this.http.delete<any>(`${this.baseUrl}/${id}`);
// }
