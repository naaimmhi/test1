import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  submiting = false;

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private message: MessageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Tentative de connexion avec:', this.loginForm.value);
      this.submiting = true;
      this.apiService
        .login(this.username?.value, this.password?.value)
        .subscribe({
          next: (res) => {
            localStorage.setItem('token', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);

            // Appel de l'API pour obtenir les informations de l'utilisateur connecté

            this.router.navigate(['formulaire']); // Redirection
            this.message.add({
              severity: 'success',
              detail: 'Connexion réussie !',
            });
          },
          error: (error) => {
            console.error('Erreur de connexion:', error);
            this.submiting = false;

            // Gestion de l'erreur
            if (error.status === 500) {
              this.message.add({
                severity: 'error',
                detail: 'Erreur de serveur, veuillez réessayer plus tard.',
              });
            } else {
              this.message.add({
                severity: 'error',
                detail: "Nom d'utilisateur ou mot de passe incorrect.",
              });
            }
          },
          complete: () => {
            this.submiting = false; // Réinitialisation de l'état après la requête
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
