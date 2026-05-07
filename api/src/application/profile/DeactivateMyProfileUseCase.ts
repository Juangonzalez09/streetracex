import { ProfileRepository } from '../../domain/profile/ProfileRepository';

export class DeactivateMyProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(userId: string): Promise<void> {
    const deactivated = await this.profileRepository.deactivateProfile(userId);
    if (!deactivated) throw new Error('Usuario no encontrado');
  }
}
