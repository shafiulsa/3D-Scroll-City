import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const group = useRef();
  
  // Load the GLB file. Extract cameras along with scene and animations.
  const { scene, animations, cameras } = useGLTF('/models/Final_city_backed.glb');
  
  // Get the 'set' function and 'size' to change active camera and update aspect ratio
  const set = useThree((state) => state.set);
  const size = useThree((state) => state.size);
  
  // Extract animations and the mixer using drei's helper
  const { actions } = useAnimations(animations, group);
  
  // Proxy for GSAP to animate
  const scrollData = useRef({ time: 0 });

  // Set the GLB camera as the active camera
  useEffect(() => {
    if (cameras && cameras.length > 0) {
      const cam = cameras[0];
      cam.aspect = size.width / size.height;
      cam.updateProjectionMatrix();
      set({ camera: cam });
    }
  }, [cameras, set, size]);

  useEffect(() => {
    // Ensure we have animations to play
    if (!animations || animations.length === 0) {
      return;
    }

    let maxDuration = 0;
    
    // Play ALL actions and explicitly PAUSE them so they don't auto-play
    Object.values(actions).forEach((action) => {
      action.play();
      action.paused = true; // <--- This stops the "fast forward" at the beginning
      const duration = action.getClip().duration;
      if (duration > maxDuration) {
        maxDuration = duration;
      }
    });
    
    // Create a GSAP context to safely handle React Strict Mode
    let ctx = gsap.context(() => {
      
      const triggerEl = document.querySelector('.scroll-wrapper');
      if (!triggerEl) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2.5 // Increased scrub lag for smoother camera progression
        }
      });

      // Animate our proxy object's time
      tl.to(scrollData.current, {
        time: maxDuration,
        ease: 'none',
      });
      
      // Refresh ScrollTrigger in case DOM wasn't fully ready
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

    });

    return () => {
      // Revert the GSAP context to clean up perfectly on unmount
      ctx.revert();
    };
  }, [actions, animations]);

  // Manually update the action time and apply mouse movement camera parallax
  useFrame((state) => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        action.time = scrollData.current.time;
      });
    }

    // Apply interactive camera tilt on mouse movement
    if (cameras && cameras.length > 0) {
      const cam = cameras[0];
      
      // Subtle tilt limits (in radians)
      const targetOffsetX = -state.pointer.y * 0.06; // Pitch (Up/Down)
      const targetOffsetY = -state.pointer.x * 0.06; // Yaw (Left/Right)
      
      // Initialize lerp cache if not present
      if (!cam.userData.mouseOffset) {
        cam.userData.mouseOffset = { x: 0, y: 0 };
      }
      
      // Lerp mouse coordinates for a smooth lag/inertia effect
      cam.userData.mouseOffset.x = gsap.utils.interpolate(
        cam.userData.mouseOffset.x,
        targetOffsetX,
        0.05
      );
      cam.userData.mouseOffset.y = gsap.utils.interpolate(
        cam.userData.mouseOffset.y,
        targetOffsetY,
        0.05
      );
      
      // Add the tilt offset on top of the baked animation rotation
      cam.rotation.x += cam.userData.mouseOffset.x;
      cam.rotation.y += cam.userData.mouseOffset.y;
      
      // Update camera's world matrices immediately before rendering
      cam.updateMatrixWorld(true);
    }
  });

  return <primitive ref={group} object={scene} />;
}

// Preload the model to ensure a smooth user experience
useGLTF.preload('/models/Final_city_backed.glb');
