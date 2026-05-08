import { ChallengeItem, ChallengeRepository } from '../../domain/challenge/ChallengeRepository';

export class CancelChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(challengeId: string, userId: string): Promise<ChallengeItem> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new Error('Reto no encontrado');

    const esParticipante = challenge.retadorId === userId || challenge.retadoId === userId;
    if (!esParticipante) throw new Error('No participas en este reto');

    const cancelables = ['PENDIENTE', 'ACEPTADO'];
    if (!cancelables.includes(challenge.estado)) {
      throw new Error('El reto no puede cancelarse en su estado actual');
    }

    return this.challengeRepository.updateEstado(challengeId, 'CANCELADO');
  }
}