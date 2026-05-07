import { MyProfile, ProfileRepository } from '../../domain/profile/ProfileRepository';

export class GetMyProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(userId: string): Promise<MyProfile> {
    const profile = await this.profileRepository.findMyProfileById(userId);
    if (!profile) throw new Error('Usuario no encontrado');
    return profile;
  }
}
