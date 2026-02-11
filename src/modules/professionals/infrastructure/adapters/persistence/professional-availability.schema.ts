import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AvailabilityBlock } from '../../../domain/entities/professional-availability.entity';
import { Professional } from './professional.schema';

@Entity('professional_availabilities')
export class ProfessionalAvailability {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'professional_id' })
  professionalId: string;

  @ManyToOne(() => Professional, (p) => p.availability)
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column()
  dayOfWeek: number;

  @Column({ type: 'enum', enum: AvailabilityBlock })
  block: AvailabilityBlock;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
