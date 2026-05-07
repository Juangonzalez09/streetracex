import { MyProfile, ProfileRepository, UpdateProfileInput } from '../../domain/profile/ProfileRepository';

export class UpdateMyProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(userId: string, input: UpdateProfileInput): Promise<MyProfile> {
    if (Object.keys(input).length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    const profile = await this.profileRepository.updateMyProfile(userId, input);
    if (!profile) throw new Error('Usuario no encontrado');
    return profile;
  }
}
