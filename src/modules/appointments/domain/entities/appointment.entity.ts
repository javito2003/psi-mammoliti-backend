export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface AppointmentEntity {
  id: string;
  professionalId: string;
  userId: string;
  startAt: Date;
  endAt: Date;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
  professionalFirstName?: string;
  professionalLastName?: string;
}
