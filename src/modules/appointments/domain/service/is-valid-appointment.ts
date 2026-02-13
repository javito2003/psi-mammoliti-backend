import { ProfessionalAvailabilityEntity } from 'src/modules/professionals/domain/entities/professional-availability.entity';
import { AvailabilityBlockHours } from '../constants/availability-block.constants';

export const isValidAppointment = (
  startAt: Date,
  availability: ProfessionalAvailabilityEntity[],
): boolean => {
  const now = new Date();

  if (startAt <= now) {
    return false;
  }

  const todayBlocks = availability.filter(
    (block) => block.dayOfWeek === startAt.getDay(),
  );
  if (!todayBlocks.length) {
    return false;
  }

  const actualHour = startAt.getHours();

  const available = todayBlocks.some((block) => {
    const hourByBlock = AvailabilityBlockHours[block.block];
    return actualHour >= hourByBlock.start && actualHour < hourByBlock.end;
  });

  return available;
};
