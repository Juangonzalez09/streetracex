import { ChallengeItem, ChallengeRepository } from '../../domain/challenge/ChallengeRepository';

export interface AdminListChallengesInput {
  estado?: string;
  soloDisputas?: boolean;
}

export class AdminListChallengesUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(input: AdminListChallengesInput): Promise<ChallengeItem[]> {
    return this.challengeRepository.findAllChallenges({
      estado: input.estado as ChallengeItem['estado'] | undefined,
      soloDisputas: input.soloDisputas,
    });
  }
}