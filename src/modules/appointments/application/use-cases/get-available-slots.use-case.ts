import { Inject, Injectable } from '@nestjs/common';
import {
  APPOINTMENT_REPOSITORY,
  type AppointmentRepositoryPort,
} from '../../domain/ports/appointment.repository.port';
import {
  PROFESSIONAL_REPOSITORY,
  type ProfessionalRepositoryPort,
} from '../../../professionals/domain/ports/professional.repository.port';
import { AvailabilityBlock } from '../../../professionals/domain/entities/professional-availability.entity';
import {
  APPOINTMENT_DURATION_HOURS,
  AvailabilityBlockHours,
  WEEK_DAYS,
} from '../../domain/constants/availability-block.constants';
import { setHour } from 'src/modules/shared/util/date.util';
import { ProfessionalNotFoundError } from 'src/modules/professionals/domain/exceptions/professionals.error';

@Injectable()
export class GetAvailableSlotsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: AppointmentRepositoryPort,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepo: ProfessionalRepositoryPort,
  ) {}

  async execute(professionalId: string, weekStart?: string): Promise<string[]> {
    const startDate = weekStart ? new Date(weekStart) : new Date();
    setHour(startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + WEEK_DAYS);

    // 1. Get Professional Availability Rules
    const professional = await this.professionalRepo.findById(professionalId);
    if (!professional) throw new ProfessionalNotFoundError(professionalId);

    const { availability: availabilityRules } = professional;

    // 2. Get Existing Appointments
    const appointments =
      await this.appointmentRepo.findByProfessionalIdAndDateRange(
        professionalId,
        startDate,
        endDate,
      );

    // 3. Generate Slots
    const slots: Date[] = [];
    const loopDate = new Date(startDate);

    for (let i = 0; i < WEEK_DAYS; i++) {
      const currentDayOfWeek = loopDate.getDay();

      // Find matching rules for this day
      const dayRules = availabilityRules.filter(
        (rule) => rule.dayOfWeek === currentDayOfWeek,
      );

      for (const rule of dayRules) {
        const generatedSlots = this.generateSlotsForBlock(loopDate, rule.block);
        slots.push(...generatedSlots);
      }

      loopDate.setDate(loopDate.getDate() + APPOINTMENT_DURATION_HOURS);
    }

    // 4. Filter Conflicts
    const validSlots = slots.filter((slot) => {
      // Check if this slot overlaps with any appointment
      // Slot starts at 'slot', ends at 'slot + APPOINTMENT_DURATION_HOURS h'
      const slotEnd = new Date(slot);
      slotEnd.setHours(slot.getHours() + APPOINTMENT_DURATION_HOURS);

      return !appointments.some((appt) => {
        return appt.startAt < slotEnd && appt.endAt > slot;
      });
    });

    // 5. Filter Past Slots (if today)
    const now = new Date();
    const futureSlots = validSlots.filter((slot) => slot > now);

    return futureSlots.map((s) => s.toISOString());
  }

  private generateSlotsForBlock(date: Date, block: AvailabilityBlock): Date[] {
    const slots: Date[] = [];
    const baseDate = new Date(date);

    const { start: startHour = 0, end: endHour = 0 } =
      AvailabilityBlockHours[block];

    for (let hour = startHour; hour < endHour; hour++) {
      const slot = new Date(baseDate);
      setHour(slot, hour);
      slots.push(slot);
    }

    return slots;
  }
}
