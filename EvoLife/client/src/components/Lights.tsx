export default function Lights() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light (sun) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Secondary fill light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#4a90e2"
      />
    </>
  );
}
