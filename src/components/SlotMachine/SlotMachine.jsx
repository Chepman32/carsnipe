import React, { useState, useCallback, useRef } from 'react';
import './slotMachine.css';

const iconMap = ["seven", "banana", "watermelon", "cherry", "plum", "orange", "bell", "bar", "lemon"];
const iconHeight = 158; 
const numIcons = iconMap.length;
const spinDuration = 3000; 
const decelerationDuration = 1500;
const initialSpinSpeed = 50; 

const SlotMachine = () => {
  const [indexes, setIndexes] = useState([0, 0, 0]);
  const [rolling, setRolling] = useState(false);
  const [reelStyles, setReelStyles] = useState([{}, {}, {}]);
  const spinStartTime = useRef(0);
  const animationFrameIds = useRef([]);

  const getRandomIndex = useCallback(() => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % numIcons;
  }, []);

  const shouldMatch = () => {
    const randomValue = Math.random(); 
    return randomValue < 0.01; 
  };

  const getRandomIndexes = () => {
    const uniqueIndexes = new Set();
    while (uniqueIndexes.size < 3) {
      uniqueIndexes.add(getRandomIndex());
    }
    return Array.from(uniqueIndexes);
  };

  const spin = useCallback((reelIndex, finalIndex) => {
    let position = 0;
    let lastTimestamp = performance.now();

    const animate = (timestamp) => {
      const elapsed = timestamp - spinStartTime.current;
      let currentSpinSpeed = initialSpinSpeed;

      if (elapsed > spinDuration - decelerationDuration) {
        const decelerationProgress = (elapsed - (spinDuration - decelerationDuration)) / decelerationDuration;
        currentSpinSpeed = initialSpinSpeed + (1000 - initialSpinSpeed) * decelerationProgress;
      }

      if (elapsed < spinDuration) {
        const delta = timestamp - lastTimestamp;
        position += (delta / currentSpinSpeed) * iconHeight;
        position %= (numIcons * iconHeight);

        setReelStyles(prev => {
          const newStyles = [...prev];
          newStyles[reelIndex] = {
            ...newStyles[reelIndex],
            backgroundPositionY: `-${position}px`,
            transition: 'none', 
          };
          return newStyles;
        });

        lastTimestamp = timestamp;
        animationFrameIds.current[reelIndex] = requestAnimationFrame(animate);
      } else {
        setReelStyles(prev => {
          const newStyles = [...prev];
          newStyles[reelIndex] = {
            ...newStyles[reelIndex],
            backgroundPositionY: `-${finalIndex * iconHeight}px`,
            transition: 'background-position-y 100ms ease-out', 
          };
          return newStyles;
        });
        setIndexes(prev => {
          const newIndexes = [...prev];
          newIndexes[reelIndex] = finalIndex;
          return newIndexes;
        });
      }
    };

    animationFrameIds.current[reelIndex] = requestAnimationFrame(animate);
  }, [getRandomIndex]);

  const rollAll = useCallback(() => {
    setRolling(true);
    spinStartTime.current = performance.now();

    const match = shouldMatch();
    let finalIndexes;

    if (match) {
      const matchingIcon = getRandomIndex();
      finalIndexes = [matchingIcon, matchingIcon, matchingIcon];
    } else {
      // Generate a new random index for each reel to ensure randomness
      finalIndexes = [getRandomIndex(), getRandomIndex(), getRandomIndex()];
    }

    // Spin each reel with its own final index
    [0, 1, 2].forEach(i => spin(i, finalIndexes[i]));

    setTimeout(() => {
      animationFrameIds.current.forEach(id => cancelAnimationFrame(id));
      setRolling(false);
    }, spinDuration);
  }, [spin, getRandomIndex]);

  const handleReSpin = () => {
    if (!rolling) {
      rollAll();
    }
  };

  return (
    <div className="slot-machine">
      <div className="slots">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="reel"
            style={reelStyles[i]}
          />
        ))}
      </div>
      <button className="re-spin-button" onClick={handleReSpin} disabled={rolling}>
        {rolling ? 'Rolling...' : 'Re-Spin'}
      </button>
    </div>
  );
};

export default SlotMachine;