import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { StudentHomepageComponent } from './components/student-homepage/student-homepage.component';
import { FakultetTableComponent } from './components/fakultet-table/fakultet-table.component';
import { FakultetDetailsComponent } from './components/fakultet-details/fakultet-details.component';
import { StudijskiProgramTableComponent } from './components/studijski-program-table/studijski-program-table.component';
import { AuthGuard } from './auth_guard';
import { NastavnikHomepageComponent } from './components/nastavnik-homepage/nastavnik-homepage.component';
import { AdminHomepageComponent } from './components/admin-homepage/admin-homepage.component';
import { StudentskaSluzbaHomepageComponent } from './components/studentska-sluzba-homepage/studentska-sluzba-homepage.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomepageComponent
  },
  { 
    path: 'homepage', 
    component: HomepageComponent
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'student-homepage', 
    component: StudentHomepageComponent,
  canActivate: [AuthGuard],
  data: { uloge: ['student'] }
  },
  { 
    path: 'nastavnik-homepage', 
    component: NastavnikHomepageComponent,
  canActivate: [AuthGuard],
  data: { uloge: ['nastavnik'] }
  },
  { 
    path: 'admin-homepage', 
    component: AdminHomepageComponent,
    canActivate: [AuthGuard],
    data: { uloge: ['admin'] }
  },
  { 
    path: 'studentska-sluzba-homepage', 
    component: StudentskaSluzbaHomepageComponent,
    canActivate: [AuthGuard],
    data: { uloge: ['studentska_sluzba'] }
  },
  { path: 'fakulteti', component: FakultetTableComponent },
  { path: 'fakulteti/:id', component: FakultetDetailsComponent },
  { 
    path: 'studijski-programi', 
    component: StudijskiProgramTableComponent,
    canActivate: [AuthGuard],
    data: { uloge: ['korisnik'] }
  },
  
  { path: '**', redirectTo: '' }
];
