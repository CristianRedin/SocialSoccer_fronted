// src/app/core/models/match.model.ts
import { Team } from './team.model';
import { Player } from './player.model';

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  CANCELLED = 'cancelled'
}

export enum MatchEventType {
  GOAL = 'goal',
  YELLOW_CARD = 'yellow_card',
  RED_CARD = 'red_card',
  SUBSTITUTION = 'substitution',
  PENALTY = 'penalty',
  INJURY = 'injury'
}

export interface Match {
  id: string;
  tournamentId: string;
  tournamentName: string;
  round: number;
  matchNumber: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  date: Date;
  location: string;
  referee: string;
  mvp?: Player;
  events: MatchEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchEvent {
  type: MatchEventType;
  minute: number;
  player: Player;
  team: Team;
  description?: string;
  assist?: Player;
}