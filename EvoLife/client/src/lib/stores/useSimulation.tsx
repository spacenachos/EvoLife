import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";
import { Creature, Food, SimulationStats, SimulationConfig } from '../types';
import { GeneticSystem } from '../genetics';
import { CreatureAI } from '../ai';

interface SimulationState {
  // Core state
  isRunning: boolean;
  speed: number;
  time: number;
  generation: number;
  
  // Simulation entities
  creatures: Creature[];
  food: Food[];
  
  // Systems
  genetics: GeneticSystem;
  ai: CreatureAI;
  
  // Configuration
  config: SimulationConfig;
  
  // Statistics
  stats: SimulationStats;
  
  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  update: (deltaTime: number) => void;
  updateConfig: (newConfig: Partial<SimulationConfig>) => void;
  updateAIParams: (params: { [key: string]: number }) => void;
  
  // Private methods
  initializePopulation: () => void;
  spawnFood: () => void;
  handleReproduction: () => void;
  updateStats: () => void;
  cleanupDead: () => void;
}

const DEFAULT_CONFIG: SimulationConfig = {
  worldSize: 40,
  maxPredators: 15,
  maxPrey: 30,
  maxFood: 50,
  foodSpawnRate: 0.5,
  mutationRate: 0.15,
  reproductionCooldown: 5000,
  energyDecayRate: 0.001,
};

