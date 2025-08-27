import * as THREE from "three";
import { Creature, Food } from './types';

export class CreatureAI {
  private worldSize: number;

  constructor(worldSize: number) {
    this.worldSize = worldSize;
  }

  // Update creature AI behavior
  updateCreature(
    creature: Creature,
    allCreatures: Creature[],
    food: Food[],
    deltaTime: number
  ): void {
    // Decay energy over time (very slow rate)
    creature.currentEnergy -= 0.01 * deltaTime; // Very minimal energy decay
    creature.age += deltaTime;

    // Die if energy is too low
    if (creature.currentEnergy <= 0) {
      creature.state = 'dead';
      return;
    }

    // Determine behavior based on creature type and state
    if (creature.type === 'predator') {
      this.updatePredator(creature, allCreatures, deltaTime);
    } else {
      this.updatePrey(creature, allCreatures, food, deltaTime);
    }

    // Apply movement
    this.applyMovement(creature, deltaTime);

    // Keep creature in bounds
    this.keepInBounds(creature);
  }

  private updatePredator(creature: Creature, allCreatures: Creature[], deltaTime: number): void {
    const nearbyPrey = allCreatures.filter(c => 
      c.type === 'prey' && 
      c.state !== 'dead' && 
      c.position.distanceTo(creature.position) < 15
    );

    // Check if ready to reproduce
    if (creature.currentEnergy > creature.traits.reproductionThreshold && !creature.reproduced) {
      const mate = allCreatures.find(c => 
        c.type === 'predator' && 
        c.id !== creature.id && 
        c.state !== 'dead' && 
        c.currentEnergy > c.traits.reproductionThreshold &&
        !c.reproduced &&
        c.position.distanceTo(creature.position) < 5
      );

      if (mate) {
        creature.state = 'reproducing';
        return;
      }
    }

    // Hunt if hungry or aggressive
    if (nearbyPrey.length > 0 && (creature.currentEnergy < creature.traits.hungerThreshold || Math.random() < creature.traits.aggressiveness * 0.1)) {
      creature.state = 'hunting';
      
      // Find closest prey
      let closestPrey = nearbyPrey[0];
      let closestDistance = creature.position.distanceTo(closestPrey.position);
      
      for (const prey of nearbyPrey) {
        const distance = creature.position.distanceTo(prey.position);
        if (distance < closestDistance) {
          closestPrey = prey;
          closestDistance = distance;
        }
      }

      // Move towards prey
      const direction = new THREE.Vector3()
        .subVectors(closestPrey.position, creature.position)
        .normalize();
      
      creature.velocity.copy(direction.multiplyScalar(creature.traits.speed));

      // Attack if close enough
      if (closestDistance < creature.traits.size) {
        creature.currentEnergy += closestPrey.currentEnergy * 0.7; // Gain energy from prey
        closestPrey.state = 'dead';
        creature.state = 'wandering';
      }
    } else {
      // Wander randomly with more movement
      creature.state = 'wandering';
      if (Math.random() < 0.05) { // Change direction more frequently
        const randomDirection = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          0,
          (Math.random() - 0.5) * 2
        ).normalize();
        creature.velocity.copy(randomDirection.multiplyScalar(creature.traits.speed * 0.6));
      }
    }
  }

  private updatePrey(creature: Creature, allCreatures: Creature[], food: Food[], deltaTime: number): void {
    const nearbyPredators = allCreatures.filter(c => 
      c.type === 'predator' && 
      c.state !== 'dead' && 
      c.position.distanceTo(creature.position) < 10
    );

    // Check if ready to reproduce
    if (creature.currentEnergy > creature.traits.reproductionThreshold && !creature.reproduced) {
      const mate = allCreatures.find(c => 
        c.type === 'prey' && 
        c.id !== creature.id && 
        c.state !== 'dead' && 
        c.currentEnergy > c.traits.reproductionThreshold &&
        !c.reproduced &&
        c.position.distanceTo(creature.position) < 3
      );

      if (mate) {
        creature.state = 'reproducing';
        return;
      }
    }

    // Flee from predators if they're too close
    if (nearbyPredators.length > 0 && Math.random() < creature.traits.fearLevel) {
      creature.state = 'fleeing';
      
      // Calculate average predator position to flee from
      const predatorCenter = new THREE.Vector3();
      nearbyPredators.forEach(predator => {
        predatorCenter.add(predator.position);
      });
      predatorCenter.divideScalar(nearbyPredators.length);

      // Flee in opposite direction
      const fleeDirection = new THREE.Vector3()
        .subVectors(creature.position, predatorCenter)
        .normalize();
      
      creature.velocity.copy(fleeDirection.multiplyScalar(creature.traits.speed * 1.2));
    } else {
      // Look for food if hungry
      const availableFood = food.filter(f => !f.consumed);
      
      if (availableFood.length > 0 && creature.currentEnergy < creature.traits.hungerThreshold) {
        creature.state = 'eating';
        
        // Find closest food
        let closestFood = availableFood[0];
        let closestDistance = creature.position.distanceTo(closestFood.position);
        
        for (const f of availableFood) {
          const distance = creature.position.distanceTo(f.position);
          if (distance < closestDistance) {
            closestFood = f;
            closestDistance = distance;
          }
        }

        // Move towards food
        const direction = new THREE.Vector3()
          .subVectors(closestFood.position, creature.position)
          .normalize();
        
        creature.velocity.copy(direction.multiplyScalar(creature.traits.speed));

        // Eat if close enough
        if (closestDistance < creature.traits.size + 0.5) {
          creature.currentEnergy += closestFood.energy;
          closestFood.consumed = true;
          creature.state = 'wandering';
        }
      } else {
        // Wander randomly with more movement
        creature.state = 'wandering';
        if (Math.random() < 0.05) { // Change direction more frequently
          const randomDirection = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            0,
            (Math.random() - 0.5) * 2
          ).normalize();
          creature.velocity.copy(randomDirection.multiplyScalar(creature.traits.speed * 0.6));
        }
      }
    }
  }

  private applyMovement(creature: Creature, deltaTime: number): void {
    creature.position.add(
      creature.velocity.clone().multiplyScalar(deltaTime)
    );

    // Apply friction
    creature.velocity.multiplyScalar(0.95);
  }

  private keepInBounds(creature: Creature): void {
    const boundary = this.worldSize / 2 - 2;
    
    if (creature.position.x > boundary) {
      creature.position.x = boundary;
      creature.velocity.x = -Math.abs(creature.velocity.x);
    } else if (creature.position.x < -boundary) {
      creature.position.x = -boundary;
      creature.velocity.x = Math.abs(creature.velocity.x);
    }

    if (creature.position.z > boundary) {
      creature.position.z = boundary;
      creature.velocity.z = -Math.abs(creature.velocity.z);
    } else if (creature.position.z < -boundary) {
      creature.position.z = -boundary;
      creature.velocity.z = Math.abs(creature.velocity.z);
    }

    // Keep creatures on ground
    creature.position.y = creature.traits.size / 2;
  }
}
