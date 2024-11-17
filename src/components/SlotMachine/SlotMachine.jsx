import React, { useState, useRef } from "react";
import "./SlotMachine.css";

const symbols = ["🍒", "🍋", "🍇", "🍊", "💎", "7️⃣"];

const SlotMachine = () => {
  const [credits, setCredits] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const reelRefs = useRef([]);

  const initializeReel = () => {
    const symbolsSequence = [...symbols, ...symbols, ...symbols];
    return symbolsSequence.map((symbol, index) => (
      <div key={index} className="symbol">
        {symbol}
      </div>
    ));
  };

  const getRandomSymbol = () => {
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  const animateReel = (reel, finalSymbol, delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const symbolHeight = 200;
        const container = reelRefs.current[reel];
        const finalSymbolIndex = symbols.indexOf(finalSymbol);
        const fullRotationHeight = -(symbols.length * symbolHeight * 3); // Roll 3 loops

        container.style.transition = "none";
        container.style.top = "0px";

        const forceReflow = container.offsetHeight; // Force reflow
        container.style.transition = "top 2s cubic-bezier(.45,.05,.55,.95)";
        container.style.top = `${fullRotationHeight}px`;

        setTimeout(() => {
          // Stop the animation and immediately snap to the final symbol
          container.style.transition = "none";
          container.style.top = `-${finalSymbolIndex * symbolHeight}px`;
          resolve();
        }, 2000);
      }, delay);
    });
  };

  const spin = async () => {
    if (spinning || credits < 10) return;

    setSpinning(true);
    setCredits((prevCredits) => prevCredits - 10);

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    const spinPromises = reelRefs.current.map((_, index) =>
      animateReel(index, results[index], index * 250)
    );

    await Promise.all(spinPromises);

    setSpinning(false);
  };

  return (
    <div className="slot-machine">
      <div className="reels">
        {[0, 1, 2].map((reel) => (
          <div key={reel} className="reel">
            <div
              ref={(el) => (reelRefs.current[reel] = el)}
              className="reel-container"
            >
              {initializeReel()}
            </div>
          </div>
        ))}
      </div>
      <button
        className="spin-button"
        onClick={spin}
        disabled={spinning || credits < 10}
      >
        Spin (10 credits)
      </button>
    </div>
  );
};

export default SlotMachine;