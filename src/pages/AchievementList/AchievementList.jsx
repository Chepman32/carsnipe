import React, { useState } from 'react';
import { Card, Row, Col } from 'antd';
import 'antd/dist/reset.css';
import './achievementList.css';
import firstBid from "../../assets/images/achievements/gold-medal-with-blue-ribbon-for-first-place-trophy-winner-award-isolated-on-background-golden-badge-icon-sport-business-achievement.jpg";
import goals from "../../assets/images/achievements/goals.png";
import starter from "../../assets/images/achievements/debt.png";
import quick from "../../assets/images/achievements/flash.png";
import collector from "../../assets/images/achievements/delivery-truck.png";
import lucky from "../../assets/images/achievements/ticket.png";
import profit from "../../assets/images/achievements/invesment.png";

const achievements = [
    {
        title: "First Bid",
        description: "Place your first bid.",
        image: firstBid
    },
    {
        title: "First Win",
        description: "Win your first auction.",
        image: goals
    },
    {
        title: "Starter Pack",
        description: "Own 3 cars.",
        image: starter
    },
    {
        title: "Quick Sale",
        description: "Sell your first car.",
        image: quick
    },
    {
        title: "New Collector",
        description: "Collect 5 cars.",
        image: collector
    },
    {
        title: "Fast Mover",
        description: "Place a bid within 10 seconds of an auction starting."
    },
    {
        title: "Lucky Winner",
        description: "Win a car with no competition in bidding."
    },
    {
        title: "First Profit",
        description: "Sell a car for more than you paid."
    },
    {
        title: "Early Bird",
        description: "Be the first to bid in 5 different auctions."
    },
    {
        title: "Bargain Hunter",
        description: "Win a car for at least 10% below its market value."
    },
    {
        title: "Mid-Range Collector",
        description: "Own 10 cars."
    },
    {
        title: "Profit Dealer",
        description: "Sell 5 cars at a profit."
    },
    {
        title: "Bidding Battle",
        description: "Participate in an auction with 10 or more bids."
    },
    {
        title: "Auction Veteran",
        description: "Participate in 20 auctions."
    },
    {
        title: "High Roller",
        description: "Place a bid of over 100,000 credits."
    },
    {
        title: "Sniper",
        description: "Win an auction by bidding in the last 5 seconds."
    },
    {
        title: "Smooth Seller",
        description: "Sell 10 cars."
    },
    {
        title: "Day Trader",
        description: "Buy and sell a car in the same day."
    },
    {
        title: "Long Game",
        description: "Place a bid at least 24 hours before winning an auction."
    },
    {
        title: "Win Streak",
        description: "Win 5 auctions in a row."
    }
];

const AchievementList = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {achievements.map((achievement, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <div
              className="achievement-card"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <Card
                hoverable
                cover={
                  <div className="card-cover">
                    <img
                      alt={achievement.title}
                      src={achievement.image || "https://cdn-icons-png.freepik.com/512/4387/4387887.png"}
                      className="card-image"
                    />
                    {hovered === index && (
                      <div className="overlay">
                        <div className="overlay-text">{achievement.description}</div>
                      </div>
                    )}
                  </div>
                }
                style={{ textAlign: 'center', width: '100%', height: '100%' }}
              >
                <h3>{achievement.title}</h3>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AchievementList;