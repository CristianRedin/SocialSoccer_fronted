// src/app/presentation/pages/statistics/statistics.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.html',
  styleUrls: ['./statistics.scss']
})
export class StatisticsComponent {
  playerStats = {
    goals: 15,
    assists: 8,
    yellowCards: 2,
    redCards: 0,
    matchesplayers: 24,
    minutesplayers: 2160,
    mvpCount: 5,
    averageRating: 8.2
  };

  topScorers = [
    { position: 1, name: 'Juan Pérez', team: 'Fénix FC', goals: 15, matches: 12 },
    { position: 2, name: 'Carlos Rodríguez', team: 'Estrellas Rojas', goals: 12, matches: 10 },
    { position: 3, name: 'Luis Martínez', team: 'Águilas FC', goals: 10, matches: 11 },
    { position: 4, name: 'Miguel Ángel', team: 'Real Cantera', goals: 9, matches: 12 },
    { position: 5, name: 'Roberto Sánchez', team: 'Los Vikingos', goals: 8, matches: 10 }
  ];

  teamStandings = [
    { position: 1, team: 'Estrellas Rojas', points: 28, matches: 10, wins: 9, draws: 1, losses: 0 },
    { position: 2, team: 'Águilas FC', points: 22, matches: 10, wins: 7, draws: 1, losses: 2 },
    { position: 3, team: 'Fénix FC', points: 19, matches: 10, wins: 6, draws: 1, losses: 3 },
    { position: 4, team: 'Real Cantera', points: 15, matches: 10, wins: 4, draws: 3, losses: 3 },
    { position: 5, team: 'Los Vikingos', points: 12, matches: 10, wins: 3, draws: 3, losses: 4 }
  ];

  constructor() {
    console.log('✅ Componente Statistics cargado');
  }
}