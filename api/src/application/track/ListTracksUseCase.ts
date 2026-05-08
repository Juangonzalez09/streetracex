import { TrackFilters, TrackItem, TrackRepository, TipoCarreraTrack } from '../../domain/track/TrackRepository';

export interface ListTracksInput {
  tipoCarrera?: TipoCarreraTrack;
  soloActivas?: boolean;
}

export class ListTracksUseCase {
  constructor(private readonly trackRepository: TrackRepository) {}

  async execute(input: ListTracksInput = {}): Promise<TrackItem[]> {
    const filters: TrackFilters = {
      tipoCarrera: input.tipoCarrera,
      soloActivas: input.soloActivas ?? true,
    };
    return this.trackRepository.findAll(filters);
  }
}