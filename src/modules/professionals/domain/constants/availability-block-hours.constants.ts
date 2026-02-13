import { AvailabilityBlock } from '../entities/professional-availability.entity';

export const AvailabilityBlockHours = {
  [AvailabilityBlock.MORNING]: { start: 8, end: 12 },
  [AvailabilityBlock.AFTERNOON]: { start: 13, end: 17 },
  [AvailabilityBlock.EVENING]: { start: 18, end: 22 },
};
