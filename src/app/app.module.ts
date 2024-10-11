import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { FiltreComponent } from './filtre/filtre.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api'; // Importez MessageService
import { ToastModule } from 'primeng/toast';
import { authInterceptor } from './auth.interceptor';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FormulaireComponent,
    FiltreComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    PaginatorModule,
    MatTooltipModule,
    TableModule,
  ],
  providers: [
    provideAnimationsAsync(),
    MessageService,
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
