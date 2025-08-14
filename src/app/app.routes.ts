import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login/login.component';
import { RegisterComponent } from './components/register/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AuthGuard } from './auth_guard';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Example protected routes - add your actual components here
  { 
    path: 'fakultet', 
    loadComponent: () => import('./components/fakultet-table/fakultet-table.component').then(m => m.FakultetTableComponent),
    canActivate: [AuthGuard],
    data: { uloge: ['ADMIN', 'NASTAVNIK','KORISNIK'] } // Example roles
  },
  { 
    path: 'studijski-program', 
    loadComponent: () => import('./components/studijski-program-table/studijski-program-table.component').then(m => m.StudijskiProgramTableComponent),
    canActivate: [AuthGuard],
    data: { uloge: ['ADMIN'] } // Example - only admin can access
  },
  
  // Catch all route
  { path: '**', redirectTo: '' }
];
