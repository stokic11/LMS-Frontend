import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { StudentHomepageComponent } from './components/student-homepage/student-homepage.component';
import { FakultetTableComponent } from './components/fakultet-table/fakultet-table.component';
import { FakultetDetailsComponent } from './components/fakultet-details/fakultet-details.component';
import { StudijskiProgramTableComponent } from './components/studijski-program-table/studijski-program-table.component';
import { StudijskiProgramDetailsComponent } from './components/studijski-program-details/studijski-program-details.component';
import { PredmetTableComponent } from './components/predmet-table/predmet-table.component';
import { PredmetDetailsComponent } from './components/predmet-details/predmet-details.component';
import { AdminStudijskiProgramTableComponent } from './components/admin-studijski-program-table/admin-studijski-program-table.component';
import { AdminZaposleniComponent } from './components/admin-zaposleni/admin-zaposleni.component';
import { AuthGuard } from './auth_guard';
import { NastavnikHomepageComponent } from './components/nastavnik-homepage/nastavnik-homepage.component';
import { AdminHomepageComponent } from './components/admin-homepage/admin-homepage.component';
import { StudentskaSluzbaHomepageComponent } from './components/studentska-sluzba-homepage/studentska-sluzba-homepage.component';
import { KorisnikTableComponent } from './components/korisnik-table/korisnik-table.component';
import { ObavestenjeTableComponent } from './components/obavestenje-table/obavestenje-table.component';
import { ObavestenjeDetailsComponent } from './components/obavestenje-details/obavestenje-details.component';
import { StudentIstorijaComponent } from './components/student-istorija/student-istorija.component';
import { PrijavaIspitaComponent } from './components/prijava-ispita/prijava-ispita.component';

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
  { path: 'studijski-programi', component: StudijskiProgramTableComponent },
  { path: 'studijski-programi/:id', component: StudijskiProgramDetailsComponent },
  { path: 'predmeti', component: PredmetTableComponent },
  { path: 'predmeti/:id', component: PredmetDetailsComponent },
  { 
    path: 'korisnici',
    component: KorisnikTableComponent,
    canActivate: [AuthGuard],
    data: { uloge: ['admin'] }
  },
  { 
    path: 'admin/studijski-programi',
    component: AdminStudijskiProgramTableComponent,
    canActivate: [AuthGuard],
    data: { uloge: ['admin'] }
  },
  { 
    path: 'admin/zaposleni',
    component: AdminZaposleniComponent,
    canActivate: [AuthGuard],
    data: { uloge: ['admin'] }
  },
  { 
    path: 'obavestenja',
    component: ObavestenjeTableComponent,
    canActivate: [AuthGuard],
    data: { uloge: ['student']}
  },
  { 
    path: 'obavestenja/:id',
    component: ObavestenjeDetailsComponent,
    canActivate: [AuthGuard],
    data: { uloge: ['student']}
  },
  { 
    path: 'istorija',
    component: StudentIstorijaComponent,
    canActivate: [AuthGuard],
    data: { uloge: ['student']}
  },
  { 
    path: 'prijava-ispita',
    component: PrijavaIspitaComponent,
    canActivate: [AuthGuard],
    data: { uloge: ['student']}
  },
  { path: '**', redirectTo: '' }
];
