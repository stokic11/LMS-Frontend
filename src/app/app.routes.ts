import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { FakultetTableComponent } from './components/fakultet-table/fakultet-table.component';
import { StudijskiProgramTableComponent } from './components/studijski-program-table/studijski-program-table.component';

export const routes: Routes = [
    { path: '', redirectTo: '/homepage', pathMatch: 'full' },
    { path: 'homepage', component: HomepageComponent, data: { animation: "homepage" } },
    { path: 'fakulteti', component: FakultetTableComponent, data: { animation: "fakulteti" } },
    { path: 'studijski-programi', component: StudijskiProgramTableComponent, data: { animation: "studijski-programi" } },
];
