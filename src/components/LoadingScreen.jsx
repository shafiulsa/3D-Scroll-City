import React from 'react';
import { useProgress } from '@react-three/drei';
import './LoadingScreen.css';

export default function LoadingScreen({ onEnter }) {
  const { progress } = useProgress();
  const loaded = progress === 100;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1>As Salamu Alaikum</h1>
        {!loaded ? (
          <p className="progress-text">Loading Assets: {Math.round(progress)}%</p>
        ) : (
          <button className="enter-button" onClick={onEnter}>Enter</button>
        )}
      </div>
    </div>
  );
}
