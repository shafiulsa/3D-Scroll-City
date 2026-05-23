import React, { useEffect, useState, useRef } from 'react';
import Scene from './components/Scene';
import ScrollSections from './components/ScrollSections';
import LoadingScreen from './components/LoadingScreen';
import WormholeTransition from './components/WormholeTransition';
import './index.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [showTransition, setShowTransition] = useState(false);
  const [showScene, setShowScene] = useState(false);
  const lenisRef = useRef(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.02,
      smoothWheel: true,
      wheelMultiplier: 0.65,
      touchMultiplier: 1.5,
      infinite: false,
    });
    lenisRef.current = lenis;
    lenis.stop(); // Stop scroll initially

    lenis.on('scroll', ScrollTrigger.update);
    const updateLenis = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  useEffect(() => {
    if (showScene && lenisRef.current) {
      lenisRef.current.start();
    }
  }, [showScene]);

  const handleEnter = () => {
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    setShowScene(true);
    // Refresh ScrollTrigger to ensure all markers are correctly placed after Scene shows up
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <>
      <Scene />
      <ScrollSections />

      {/* Loading overlay appears while model is loading or before enter */}
      {!showScene && !showTransition && (
        <LoadingScreen onEnter={handleEnter} />
      )}

      {/* Wormhole transition after Enter */}
      {showTransition && (
        <WormholeTransition onComplete={handleTransitionComplete} />
      )}
    </>
  );
}

export default App;
