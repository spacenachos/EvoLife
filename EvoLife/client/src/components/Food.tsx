import { useMemo } from "react";
import { useSimulation } from "../lib/stores/useSimulation";

export default function Food() {
  const { food } = useSimulation();
  
  const availableFood = useMemo(() => 
    food.filter(f => !f.consumed), 
    [food]
  );

  return (
    <group>
      {availableFood.map((foodItem) => (
        <mesh
          key={foodItem.id}
          position={foodItem.position}
          castShadow
        >
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshLambertMaterial color="#4ade80" />
        </mesh>
      ))}
    </group>
  );
}
