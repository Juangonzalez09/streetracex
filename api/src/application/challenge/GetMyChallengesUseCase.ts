import { ChallengeFilters, ChallengeItem, ChallengeRepository } from '../../domain/challenge/ChallengeRepository';

export class GetMyChallengesUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(userId: string, filters: ChallengeFilters): Promise<ChallengeItem[]> {
    return this.challengeRepository.findMyChallenges(userId, filters);
  }
}