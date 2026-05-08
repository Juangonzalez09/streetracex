import { ChallengeItem, ChallengeRepository } from '../../domain/challenge/ChallengeRepository';
import { NotificationRepository } from '../../domain/notification/NotificationRepository';

export class RejectChallengeUseCase {
  constructor(
    private readonly challengeRepository: ChallengeRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(challengeId: string, userId: string): Promise<ChallengeItem> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new Error('Reto no encontrado');
    if (challenge.retadoId !== userId) throw new Error('Solo el retado puede rechazar el reto');
    if (challenge.estado !== 'PENDIENTE') throw new Error('El reto no está en estado PENDIENTE');

    const updated = await this.challengeRepository.updateEstado(challengeId, 'RECHAZADO');

    await this.notificationRepository.create({
      userId: challenge.retadorId,
      tipo: 'RETO_RECHAZADO',
      mensaje: `${challenge.retado.username} rechazó tu reto`,
      referenciaId: challengeId,
    });

    return updated;
  }
}