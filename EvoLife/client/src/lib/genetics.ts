import { CreatureTraits } from './types';

export class GeneticSystem {
  private mutationRate: number;

  constructor(mutationRate = 0.1) {
    this.mutationRate = mutationRate;
  }

  // Generate random traits for initial population
  generateRandomTraits(type: 'predator' | 'prey'): CreatureTraits {
    if (type === 'predator') {
      return {
        speed: 0.8 + Math.random() * 0.4, // 0.8-1.2
        size: 1.2 + Math.random() * 0.6, // 1.2-1.8
        energy: 200 + Math.random() * 100, // 200-300 (much higher starting energy)
        aggressiveness: 0.7 + Math.random() * 0.3, // 0.7-1.0
        fearLevel: 0.1 + Math.random() * 0.3, // 0.1-0.4
        hungerThreshold: 50 + Math.random() * 30, // 50-80
        reproductionThreshold: 150 + Math.random() * 50, // 150-200
      };
    } else {
      return {
        speed: 1.0 + Math.random() * 0.5, // 1.0-1.5
        size: 0.8 + Math.random() * 0.4, // 0.8-1.2
        energy: 150 + Math.random() * 100, // 150-250 (much higher starting energy)
        aggressiveness: 0.1 + Math.random() * 0.2, // 0.1-0.3
        fearLevel: 0.6 + Math.random() * 0.4, // 0.6-1.0
        hungerThreshold: 40 + Math.random() * 20, // 40-60
        reproductionThreshold: 120 + Math.random() * 30, // 120-150
      };
    }
  }

  // Crossover two parents to create offspring
  crossover(parent1: CreatureTraits, parent2: CreatureTraits): CreatureTraits {
    return {
      speed: Math.random() > 0.5 ? parent1.speed : parent2.speed,
      size: Math.random() > 0.5 ? parent1.size : parent2.size,
      energy: Math.random() > 0.5 ? parent1.energy : parent2.energy,
      aggressiveness: Math.random() > 0.5 ? parent1.aggressiveness : parent2.aggressiveness,
      fearLevel: Math.random() > 0.5 ? parent1.fearLevel : parent2.fearLevel,
      hungerThreshold: Math.random() > 0.5 ? parent1.hungerThreshold : parent2.hungerThreshold,
      reproductionThreshold: Math.random() > 0.5 ? parent1.reproductionThreshold : parent2.reproductionThreshold,
    };
  }

  // Apply mutations to traits
  mutate(traits: CreatureTraits): CreatureTraits {
    const mutated = { ...traits };
    
    if (Math.random() < this.mutationRate) {
      mutated.speed *= 0.9 + Math.random() * 0.2; // ±10% variation
    }
    if (Math.random() < this.mutationRate) {
      mutated.size *= 0.9 + Math.random() * 0.2;
    }
    if (Math.random() < this.mutationRate) {
      mutated.energy *= 0.9 + Math.random() * 0.2;
    }
    if (Math.random() < this.mutationRate) {
      mutated.aggressiveness = Math.max(0, Math.min(1, mutated.aggressiveness + (Math.random() - 0.5) * 0.2));
    }
    if (Math.random() < this.mutationRate) {
      mutated.fearLevel = Math.max(0, Math.min(1, mutated.fearLevel + (Math.random() - 0.5) * 0.2));
    }
    if (Math.random() < this.mutationRate) {
      mutated.hungerThreshold *= 0.9 + Math.random() * 0.2;
    }
    if (Math.random() < this.mutationRate) {
      mutated.reproductionThreshold *= 0.9 + Math.random() * 0.2;
    }

    return mutated;
  }

  // Calculate fitness for selection (higher is better)
  calculateFitness(creature: { traits: CreatureTraits; age: number; currentEnergy: number }): number {
    const { traits, age, currentEnergy } = creature;
    
    // Fitness is based on survival time, energy efficiency, and balanced traits
    let fitness = age * 10; // Base survival bonus
    fitness += currentEnergy * 0.5; // Current energy bonus
    fitness += traits.speed * 20; // Speed bonus
    fitness += Math.min(traits.size, 1.5) * 15; // Size bonus (but not too big)
    
    return Math.max(0, fitness);
  }

  // Select parents based on fitness (tournament selection)
  selectParents(population: { traits: CreatureTraits; age: number; currentEnergy: number }[]): [CreatureTraits, CreatureTraits] {
    const tournamentSize = 3;
    
    const selectOne = () => {
      const tournament = [];
      for (let i = 0; i < Math.min(tournamentSize, population.length); i++) {
        const randomIndex = Math.floor(Math.random() * population.length);
        tournament.push(population[randomIndex]);
      }
      
      tournament.sort((a, b) => this.calculateFitness(b) - this.calculateFitness(a));
      return tournament[0].traits;
    };

    return [selectOne(), selectOne()];
  }
}
