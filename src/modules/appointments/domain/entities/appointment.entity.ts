export class AppointmentEntity {
  id: string;
  professionalId: string;
  userId: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AppointmentEntity>) {
    Object.assign(this, partial);
  }
}
