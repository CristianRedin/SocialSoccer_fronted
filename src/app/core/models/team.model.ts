// src/app/core/models/team.model.ts
import { Player } from './player.model';

export interface Team {
  id: string;
  name: string;
  captainId: string;
  captainName: string;
  players: Player[];
  logo?: string;
  foundedDate: Date;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  totalGoalsFor: number;
  totalGoalsAgainst: number;
  winPercentage: number;
}

export interface TeamStatistics {
  teamId: string;
  teamName: string;
  matchesplayers: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  position: number;
  form: string[]; // Últimos 5 resultados: ['W', 'L', 'D', 'W', 'W']
}