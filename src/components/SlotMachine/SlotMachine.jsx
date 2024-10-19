import React, { useState, useCallback, useRef } from 'react';
import './slotMachine.css';
import { carImages } from '../../constants';

const imageHeight = window.innerHeight * 0.3333; // One-third of the viewport height
const numImages = carImages.length;
const spinDuration = 2000; // Total duration of the spin
const decelerationDuration = 1000; // Time for deceleration
const initialSpinSpeed = 50; // Speed when spinning starts

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);  // Easing function for smooth stop

const WheelSpin = () => {
  const [index, setIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [reelStyle, setReelStyle] = useState({});
  const spinStartTime = useRef(0);
  const animationFrameId = useRef(null);

  const getRandomIndex = useCallback(() => {
    return Math.floor(Math.random() * numImages);
  }, []);

  const spin = useCallback((finalIndex) => {
    let position = 0;  // Current Y-axis position
    let lastTimestamp = performance.now();

    const animate = (timestamp) => {
      const elapsed = timestamp - spinStartTime.current;
      let currentSpinSpeed = initialSpinSpeed;

      if (elapsed > spinDuration - decelerationDuration) {
        // Deceleration Phase
        const decelerationProgress = (elapsed - (spinDuration - decelerationDuration)) / decelerationDuration;
        const easedProgress = easeOutCubic(decelerationProgress);
        currentSpinSpeed = initialSpinSpeed + (500 - initialSpinSpeed) * easedProgress;
      }

      if (elapsed < spinDuration) {
        // During the spin
        const delta = timestamp - lastTimestamp;
        position += (delta / currentSpinSpeed) * imageHeight;
        position %= (numImages * imageHeight);  // Ensure position loops correctly
        
        // Update reel position without transition during spin
        setReelStyle({
          transform: `translateY(-${position}px)`,
          transition: 'none',
        });

        lastTimestamp = timestamp;
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        // Snap to the final index smoothly
        const finalPosition = finalIndex * imageHeight;
        setReelStyle({
          transform: `translateY(-${finalPosition}px)`,
          transition: 'transform 500ms ease-out',  // Use a smooth ease-out transition for the last stop
        });
        setIndex(finalIndex);
        setSpinning(false);  // Mark spin as finished
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  const handleSpin = useCallback(() => {
    if (!spinning) {
      setSpinning(true);
      spinStartTime.current = performance.now();
      const finalIndex = getRandomIndex();
      spin(finalIndex);
    }
  }, [spinning, getRandomIndex, spin]);

  return (
    <div className="wheel-spin-container">
      <div className="wheel-spin-window">
        <div className="wheel-spin-reel" style={reelStyle}>
          {[...carImages, ...carImages].map((src, i) => (
            <img 
              key={i} 
              src={src} 
              alt={`Car ${i % numImages + 1}`}
              className="wheel-spin-image"
            />
          ))}
        </div>
      </div>
      <button
        onClick={handleSpin}
        disabled={spinning}
        className="wheel-spin-button"
      >
        {spinning ? 'Spinning...' : 'PLAY'}
      </button>
    </div>
  );
};

export default WheelSpin;