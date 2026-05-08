import { CreateTrackData, TrackItem, TrackRepository } from '../../domain/track/TrackRepository';

export class CreateTrackUseCase {
  constructor(private readonly trackRepository: TrackRepository) {}

  async execute(data: CreateTrackData): Promise<TrackItem> {
    return this.trackRepository.create(data);
  }
}