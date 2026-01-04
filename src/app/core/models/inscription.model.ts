// src/app/core/models/inscription.model.ts
export enum InscriptionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAYMENT_PENDING = 'payment_pending'
}

export interface Inscription {
  id: string;
  tournamentId: string;
  tournamentName: string;
  teamId: string;
  teamName: string;
  captainId: string;
  captainName: string;
  status: InscriptionStatus;
  paymentProof?: string;
  paymentDate?: Date;
  amount: number;
  currency: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InscriptionFormData {
  tournamentId: string;
  teamId: string;
  captainId: string;
  acceptRules: boolean;
  acceptTerms: boolean;
  paymentMethod?: string;
}