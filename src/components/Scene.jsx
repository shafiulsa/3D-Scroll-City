import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Experience from "./Experience";
import { Environment } from "@react-three/drei";

export default function Scene() {
  return (
    <div className="canvas-container">
      {/* 
        The Canvas covers the full viewport (styled in index.css)
        Camera is instantiated here, but if your GLB includes an animated camera, 
        you might not need these default params.
      */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* Basic lighting to ensure materials are visible */}
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        
        {/* Suspense is required when loading async resources like GLTF models */}
        <Suspense fallback={null}>
          <Experience />
          
          {/* Optional: Adds Image-Based Lighting for nice reflections on PBR materials */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}