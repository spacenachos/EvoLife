import * as THREE from "three";

export interface CreatureTraits {
  speed: number;
  size: number;
  energy: number;
  aggressiveness: number;
  fearLevel: number;
  hungerThreshold: number;
  reproductionThreshold: number;
}

export interface Creature {
  id: string;
  type: 'predator' | 'prey';
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  traits: CreatureTraits;
  currentEnergy: number;
  age: number;
  generation: number;
  reproduced: boolean;
  target?: THREE.Vector3;
  state: 'wandering' | 'hunting' | 'fleeing' | 'eating' | 'reproducing' | 'dead';
  lastReproduction: number;
}

export interface Food {
  id: string;
  position: THREE.Vector3;
  energy: number;
  consumed: boolean;
}

export interface SimulationStats {
  totalTime: number;
  generation: number;
  populations: {
    predators: number;
    prey: number;
    food: number;
  };
  averageTraits: {
    predator: CreatureTraits;
    prey: CreatureTraits;
  };
  rates: {
    birthRate: number;
    deathRate: number;
    foodConsumption: number;
  };
  history: {
    time: number;
    predatorCount: number;
    preyCount: number;
    avgPredatorSpeed: number;
    avgPreySpeed: number;
    avgPredatorSize: number;
    avgPreySize: number;
  }[];
}

export interface SimulationConfig {
  worldSize: number;
  maxPredators: number;
  maxPrey: number;
  maxFood: number;
  foodSpawnRate: number;
  mutationRate: number;
  reproductionCooldown: number;
  energyDecayRate: number;
}
