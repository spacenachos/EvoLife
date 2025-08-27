import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";

enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
}

export default function Camera() {
  const { camera, gl } = useThree();
  const [, get] = useKeyboardControls<Controls>();
  const cameraSpeed = useRef(0.5);
  const mouseSensitivity = useRef(0.002);
  const isPointerLocked = useRef(false);
  
  // Mouse look variables
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const PI_2 = Math.PI / 2;

  useEffect(() => {
    const canvas = gl.domElement;
    
    const onMouseMove = (event: MouseEvent) => {
      if (!isPointerLocked.current) return;
      
      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;
      
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= movementX * mouseSensitivity.current;
      euler.current.x -= movementY * mouseSensitivity.current;
      euler.current.x = Math.max(-PI_2, Math.min(PI_2, euler.current.x));
      
      camera.quaternion.setFromEuler(euler.current);
    };

    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === canvas;
    };

    const onCanvasClick = () => {
      if (!isPointerLocked.current) {
        canvas.requestPointerLock();
      }
    };

    // Add event listeners
    canvas.addEventListener('click', onCanvasClick);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);

    return () => {
      canvas.removeEventListener('click', onCanvasClick);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
    };
  }, [camera, gl]);

  useFrame(() => {
    const { forward, backward, left, right, up, down } = get();
    
    const moveVector = new THREE.Vector3();
    
    if (forward) moveVector.z -= cameraSpeed.current;
    if (backward) moveVector.z += cameraSpeed.current;
    if (left) moveVector.x -= cameraSpeed.current;
    if (right) moveVector.x += cameraSpeed.current;
    if (up) moveVector.y += cameraSpeed.current;
    if (down) moveVector.y -= cameraSpeed.current;
    
    // Apply movement relative to camera orientation
    moveVector.applyQuaternion(camera.quaternion);
    camera.position.add(moveVector);
    
    // Keep camera above ground
    camera.position.y = Math.max(camera.position.y, 2);
  });

  return null;
}
