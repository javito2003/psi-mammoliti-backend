import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../../modules/users/domain/entities/user.entity';
import { UserCreator } from '../../modules/users/domain/services/user-creator.service';
import { UserAlreadyExistsError } from '../../modules/users/domain/exceptions/user-already-exists.error';
import { ProfessionalEntity } from '../../modules/professionals/domain/entities/professional.entity';
import {
  AvailabilityBlock,
  ProfessionalAvailabilityEntity,
} from '../../modules/professionals/domain/entities/professional-availability.entity';
import {
  PROFESSIONAL_REPOSITORY,
  type ProfessionalRepositoryPort,
} from '../../modules/professionals/domain/ports/professional.repository.port';
import { ThemeEntity } from '../../modules/themes/domain/entities/theme.entity';
import {
  THEME_REPOSITORY,
  type ThemeRepositoryPort,
} from '../../modules/themes/domain/ports/theme.repository.port';

const THEMES = [
  { name: 'Anxiety', slug: 'anxiety' },
  { name: 'Depression', slug: 'depression' },
  { name: 'Relationships', slug: 'relationships' },
  { name: 'Grief', slug: 'grief' },
  { name: 'Trauma', slug: 'trauma' },
  { name: 'Personal Growth', slug: 'personal-growth' },
];

const PROFESSIONALS = [
  {
    firstName: 'Dr. Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    password: 'Password123!',
    bio: 'Specialist in Anxiety and Depression with 10 years experience.',
    price: 80.0,
    timezone: 'UTC-5',
    themes: ['anxiety', 'depression'],
    availability: [
      { dayOfWeek: 1, block: AvailabilityBlock.MORNING }, // Mon Morning
      { dayOfWeek: 1, block: AvailabilityBlock.AFTERNOON }, // Mon Afternoon
      { dayOfWeek: 3, block: AvailabilityBlock.MORNING }, // Wed Morning
      { dayOfWeek: 5, block: AvailabilityBlock.MORNING }, // Fri Morning
    ],
  },
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    password: 'Password123!',
    bio: 'Relationship counselor focusing on communication.',
    price: 100.0,
    timezone: 'UTC+1',
    themes: ['relationships', 'grief'],
    availability: [
      { dayOfWeek: 2, block: AvailabilityBlock.EVENING }, // Tue Evening
      { dayOfWeek: 4, block: AvailabilityBlock.EVENING }, // Thu Evening
      { dayOfWeek: 6, block: AvailabilityBlock.MORNING }, // Sat Morning
    ],
  },
  {
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@example.com',
    password: 'Password123!',
    bio: 'Trauma specialist. Helping you find your strength.',
    price: 120.0,
    timezone: 'UTC-8',
    themes: ['trauma', 'anxiety', 'personal-growth'],
    availability: [
      { dayOfWeek: 1, block: AvailabilityBlock.AFTERNOON }, // Mon Afternoon
      { dayOfWeek: 2, block: AvailabilityBlock.AFTERNOON }, // Tue Afternoon
      { dayOfWeek: 3, block: AvailabilityBlock.AFTERNOON }, // Wed Afternoon
      { dayOfWeek: 4, block: AvailabilityBlock.AFTERNOON }, // Thu Afternoon
      { dayOfWeek: 5, block: AvailabilityBlock.AFTERNOON }, // Fri Afternoon
    ],
  },
];

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly userCreator: UserCreator,
    @Inject(THEME_REPOSITORY)
    private readonly themeRepo: ThemeRepositoryPort,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepo: ProfessionalRepositoryPort,
  ) {}

  async seed() {
    this.logger.log('Starting Seeder...');

    // 1. Seed Themes
    const savedThemes: Record<string, ThemeEntity> = {};
    const existingThemes = await this.themeRepo.findAll();
    const existingSlugs = new Set(existingThemes.map((t) => t.slug));

    for (const themeData of THEMES) {
      if (!existingSlugs.has(themeData.slug)) {
        const theme: ThemeEntity = {
          id: uuidv4(),
          name: themeData.name,
          slug: themeData.slug,
        };

        const saved = await this.themeRepo.save(theme);
        savedThemes[saved.slug] = saved;
        this.logger.log(`Created Theme: ${saved.name}`);
      } else {
        const existing = existingThemes.find((t) => t.slug === themeData.slug);
        if (existing) savedThemes[existing.slug] = existing;
        this.logger.log(`Existing Theme: ${themeData.name}`);
      }
    }

    // 2. Seed Professionals
    for (const pData of PROFESSIONALS) {
      // Check if professional user exists (implicitly handled by UserCreator checking email, but we catch conflict)
      try {
        // Create User
        let user: UserEntity;
        try {
          user = await this.userCreator.execute(
            pData.firstName,
            pData.lastName,
            pData.email,
            pData.password,
          );
          this.logger.log(`Created User: ${user.email}`);
        } catch (e) {
          if (e instanceof UserAlreadyExistsError) {
            this.logger.log(`User already exists: ${pData.email}, skipping.`);
            continue;
          }
          throw e;
        }

        // Create Professional Profile
        const themes = pData.themes
          .map((slug) => savedThemes[slug])
          .filter((t) => !!t);

        const availability = pData.availability.map(
          (a) =>
            new ProfessionalAvailabilityEntity({
              id: uuidv4(),
              dayOfWeek: a.dayOfWeek,
              block: a.block,
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
        );

        const professional = new ProfessionalEntity({
          id: uuidv4(),
          userId: user.id,
          bio: pData.bio,
          price: pData.price,
          timezone: pData.timezone,
          themes: themes,
          availability: availability,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await this.professionalRepo.save(professional);
        this.logger.log(`Created Professional Profile for: ${user.email}`);
      } catch (error) {
        this.logger.error(`Error seeding professional ${pData.email}`, error);
      }
    }

    this.logger.log('Seeding Complete.');
  }
}
