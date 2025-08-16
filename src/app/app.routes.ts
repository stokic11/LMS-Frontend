import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AuthGuard } from './auth_guard';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { 
    path: 'fakulteti', 
    loadComponent: () => import('./components/fakultet-table/fakultet-table.component').then(m => m.FakultetTableComponent)
  },
  { 
    path: 'fakulteti/:id', 
    loadComponent: () => import('./components/fakultet-details/fakultet-details.component').then(m => m.FakultetDetailsComponent)
  },
  { 
    path: 'studijski-programi',
    loadComponent: () => import('./components/studijski-program-table/studijski-program-table.component').then(m => m.StudijskiProgramTableComponent),
    canActivate: [AuthGuard],
    data: { uloge: ['korisnik'] }
  },
  
  { path: '**', redirectTo: '' }
];
