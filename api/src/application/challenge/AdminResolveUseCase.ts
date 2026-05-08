import { ChallengeItem, ChallengeRepository } from '../../domain/challenge/ChallengeRepository';
import { ProfileRepository } from '../../domain/profile/ProfileRepository';
import { NotificationRepository } from '../../domain/notification/NotificationRepository';

export class AdminResolveUseCase {
  constructor(
    private readonly challengeRepository: ChallengeRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(challengeId: string, ganadorId: string): Promise<ChallengeItem> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new Error('Reto no encontrado');
    if (challenge.estado !== 'EN_CURSO') throw new Error('El reto debe estar EN_CURSO para ser resuelto');

    const ganadorValido = ganadorId === challenge.retadorId || ganadorId === challenge.retadoId;
    if (!ganadorValido) throw new Error('El ganador debe ser uno de los participantes');

    const finalChallenge = await this.challengeRepository.completeChallenge(challengeId, ganadorId);
    const perdedorId = ganadorId === challenge.retadorId ? challenge.retadoId : challenge.retadorId;

    const [resultadoGanador] = await Promise.all([
      this.profileRepository.updateStatsAfterChallenge(ganadorId, true),
      this.profileRepository.updateStatsAfterChallenge(perdedorId, false),
    ]);

    const ganadorUsername =
      ganadorId === challenge.retadorId ? challenge.retador.username : challenge.retado.username;
    const perdedorUsername =
      perdedorId === challenge.retadorId ? challenge.retador.username : challenge.retado.username;

    await Promise.all([
      this.notificationRepository.create({
        userId: ganadorId,
        tipo: 'RESULTADO',
        mensaje: `El administrador resolvió el reto: ganaste contra ${perdedorUsername}`,
        referenciaId: challengeId,
      }),
      this.notificationRepository.create({
        userId: perdedorId,
        tipo: 'RESULTADO',
        mensaje: `El administrador resolvió el reto: perdiste contra ${ganadorUsername}`,
        referenciaId: challengeId,
      }),
    ]);

    if (resultadoGanador.rangoSubido) {
      await this.notificationRepository.create({
        userId: ganadorId,
        tipo: 'RANGO_SUBIDO',
        mensaje: `¡Subiste al rango ${resultadoGanador.nuevoRango}!`,
        referenciaId: challengeId,
      });
    }

    return finalChallenge;
  }
}