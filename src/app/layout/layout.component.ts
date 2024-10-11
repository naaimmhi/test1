import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  // Déclarer la variable isAuth
  submitLogout: boolean = false;
  constructor(private router: Router, private ser: ApiService) {} // Injecter le Router

  ngOnInit(): void {}

  logout() {
    this.submitLogout = true;

    // Supprimer l'authentification du localStorage
    localStorage.removeItem('token');

    // Rediriger vers la page de login
    this.router.navigate(['/login']);
  }
}