export const useSimulation = create<SimulationState>()(
  subscribeWithSelector((set, get) => {
    const genetics = new GeneticSystem(DEFAULT_CONFIG.mutationRate);
    const ai = new CreatureAI(DEFAULT_CONFIG.worldSize);

    return {
      isRunning: false,
      speed: 1.0,
      time: 0,
      generation: 1,
      creatures: [],
      food: [],
      genetics,
      ai,
      config: DEFAULT_CONFIG,
      stats: {
        totalTime: 0,
        generation: 1,
        populations: { predators: 0, prey: 0, food: 0 },
        averageTraits: {
          predator: genetics.generateRandomTraits('predator'),
          prey: genetics.generateRandomTraits('prey'),
        },
        rates: { birthRate: 0, deathRate: 0, foodConsumption: 0 },
        history: [],
      },

      start: () => {
        const state = get();
        if (state.creatures.length === 0) {
          state.initializePopulation();
        }
        set({ isRunning: true });
      },

      pause: () => set({ isRunning: false }),

      reset: () => {
        set({
          isRunning: false,
          time: 0,
          generation: 1,
          creatures: [],
          food: [],
          stats: {
            totalTime: 0,
            generation: 1,
            populations: { predators: 0, prey: 0, food: 0 },
            averageTraits: {
              predator: genetics.generateRandomTraits('predator'),
              prey: genetics.generateRandomTraits('prey'),
            },
            rates: { birthRate: 0, deathRate: 0, foodConsumption: 0 },
            history: [],
          },
        });
        get().initializePopulation();
      },

      setSpeed: (speed: number) => set({ speed: Math.max(0.1, Math.min(5.0, speed)) }),

      update: (deltaTime: number) => {
        const state = get();
        if (!state.isRunning) return;

        const scaledDelta = deltaTime * state.speed * 1000; // Convert to milliseconds and apply speed

        // Update time
        const newTime = state.time + scaledDelta;

        // Update creatures
        state.creatures.forEach(creature => {
          if (creature.state !== 'dead') {
            state.ai.updateCreature(creature, state.creatures, state.food, scaledDelta);
          }
        });

        // Handle reproduction
        state.handleReproduction();

        // Spawn food more frequently
        if (Math.random() < state.config.foodSpawnRate * deltaTime * 3) {
          state.spawnFood();
        }

        // Clean up dead creatures and consumed food
        state.cleanupDead();

        // Update statistics
        state.updateStats();

        set({ 
          time: newTime,
          creatures: [...state.creatures],
          food: [...state.food],
        });
      },

      initializePopulation: () => {
        const { config, genetics } = get();
        const creatures: Creature[] = [];

        // Create initial predators
        for (let i = 0; i < Math.floor(config.maxPredators / 2); i++) {
          const traits = genetics.generateRandomTraits('predator');
          creatures.push({
            id: `predator-${i}`,
            type: 'predator',
            position: new THREE.Vector3(
              (Math.random() - 0.5) * config.worldSize * 0.8,
              0,
              (Math.random() - 0.5) * config.worldSize * 0.8
            ),
            velocity: new THREE.Vector3(),
            traits,
            currentEnergy: traits.energy, // Start with full energy
            age: 0,
            generation: 1,
            reproduced: false,
            state: 'wandering',
            lastReproduction: 0,
          });
        }

        // Create initial prey
        for (let i = 0; i < Math.floor(config.maxPrey / 2); i++) {
          const traits = genetics.generateRandomTraits('prey');
          creatures.push({
            id: `prey-${i}`,
            type: 'prey',
            position: new THREE.Vector3(
              (Math.random() - 0.5) * config.worldSize * 0.8,
              0,
              (Math.random() - 0.5) * config.worldSize * 0.8
            ),
            velocity: new THREE.Vector3(),
            traits,
            currentEnergy: traits.energy, // Start with full energy
            age: 0,
            generation: 1,
            reproduced: false,
            state: 'wandering',
            lastReproduction: 0,
          });
        }

        // Spawn initial food (more food to sustain creatures)
        const food: Food[] = [];
        for (let i = 0; i < config.maxFood; i++) {
          food.push({
            id: `food-${i}`,
            position: new THREE.Vector3(
              (Math.random() - 0.5) * config.worldSize * 0.9,
              0.2,
              (Math.random() - 0.5) * config.worldSize * 0.9
            ),
            energy: 50 + Math.random() * 30, // Much higher food energy
            consumed: false,
          });
        }

        set({ creatures, food });
      },

      spawnFood: () => {
        const { config, food } = get();
        if (food.filter(f => !f.consumed).length >= config.maxFood) return;

        const newFood: Food = {
          id: `food-${Date.now()}-${Math.random()}`,
          position: new THREE.Vector3(
            (Math.random() - 0.5) * config.worldSize * 0.9,
            0.2,
            (Math.random() - 0.5) * config.worldSize * 0.9
          ),
          energy: 50 + Math.random() * 30, // Much higher food energy
          consumed: false,
        };

        set({ food: [...food, newFood] });
      },

      handleReproduction: () => {
        const { creatures, genetics, time, generation, config } = get();
        const newCreatures: Creature[] = [];

        // Group creatures by type for reproduction
        const predators = creatures.filter(c => c.type === 'predator' && c.state !== 'dead');
        const prey = creatures.filter(c => c.type === 'prey' && c.state !== 'dead');

        // Handle predator reproduction
        const reproducingPredators = predators.filter(c => c.state === 'reproducing');
        for (let i = 0; i < reproducingPredators.length - 1; i += 2) {
          const parent1 = reproducingPredators[i];
          const parent2 = reproducingPredators[i + 1];

          if (predators.length < config.maxPredators) {
            const childTraits = genetics.mutate(genetics.crossover(parent1.traits, parent2.traits));
            
            newCreatures.push({
              id: `predator-${Date.now()}-${Math.random()}`,
              type: 'predator',
              position: parent1.position.clone().add(new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                0,
                (Math.random() - 0.5) * 4
              )),
              velocity: new THREE.Vector3(),
              traits: childTraits,
              currentEnergy: childTraits.energy * 0.7,
              age: 0,
              generation: generation + 1,
              reproduced: false,
              state: 'wandering',
              lastReproduction: time,
            });

            // Mark parents as having reproduced and consume energy
            parent1.reproduced = true;
            parent2.reproduced = true;
            parent1.currentEnergy *= 0.7;
            parent2.currentEnergy *= 0.7;
            parent1.state = 'wandering';
            parent2.state = 'wandering';
          }
        }

        // Handle prey reproduction
        const reproducingPrey = prey.filter(c => c.state === 'reproducing');
        for (let i = 0; i < reproducingPrey.length - 1; i += 2) {
          const parent1 = reproducingPrey[i];
          const parent2 = reproducingPrey[i + 1];

          if (prey.length < config.maxPrey) {
            const childTraits = genetics.mutate(genetics.crossover(parent1.traits, parent2.traits));
            
            newCreatures.push({
              id: `prey-${Date.now()}-${Math.random()}`,
              type: 'prey',
              position: parent1.position.clone().add(new THREE.Vector3(
                (Math.random() - 0.5) * 3,
                0,
                (Math.random() - 0.5) * 3
              )),
              velocity: new THREE.Vector3(),
              traits: childTraits,
              currentEnergy: childTraits.energy * 0.8,
              age: 0,
              generation: generation + 1,
              reproduced: false,
              state: 'wandering',
              lastReproduction: time,
            });

            // Mark parents as having reproduced and consume energy
            parent1.reproduced = true;
            parent2.reproduced = true;
            parent1.currentEnergy *= 0.8;
            parent2.currentEnergy *= 0.8;
            parent1.state = 'wandering';
            parent2.state = 'wandering';
          }
        }

        if (newCreatures.length > 0) {
          set({ 
            creatures: [...creatures, ...newCreatures],
            generation: Math.max(generation, Math.max(...newCreatures.map(c => c.generation)))
          });
        }
      },

      updateStats: () => {
        const { creatures, food, time, generation, stats } = get();
        
        const alivePredators = creatures.filter(c => c.type === 'predator' && c.state !== 'dead');
        const alivePrey = creatures.filter(c => c.type === 'prey' && c.state !== 'dead');
        const availableFood = food.filter(f => !f.consumed);

        // Calculate average traits
        const avgPredatorTraits = alivePredators.length > 0 ? {
          speed: alivePredators.reduce((sum, c) => sum + c.traits.speed, 0) / alivePredators.length,
          size: alivePredators.reduce((sum, c) => sum + c.traits.size, 0) / alivePredators.length,
          energy: alivePredators.reduce((sum, c) => sum + c.traits.energy, 0) / alivePredators.length,
          aggressiveness: alivePredators.reduce((sum, c) => sum + c.traits.aggressiveness, 0) / alivePredators.length,
          fearLevel: alivePredators.reduce((sum, c) => sum + c.traits.fearLevel, 0) / alivePredators.length,
          hungerThreshold: alivePredators.reduce((sum, c) => sum + c.traits.hungerThreshold, 0) / alivePredators.length,
          reproductionThreshold: alivePredators.reduce((sum, c) => sum + c.traits.reproductionThreshold, 0) / alivePredators.length,
        } : stats.averageTraits.predator;

        const avgPreyTraits = alivePrey.length > 0 ? {
          speed: alivePrey.reduce((sum, c) => sum + c.traits.speed, 0) / alivePrey.length,
          size: alivePrey.reduce((sum, c) => sum + c.traits.size, 0) / alivePrey.length,
          energy: alivePrey.reduce((sum, c) => sum + c.traits.energy, 0) / alivePrey.length,
          aggressiveness: alivePrey.reduce((sum, c) => sum + c.traits.aggressiveness, 0) / alivePrey.length,
          fearLevel: alivePrey.reduce((sum, c) => sum + c.traits.fearLevel, 0) / alivePrey.length,
          hungerThreshold: alivePrey.reduce((sum, c) => sum + c.traits.hungerThreshold, 0) / alivePrey.length,
          reproductionThreshold: alivePrey.reduce((sum, c) => sum + c.traits.reproductionThreshold, 0) / alivePrey.length,
        } : stats.averageTraits.prey;

        // Update history every 2 seconds
        const newHistory = [...stats.history];
        if (newHistory.length === 0 || time - newHistory[newHistory.length - 1].time > 2000) {
          newHistory.push({
            time: time / 1000, // Convert to seconds
            predatorCount: alivePredators.length,
            preyCount: alivePrey.length,
            avgPredatorSpeed: avgPredatorTraits.speed,
            avgPreySpeed: avgPreyTraits.speed,
            avgPredatorSize: avgPredatorTraits.size,
            avgPreySize: avgPreyTraits.size,
          });

          // Keep only last 100 data points
          if (newHistory.length > 100) {
            newHistory.shift();
          }
        }

        const newStats: SimulationStats = {
          totalTime: time / 1000, // Convert to seconds
          generation,
          populations: {
            predators: alivePredators.length,
            prey: alivePrey.length,
            food: availableFood.length,
          },
          averageTraits: {
            predator: avgPredatorTraits,
            prey: avgPreyTraits,
          },
          rates: {
            birthRate: 0, // Could calculate based on recent births
            deathRate: 0, // Could calculate based on recent deaths
            foodConsumption: 0, // Could calculate based on recent food consumption
          },
          history: newHistory,
        };

        set({ stats: newStats });
      },

      cleanupDead: () => {
        const { creatures, food } = get();
        
        const aliveCreatures = creatures.filter(c => c.state !== 'dead');
        const availableFood = food.filter(f => !f.consumed);

        // Reset reproduction flag after some time
        aliveCreatures.forEach(creature => {
          if (creature.reproduced && creature.age > 3000) { // 3 seconds cooldown
            creature.reproduced = false;
          }
        });

        set({ 
          creatures: aliveCreatures,
          food: availableFood,
        });
      },

      updateConfig: (newConfig: Partial<SimulationConfig>) => {
        set({ config: { ...get().config, ...newConfig } });
      },

      updateAIParams: (params: { [key: string]: number }) => {
        const { ai } = get();
        // Store AI parameters that can be accessed during updates
        (ai as any).dynamicParams = { ...(ai as any).dynamicParams, ...params };
      },
    };
  })
);
