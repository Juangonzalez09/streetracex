import { TrackItem, TrackRepository } from '../../domain/track/TrackRepository';

export class GetTrackUseCase {
  constructor(private readonly trackRepository: TrackRepository) {}

  async execute(id: string): Promise<TrackItem> {
    const track = await this.trackRepository.findById(id);
    if (!track) throw new Error('Pista no encontrada');
    return track;
  }
}