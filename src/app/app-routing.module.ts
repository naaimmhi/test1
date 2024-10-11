import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { FiltreComponent } from './filtre/filtre.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [() => inject(LoginGuard).canActivate()],
    children: [
      { path: 'formulaire', component: FormulaireComponent },
      { path: 'filtre', component: FiltreComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
