import React, { useEffect } from 'react';
import './WormholeTransition.css';

export default function WormholeTransition({ onComplete }) {
  useEffect(() => {
    // End the transition after the animation duration
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="wormhole-container">
      <div className="wormhole-tunnel"></div>
    </div>
  );
}
