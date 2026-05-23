import React, { useEffect } from 'react';
import Scene from './components/Scene';
import ScrollSections from './components/ScrollSections';
import './index.css'; 
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
 
function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.02, // Lower lerp value makes the scroll feel much smoother and more floaty
      smoothWheel: true,
      wheelMultiplier: 0.65, // Lower wheel multiplier slows down the scroll speed per wheel notch
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Update ScrollTrigger on Lenis scroll events
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis updates with the GSAP ticker for frame-rate synchronization
    const updateLenis = (time) => {
      lenis.raf(time * 1000); // Lenis expects milliseconds
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return (
    <>
      <Scene />
      <ScrollSections />
    </>
  );
}

export default App;
