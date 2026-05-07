import { ProfileRepository, PublicProfile } from '../../domain/profile/ProfileRepository';

export class GetPublicProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(userId: string): Promise<PublicProfile> {
    const profile = await this.profileRepository.findPublicProfileById(userId);
    if (!profile) throw new Error('Perfil público no encontrado');
    return profile;
  }
}
