import { ChallengeItem, ChallengeRepository } from '../../domain/challenge/ChallengeRepository';
import { NotificationRepository } from '../../domain/notification/NotificationRepository';
import { VehicleRepository } from '../../domain/vehicle/VehicleRepository';

export class AcceptChallengeUseCase {
  constructor(
    private readonly challengeRepository: ChallengeRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(challengeId: string, userId: string): Promise<ChallengeItem> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new Error('Reto no encontrado');
    if (challenge.retadoId !== userId) throw new Error('Solo el retado puede aceptar el reto');
    if (challenge.estado !== 'PENDIENTE') throw new Error('El reto no está en estado PENDIENTE');

    const vehiculoRetado = await this.vehicleRepository.findActiveByUserId(userId);
    if (!vehiculoRetado) throw new Error('Necesitas un vehículo activo para aceptar el reto');

    const updated = await this.challengeRepository.acceptChallenge(challengeId, vehiculoRetado.id);

    await this.notificationRepository.create({
      userId: challenge.retadorId,
      tipo: 'RETO_ACEPTADO',
      mensaje: `${challenge.retado.username} aceptó tu reto`,
      referenciaId: challengeId,
    });

    return updated;
  }
}