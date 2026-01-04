// src/app/core/models/statistic.model.ts
export interface PlayerStatistics {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  matchesplayers: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesplayers: number;
  averageRating: number;
  mvpCount: number;
  bestPosition: string;
  recentForm: number[]; // Calificaciones de últimos 5 partidos
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
  goalDifference: number;
  points: number;
  position: number;
  homeRecord: { wins: number; draws: number; losses: number };
  awayRecord: { wins: number; draws: number; losses: number };
}

export interface TournamentStatistics {
  tournamentId: string;
  tournamentName: string;
  totalMatches: number;
  totalGoals: number;
  averageGoalsPerMatch: number;
  totalYellowCards: number;
  totalRedCards: number;
  topScorer: {
    playerId: string;
    playerName: string;
    goals: number;
    teamName: string;
  };
  bestTeam: {
    teamId: string;
    teamName: string;
    points: number;
    winPercentage: number;
  };
}