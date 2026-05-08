import { ChallengeItem, ChallengeRepository } from '../../domain/challenge/ChallengeRepository';
import { ProfileRepository } from '../../domain/profile/ProfileRepository';
import { NotificationRepository } from '../../domain/notification/NotificationRepository';

export interface ReportResultOutput {
  challenge: ChallengeItem;
  completado: boolean;
  disputa: boolean;
  rangoSubidoGanador: boolean;
}

export class ReportResultUseCase {
  constructor(
    private readonly challengeRepository: ChallengeRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(challengeId: string, userId: string, ganadorId: string): Promise<ReportResultOutput> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new Error('Reto no encontrado');
    if (challenge.estado !== 'EN_CURSO') throw new Error('El reto debe estar EN_CURSO para reportar un resultado');

    const esRetador = challenge.retadorId === userId;
    const esRetado = challenge.retadoId === userId;
    if (!esRetador && !esRetado) throw new Error('No participas en este reto');

    const ganadorValido = ganadorId === challenge.retadorId || ganadorId === challenge.retadoId;
    if (!ganadorValido) throw new Error('El ganador declarado debe ser uno de los participantes');

    if (esRetador && challenge.reporteRetadorId !== null) {
      throw new Error('Ya reportaste el resultado de este reto');
    }
    if (esRetado && challenge.reporteRetadoId !== null) {
      throw new Error('Ya reportaste el resultado de este reto');
    }

    const updated = esRetador
      ? await this.challengeRepository.reportarResultadoRetador(challengeId, ganadorId)
      : await this.challengeRepository.reportarResultadoRetado(challengeId, ganadorId);

    const ambosReportaron = updated.reporteRetadorId !== null && updated.reporteRetadoId !== null;
    const hayAcuerdo = ambosReportaron && updated.reporteRetadorId === updated.reporteRetadoId;

    if (!hayAcuerdo) {
      const disputa = ambosReportaron && !hayAcuerdo;
      return { challenge: updated, completado: false, disputa, rangoSubidoGanador: false };
    }

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
        mensaje: `Ganaste el reto contra ${perdedorUsername}`,
        referenciaId: challengeId,
      }),
      this.notificationRepository.create({
        userId: perdedorId,
        tipo: 'RESULTADO',
        mensaje: `Perdiste el reto contra ${ganadorUsername}`,
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

    return { challenge: finalChallenge, completado: true, disputa: false, rangoSubidoGanador: resultadoGanador.rangoSubido };
  }
}