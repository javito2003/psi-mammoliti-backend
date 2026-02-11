import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AppointmentStatus } from '../../../domain/entities/appointment.entity';
import { Professional } from '../../../../professionals/infrastructure/adapters/persistence/professional.schema';
import { User } from '../../../../users/infrastructure/adapters/persistence/user.schema';

@Entity('appointments')
export class Appointment {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'professional_id' })
  professionalId: string;

  @ManyToOne(() => Professional)
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp', name: 'start_at' })
  startAt: Date;

  @Column({ type: 'timestamp', name: 'end_at' })
  endAt: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.CONFIRMED,
  })
  status: AppointmentStatus;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
