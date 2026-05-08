import { TrackItem, TrackRepository, UpdateTrackData } from '../../domain/track/TrackRepository';

export class UpdateTrackUseCase {
  constructor(private readonly trackRepository: TrackRepository) {}

  async execute(id: string, data: UpdateTrackData): Promise<TrackItem> {
    const track = await this.trackRepository.findById(id);
    if (!track) throw new Error('Pista no encontrada');
    return this.trackRepository.update(id, data);
  }
}