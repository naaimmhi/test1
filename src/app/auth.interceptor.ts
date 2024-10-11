import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core'; // Utilisé pour injecter des services dans des fonctions
import { catchError, switchMap, throwError } from 'rxjs'; // Outils pour gérer les flux d'observables
import { ApiService } from './api.service'; // Service personnalisé qui gère l'API, notamment pour rafraîchir le token

// Définition de l'intercepteur `authInterceptor` qui intercepte chaque requête HTTP sortante
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injection du service ApiService via la fonction `inject`. Ce service permet de rafraîchir le token.
  const authService = inject(ApiService);

  // Cloner la requête originale et y ajouter les en-têtes d'authentification
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Récupération du token stocké dans le `localStorage`
      'Content-Type': 'application/json', // Définir le type de contenu pour s'assurer que les données envoyées sont au format JSON
    },
  });

  // Passer la requête clonée à la prochaine étape de la chaîne et intercepter les erreurs potentielles
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si l'erreur est une 401 (Unauthorized), cela signifie que le token est probablement expiré ou invalide
      if (error.status === 401) {
        // Tenter de rafraîchir le token en appelant une méthode du `authService`
        return authService.refreshToken().pipe(
          // `switchMap` permet d'annuler la première requête et d'en lancer une nouvelle une fois le token rafraîchi
          switchMap((newToken: string) => {
            // Stocker le nouveau token dans le `localStorage`
            localStorage.setItem('token', newToken);

            // Cloner la requête d'origine en y insérant le nouveau token d'authentification
            const retryRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`, // Utilisation du nouveau token pour la requête à rejouer
              },
            });

            // Rejouer la requête initiale avec le nouveau token
            return next(retryRequest);
          }),
          catchError((refreshError) => {
            // Si la tentative de rafraîchir le token échoue, gérer cette erreur (par exemple, déconnecter l'utilisateur)
            return throwError(refreshError); // Renvoie une erreur après avoir échoué à rafraîchir le token
          })
        );
      }

      // Si ce n'est pas une erreur 401, propager l'erreur originale à l'appelant
      return throwError(error);
    })
  );
};
// Explication détaillée :
// Importations :

// HttpInterceptorFn et HttpErrorResponse proviennent de @angular/common/http et sont utilisés pour intercepter les requêtes HTTP et traiter les erreurs respectivement.
// inject est utilisé pour accéder aux services, ici, ApiService, dans une fonction.
// catchError, switchMap, et throwError sont des opérateurs de RxJS qui permettent de gérer les erreurs dans les flux d'observables et de modifier ces flux.
// ApiService est un service qui contient une méthode pour rafraîchir le token.
// authInterceptor :

// Il intercepte toutes les requêtes HTTP sortantes et les modifie avant de les envoyer.
// Le token d'authentification est récupéré du localStorage et ajouté à l'en-tête Authorization.
// Gestion des erreurs :

// Si la requête retourne une erreur 401 (non autorisée), l'intercepteur tente de rafraîchir le token via authService.refreshToken().
// Si le rafraîchissement du token réussit, il met à jour le localStorage avec le nouveau token et renvoie la requête initiale avec ce nouveau token.
// Si le rafraîchissement échoue (par exemple, le token de rafraîchissement est aussi expiré), il renvoie une erreur.
// Traitement des erreurs non liées à 401 :

// Si l'erreur n'est pas un 401, l'intercepteur ne fait rien de spécial, il relaye simplement l'erreur à l'appelant initial.
// Ce mécanisme est souvent utilisé pour maintenir une session utilisateur active sans nécessiter de nouvelle connexion manuelle si le token expire, en utilisant un token de rafraîchissement.

// import { inject, NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { LayoutComponent } from './layout/layout.component';
// import { FormulaireComponent } from './formulaire/formulaire.component';
// import { FiltreComponent } from './filtre/filtre.component';
// import { LoginComponent } from './login/login.component';
// import { LoginGuard } from './auth.guard';

// const routes: Routes = [
//   { path: 'login', component: LoginComponent }, // Ajoutez cette route
//   // Autres routes...

//   {
//     path: '',
//     component: LayoutComponent,
//     canActivate: [() => inject(LoginGuard).canActivate()],
//     children: [
//       { path: 'formulaire', component: FormulaireComponent },
//       { path: 'filtre', component: FiltreComponent },
//     ],
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}

// ************* AppComponent.module.ts***********

// provideHttpClient(withInterceptors([authInterceptor])),
