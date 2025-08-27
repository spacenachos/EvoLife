import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulation } from "../lib/stores/useSimulation";

export default function Creatures() {
  const { creatures } = useSimulation();
  const groupRef = useRef<THREE.Group>(null);

  const aliveCreatures = useMemo(() => 
    creatures.filter(c => c.state !== 'dead'), 
    [creatures]
  );

  // Animate creatures slightly for visual appeal
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.position.y = Math.sin(time * 2 + index) * 0.05 + child.userData.baseY;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {aliveCreatures.map((creature) => {
        const isPredator = creature.type === 'predator';
        const size = creature.traits.size;
        const energyRatio = creature.currentEnergy / creature.traits.energy;
        
        // Color based on type and energy
        const baseColor = isPredator ? "#dc2626" : "#2563eb"; // Red for predators, blue for prey
        const color = new THREE.Color(baseColor).lerp(
          new THREE.Color("#404040"), 
          Math.max(0, 1 - energyRatio)
        );

        // State-based visual indicators
        let emissiveColor = "#000000";
        let emissiveIntensity = 0;
        
        if (creature.state === 'hunting') {
          emissiveColor = "#ff4444";
          emissiveIntensity = 0.3;
        } else if (creature.state === 'fleeing') {
          emissiveColor = "#ffff44";
          emissiveIntensity = 0.2;
        } else if (creature.state === 'reproducing') {
          emissiveColor = "#ff44ff";
          emissiveIntensity = 0.4;
        } else if (creature.state === 'eating') {
          emissiveColor = "#44ff44";
          emissiveIntensity = 0.2;
        }

        return (
          <group key={creature.id} position={creature.position}>
            {/* Main body */}
            <mesh 
              castShadow 
              receiveShadow
              userData={{ baseY: size / 2 }}
            >
              <boxGeometry args={[size, size * 0.8, size * 1.2]} />
              <meshLambertMaterial 
                color={color}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>

            {/* Direction indicator (head) */}
            <mesh 
              position={[0, size * 0.2, size * 0.7]} 
              castShadow
            >
              <sphereGeometry args={[size * 0.3, 8, 6]} />
              <meshLambertMaterial 
                color={color.clone().multiplyScalar(1.2)}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity * 0.5}
              />
            </mesh>

            {/* Energy indicator bar */}
            <group position={[0, size + 0.5, 0]}>
              {/* Background bar */}
              <mesh>
                <boxGeometry args={[1, 0.1, 0.02]} />
                <meshBasicMaterial color="#333333" />
              </mesh>
              {/* Energy bar */}
              <mesh position={[(-0.5 + energyRatio / 2), 0, 0.01]} scale={[energyRatio, 1, 1]}>
                <boxGeometry args={[1, 0.1, 0.02]} />
                <meshBasicMaterial color={energyRatio > 0.5 ? "#4ade80" : energyRatio > 0.2 ? "#fbbf24" : "#ef4444"} />
              </mesh>
            </group>

            {/* Generation indicator */}
            {creature.generation > 1 && (
              <mesh position={[0, size + 0.8, 0]}>
                <ringGeometry args={[0.1, 0.2, 8]} />
                <meshBasicMaterial color="#fbbf24" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
