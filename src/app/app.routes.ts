import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./presentation/pages/home/home.component').then(
        m => m.HomeComponent
      ),
    title: 'Social Soccer - Inicio'
  },
  {
    path: 'results',
    loadComponent: () => 
      import('./presentation/pages/results/results.component').then(
        m => m.ResultsComponent
      ),
    title: 'Resultados'
  },
  {
    path: 'tournaments',
    loadComponent: () => 
      import('./presentation/pages/tournaments/tournaments.component').then(
        m => m.TournamentsComponent
      ),
    title: 'Torneos'
  },
  
  {
    path: 'inscriptions',
    loadComponent: () => 
      import('./presentation/pages/inscriptions/inscriptions.component').then(
        m => m.InscriptionsComponent
      ),
    title: 'Inscripciones'
  },
  {
    path: 'statistics',
    loadComponent: () => 
      import('./presentation/pages/statistics/statistics.component').then(
        m => m.StatisticsComponent
      ),
    title: 'Estadísticas'
  },

  
   
  { 
    path: '**', 
    redirectTo: '' 
  }
];