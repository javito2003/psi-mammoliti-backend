export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class AppointmentEntity {
  id: string;
  professionalId: string;
  userId: string;
  startAt: Date;
  endAt: Date;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AppointmentEntity>) {
    Object.assign(this, partial);
  }
}
