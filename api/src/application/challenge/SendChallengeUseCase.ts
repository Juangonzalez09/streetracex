import { ChallengeItem, ChallengeRepository, TipoCarrera } from '../../domain/challenge/ChallengeRepository';
import { UserRepository } from '../../domain/auth/UserRepository';
import { VehicleRepository } from '../../domain/vehicle/VehicleRepository';
import { NotificationRepository } from '../../domain/notification/NotificationRepository';

export interface SendChallengeInput {
  retadorId: string;
  retadoId: string;
  tipoCarrera: TipoCarrera;
  notas?: string | null;
  fechaAcordada?: Date | null;
}

export class SendChallengeUseCase {
  constructor(
    private readonly challengeRepository: ChallengeRepository,
    private readonly userRepository: UserRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(input: SendChallengeInput): Promise<ChallengeItem> {
    const { retadorId, retadoId, tipoCarrera, notas, fechaAcordada } = input;

    if (retadorId === retadoId) {
      throw new Error('No puedes retarte a ti mismo');
    }

    const [retador, retado, vehiculoRetador] = await Promise.all([
      this.userRepository.findById(retadorId),
      this.userRepository.findById(retadoId),
      this.vehicleRepository.findActiveByUserId(retadorId),
    ]);

    if (!retador) throw new Error('Retador no encontrado');
    if (!vehiculoRetador) throw new Error('Necesitas un vehículo activo para enviar un reto');
    if (!retado || retado.estado !== 'ACTIVO') throw new Error('El piloto retado no existe o no está activo');
    if (retado.rango !== retador.rango) throw new Error('Solo puedes retar a pilotos del mismo rango');

    const vehiculoRetado = await this.vehicleRepository.findActiveByUserId(retadoId);
    if (!vehiculoRetado) throw new Error('El piloto retado no tiene un vehículo activo');
    if (vehiculoRetado.tipoVehiculo !== vehiculoRetador.tipoVehiculo) {
      throw new Error('El piloto retado no tiene un vehículo activo del mismo tipo');
    }

    const hayRetoActivo = await this.challengeRepository.hasActiveChallengeBetween(retadorId, retadoId);
    if (hayRetoActivo) throw new Error('Ya existe un reto activo entre estos pilotos');

    const challenge = await this.challengeRepository.create({
      retadorId,
      retadoId,
      tipoCarrera,
      vehiculoRetadorId: vehiculoRetador.id,
      notas,
      fechaAcordada,
    });

    await this.notificationRepository.create({
      userId: retadoId,
      tipo: 'RETO_RECIBIDO',
      mensaje: `${retador.username} te ha enviado un reto de ${tipoCarrera.replace('_', ' ')}`,
      referenciaId: challenge.id,
    });

    return challenge;
  }
}
