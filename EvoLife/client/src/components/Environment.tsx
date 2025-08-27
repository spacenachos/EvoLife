import { useTexture } from "@react-three/drei";
import { useSimulation } from "../lib/stores/useSimulation";

export default function Environment() {
  const grassTexture = useTexture("/textures/grass.png");
  const { config } = useSimulation();
  
  // Configure grass texture
  grassTexture.wrapS = grassTexture.wrapT = 1000; // THREE.RepeatWrapping
  grassTexture.repeat.set(config.worldSize / 4, config.worldSize / 4);

  return (
    <group>
      {/* Ground plane */}
      <mesh 
        position={[0, -0.1, 0]} 
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[config.worldSize, config.worldSize]} />
        <meshLambertMaterial map={grassTexture} />
      </mesh>

      {/* World boundaries (invisible walls) */}
      <group>
        {/* North wall */}
        <mesh position={[0, 2, config.worldSize / 2]} visible={false}>
          <boxGeometry args={[config.worldSize, 4, 1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        
        {/* South wall */}
        <mesh position={[0, 2, -config.worldSize / 2]} visible={false}>
          <boxGeometry args={[config.worldSize, 4, 1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        
        {/* East wall */}
        <mesh position={[config.worldSize / 2, 2, 0]} visible={false}>
          <boxGeometry args={[1, 4, config.worldSize]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        
        {/* West wall */}
        <mesh position={[-config.worldSize / 2, 2, 0]} visible={false}>
          <boxGeometry args={[1, 4, config.worldSize]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </group>
  );
}
