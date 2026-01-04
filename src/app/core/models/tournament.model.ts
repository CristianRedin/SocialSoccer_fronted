export interface TournamentDetail {
  id: string;
  name: string;
  description: string;
  rules: string[];
  prizes: Prize[];
  calendar: Match[];
  teams: Team[];
  standings: Standing[];
  brackets: BracketMatch[];
  statistics: Statistics;
}

export interface Prize {
  position: number;
  amount: string;
  description: string;
}

export interface Match {
  id: string;
  date: Date;
  time: string;
  homeTeam: string;
  awayTeam: string;
  score?: string;
  location: string;
  status: 'scheduled' | 'in-progress' | 'finished' | 'cancelled';
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  captain: string;
  players: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Standing {
  position: number;
  team: Team;
  players: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface BracketMatch {
  id: string;
  round: 'quarter' | 'semi' | 'final';
  matchNumber: number;
  team1: { name: string; score?: number };
  team2: { name: string; score?: number };
  winner?: string;
  date: Date;
  completed: boolean;
}

export interface Statistics {
  totalMatches: number;
  matchesplayers: number;
  goalsScored: number;
  averageGoals: number;
  topScorer: { name: string; team: string; goals: number };
  bestTeam: { name: string; points: number };
}

// Tu interface Tournament original
export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: TournamentStatus;
  type: TournamentType;
  rules: string;
  prize: string;
  maxTeams: number;
  currentTeams: number;
  location: string;
  registrationDeadline: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TournamentStatus {
  ACTIVE = 'active',
  UPCOMING = 'upcoming',
  FINISHED = 'finished'
}

export enum TournamentType {
  ELIMINATION = 'elimination',
  LEAGUE = 'league',
  MIXED = 'mixed'
}