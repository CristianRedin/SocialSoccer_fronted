// src/app/core/models/player.model.ts
export interface Player {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  jerseyNumber: number;
  teamId?: string;
  teamName?: string;
  dateOfBirth?: Date;
  joinedDate: Date;
  isCaptain: boolean;
  isActive: boolean;
}