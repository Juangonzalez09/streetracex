import { ChallengeItem, ChallengeRepository } from '../../domain/challenge/ChallengeRepository';

export class StartChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(challengeId: string, userId: string): Promise<ChallengeItem> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new Error('Reto no encontrado');
    if (challenge.retadorId !== userId) throw new Error('Solo el retador puede iniciar el reto');
    if (challenge.estado !== 'ACEPTADO') throw new Error('El reto debe estar ACEPTADO para iniciarse');

    return this.challengeRepository.updateEstado(challengeId, 'EN_CURSO');
  }
}