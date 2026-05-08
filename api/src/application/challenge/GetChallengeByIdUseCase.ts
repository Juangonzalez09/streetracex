import { ChallengeItem, ChallengeRepository } from '../../domain/challenge/ChallengeRepository';

export class GetChallengeByIdUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(challengeId: string, userId: string): Promise<ChallengeItem> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new Error('Reto no encontrado');
    if (challenge.retadorId !== userId && challenge.retadoId !== userId) {
      throw new Error('No participas en este reto');
    }
    return challenge;
  }
}