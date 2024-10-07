import React, { useState } from "react";
import "./store.css";
import coin_symbol from "../../assets/icons/coin_symbol.webp"
import { Link } from "react-router-dom";

const StoreItemCard = ({ item, email, username }) => {
  const [isBouncing, setIsBouncing] = useState(false);

  const handleClick = () => {
    // Trigger the bounce animation
    setIsBouncing(true);
    // Reset animation after it completes (duration: 0.5s)
    setTimeout(() => setIsBouncing(false), 500);
  };

  return (
    <Link to={item.link} key={item.id}
      className={`store-item-card ${isBouncing ? "bounce" : ""}`}
      onClick={handleClick}
    >
      <img src={coin_symbol} alt={item.name} className="item-image" />
      <h2 className="item-quantity">x{item.quantity}</h2>
      <p className="item-price">{item.price.toLocaleString()} $</p>
    </Link>
  );
};

const Store = ({ email, username }) => {
  const items = [
    {
      id: 1,
      name: "2000 CR",
      quantity: 2000,
      price: 1.99,
          image: "https://example.com/coins-2000.png",
      link: `https://buy.stripe.com/test_bIYaGY9kD18d0tGeUV?prefilled_email=${email}`
    },
    {
      id: 2,
      name: "5000 CR",
      quantity: 5000,
      price: 4.49,
        image: "https://example.com/coins-5000.png",
      link: `https://buy.stripe.com/test_cN23ew68rdUZgsE9AC?prefilled_email=${email}`
    },
    {
      id: 3,
      name: "15000 CR",
      quantity: 15000,
      price: 8.99,
        image: "https://example.com/coins-15000.png",
      link: `https://buy.stripe.com/test_aEU6qIeEXeZ32BO5kn?prefilled_email=${email}`
      },
      {
        id: 4,
        name: "25000 CR",
        quantity: 25000,
        price: 19.99,
          image: "https://example.com/coins-2000.png",
        link: `https://buy.stripe.com/test_dR67uM54n5ota4gaEI?prefilled_email=${email}`
      },
      {
        id: 5,
        name: "50000 CR",
        quantity: 50000,
        price: 44.99,
          image: "https://example.com/coins-5000.png",
        link: `https://buy.stripe.com/test_bIYbL2eEXg374JWfZ3?prefilled_email=${email}`
      },
      {
        id: 6,
        name: "100000 CR",
        quantity: 100000,
        price: 89.99,
          image: "https://example.com/coins-15000.png",
        link: `https://buy.stripe.com/test_14k02kgN56sxa4g6ou?prefilled_email=${email}`
      },
  ];

  return (
    <div className="store-container">
      {items.map((item) => (
          <StoreItemCard key={item.id} item={item} email={email} username={username} />
      ))}
    </div>
  );
};

export default Store;