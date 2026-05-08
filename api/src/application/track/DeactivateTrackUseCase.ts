import { TrackItem, TrackRepository } from '../../domain/track/TrackRepository';

export class DeactivateTrackUseCase {
  constructor(private readonly trackRepository: TrackRepository) {}

  async execute(id: string): Promise<TrackItem> {
    const track = await this.trackRepository.findById(id);
    if (!track) throw new Error('Pista no encontrada');
    if (!track.activo) throw new Error('La pista ya está desactivada');
    return this.trackRepository.deactivate(id);
  }
}