import React, { useState, useRef } from "react";
import { carImages } from "../../constants";
import "./SlotMachine.css";

const SlotMachine = () => {
  const [credits, setCredits] = useState(10000);
  const [spinning, setSpinning] = useState(false);
  const reelRef = useRef(null);

  const initializeReel = () => {
    const carsSequence = [...carImages, ...carImages, ...carImages];
    return carsSequence.map((car, index) => (
      <div key={index} className="symbol">
        <div className="car-info">
          <h3>{`${car.make.toUpperCase()} ${car.model.toUpperCase()} ${
            car.year ? car.year : ""
          }`}</h3>
          <p>{car.make.toUpperCase()}</p>
        </div>
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="car-image"
        />
      </div>
    ));
  };

  const getRandomCar = () => {
    return carImages[Math.floor(Math.random() * carImages.length)];
  };

  const animateReel = (finalCar) => {
    return new Promise((resolve) => {
      const symbolHeight = 250;
      const container = reelRef.current;
      const finalCarIndex = carImages.findIndex(
        (car) => car.make === finalCar.make && car.model === finalCar.model
      );
      const totalHeight =
        symbolHeight * carImages.length * 3 + symbolHeight * finalCarIndex;

      container.style.transition = "none";
      container.style.transform = "translateY(0px)";

      setTimeout(() => {
        container.style.transition = "transform 3s cubic-bezier(0.25, 0.8, 0.5, 1)";
        container.style.transform = `translateY(-${totalHeight}px)`;
      }, 50);

      setTimeout(() => {
        // Add a slight bounce effect
        container.style.transition = "transform 0.5s ease-out";
        container.style.transform = `translateY(-${symbolHeight * finalCarIndex}px)`;
        resolve();
      }, 2000);
    });
  };

  const spin = async () => {
    if (spinning || credits < 10) return;

    setSpinning(true);
    setCredits((prevCredits) => prevCredits - 10);

    const result = getRandomCar();
    await animateReel(result);

    setSpinning(false);
  };

  return (
    <div className="slot-machine">
      <div className="reel">
        <div ref={reelRef} className="reel-container">
          {initializeReel()}
        </div>
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