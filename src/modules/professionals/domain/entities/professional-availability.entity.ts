export enum AvailabilityBlock {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}

export interface ProfessionalAvailabilityEntity {
  id: string;
  professionalId: string;
  dayOfWeek: number; // 0-6
  block: AvailabilityBlock;
  createdAt: Date;
  updatedAt: Date;
}
