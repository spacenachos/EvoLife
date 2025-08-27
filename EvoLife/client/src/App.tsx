import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";

// Import simulation components
import Environment from "./components/Environment";
import Creatures from "./components/Creature";
import Food from "./components/Food";
import Lights from "./components/Lights";
import Camera from "./components/Camera";
import Statistics from "./components/Statistics";
import SimulationControls from "./components/SimulationControls";
import NodeEditor from "./components/NodeEditor";
import { useSimulation } from "./lib/stores/useSimulation";

// Camera control keys
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
  { name: "up", keys: ["KeyQ"] },
  { name: "down", keys: ["KeyE"] },
];

function SimulationLoop() {
  const update = useSimulation(state => state.update);
  
  useEffect(() => {
    let lastTime = performance.now();
    let animationId: number;
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      
      // Cap delta time to prevent large jumps
      const cappedDelta = Math.min(deltaTime, 1/30); // Max 30fps minimum
      
      update(cappedDelta);
      animationId = requestAnimationFrame(gameLoop);
    };
    
    animationId = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [update]);
  
  return null;
}

function App() {
  const initializePopulation = useSimulation(state => state.initializePopulation);

  // Initialize the simulation on mount
  useEffect(() => {
    initializePopulation();
  }, [initializePopulation]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KeyboardControls map={controls}>
        <Canvas
          shadows
          camera={{
            position: [0, 20, 25],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "default"
          }}
        >
          <color attach="background" args={["#87ceeb"]} />
          
          {/* Lighting */}
          <Lights />
          
          <Suspense fallback={null}>
            {/* Environment */}
            <Environment />
            
            {/* Simulation entities */}
            <Creatures />
            <Food />
            
            {/* Camera controls */}
            <Camera />
          </Suspense>
        </Canvas>
        
        {/* UI Overlays */}
        <Statistics />
        <SimulationControls />
        <NodeEditor />
        
        {/* Simulation update loop */}
        <SimulationLoop />
      </KeyboardControls>
    </div>
  );
}

export default App;
