import { AvailabilityBlock } from 'src/modules/professionals/domain/entities/professional-availability.entity';

const APPOINTMENT_DURATION_HOURS = 1;
export const WEEK_DAYS = 7;

const AvailabilityBlockTimes = {
  [AvailabilityBlock.MORNING]: { start: '08:00', end: '12:00' },
  [AvailabilityBlock.AFTERNOON]: { start: '13:00', end: '17:00' },
  [AvailabilityBlock.EVENING]: { start: '18:00', end: '22:00' },
};

const AvailabilityBlockHours = {
  [AvailabilityBlock.MORNING]: { start: 8, end: 12 },
  [AvailabilityBlock.AFTERNOON]: { start: 13, end: 17 },
  [AvailabilityBlock.EVENING]: { start: 18, end: 22 },
};

export {
  APPOINTMENT_DURATION_HOURS,
  AvailabilityBlockTimes,
  AvailabilityBlockHours,
};
