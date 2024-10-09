import React, { useState, useEffect, useCallback, useRef } from "react";
import "@aws-amplify/ui-react/styles.css";
import { Form, Select, message } from "antd";
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import { listAuctions as listAuctionsQuery } from '../../graphql/queries';
import { calculateTimeDifference, fetchUserBiddedList, fetchAuctionUser, fetchUserCarsRequest, playOpeningSound, playSwitchSound, playClosingSound } from "../../functions";
import AuctionPageItem from "./AuctionPageItem";
import { SelectedAuctionDetails } from "./SelectedAuctionDetails";
import AuctionActionsModal from "./AuctionActionsModal";
import AuctionMobilePageItem from "./MobileAuctionPageItem";
import { CreditWarningModal } from "../../components/CreditWarningModal/CreditWarningModal";

const client = generateClient();

export default function AuctionPage({ playerInfo, setMoney, money }) {
  const [auctions, setAuctions] = useState([]);
  const [loadingBid, setLoadingBid] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [auctionActionsVisible, setAuctionActionsVisible] = useState(false);
  const [creditWarningModalvisible, setCreditWarningModalvisible] = useState(false);
  const auctionContainerRef = useRef(null);

  const handleAuctionActionsShow = () => {
    setAuctionActionsVisible(true);
  };

  const handleAuctionActionsCancel = () => {
    setAuctionActionsVisible(false);
  };
  
  const listAuctions = useCallback(async (previousIndex = null) => {
    try {
      const auctionData = await client.graphql({ query: listAuctionsQuery });
      const auctions = auctionData.data.listAuctions.items.map(auction => {
        const endTime = new Date(parseInt(auction.endTime) * 1000);
        const timeLeft = calculateTimeDifference(endTime);

        return {
          ...auction,
          endTime,
          timeLeft
        };
      });
      const filtered = auctions.filter(auction => auction.player !== playerInfo.nickname)

      setAuctions(filtered);
      if (filtered.length > 0) {
        if (previousIndex !== null && filtered[previousIndex]) {
          setSelectedAuction(filtered[previousIndex]);
        } else {
          setSelectedAuction(filtered[0]);
        }
      } else {
        setSelectedAuction(null);
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  }, []);

  const increaseBid = async (auction) => {
    try {
      if(money < auction.buy) {
        setCreditWarningModalvisible(true);
        return;
      }
      else {
        setLoadingBid(true);
      const userBidded = await fetchUserBiddedList(playerInfo.id);
      let increasedBidValue = Math.floor(auction.currentBid * 1.1) || Math.round(auction.minBid * 1.1);

      if (increasedBidValue >= auction.buy) {
        buyItem();
        return;
      }

      const newMoney = auction.lastBidPlayer === playerInfo.nickname ? money - (increasedBidValue - auction.currentBid) : money - increasedBidValue;
      setMoney(newMoney);

      const bidObject = {
        auctionId: auction.id,
        bidValue: increasedBidValue,
      };

      const updatedBiddedList = [...userBidded, bidObject];
      const bidInputs = updatedBiddedList.map(({ auctionId, bidValue }) => ({ auctionId, bidValue }));

      const updatedUser = {
        id: playerInfo.id,
        money: newMoney,
        bidded: bidInputs,
      };

      await client.graphql({
        query: mutations.updateUser,
        variables: {
          input: updatedUser,
        },
      });

      const updatedAuction = {
        id: auction.id,
        currentBid: increasedBidValue,
        lastBidPlayer: playerInfo.nickname,
        status: increasedBidValue < auction.buy ? "active" : "finished",
      };

      await client.graphql({
        query: mutations.updateAuction,
        variables: { input: updatedAuction },
      });

      message.success('Bid successfully increased!');

      const currentIndex = auctions.indexOf(auction);
      listAuctions(currentIndex);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBid(false);
      setAuctionActionsVisible(false);
    }
  };
  
  const buyItem = async () => {
    try {
      if (money < selectedAuction.buy) {
        setCreditWarningModalvisible(true);
        return;
      }
      else if (money >= selectedAuction.buy) {
        setLoadingBuy(true);
      
      const userBiddedList = await fetchUserBiddedList(playerInfo.id);
      const userBidOnThisAuction = userBiddedList.find(bid => bid.auctionId === selectedAuction.id);
      
      const bidValue = userBidOnThisAuction ? userBidOnThisAuction.bidValue : 0;
      const moneyToSubtract = selectedAuction.buy - bidValue;
      
      const newMoney = money - moneyToSubtract;
      setMoney(newMoney);
  
      const auctionUser = await fetchAuctionUser(selectedAuction.id);
      await client.graphql({
        query: mutations.updateUser,
        variables: {
          input: {
            id: auctionUser.id,
            money: auctionUser.money + selectedAuction.buy,
          },
        },
      });
  
      await client.graphql({
        query: mutations.createUserCar,
        variables: {
          input: {
            userId: playerInfo.id,
            carId: selectedAuction.carId,
          },
        },
      });
  
      await client.graphql({
        query: mutations.updateUser,
        variables: {
          input: {
            id: playerInfo.id,
            money: newMoney,
          },
        },
      });
  
      const updatedAuctionInput = {
        id: selectedAuction.id,
        currentBid: selectedAuction.buy,
        lastBidPlayer: playerInfo.nickname,
        status: "Finished",
      };
      await client.graphql({
        query: mutations.updateAuction,
        variables: { input: updatedAuctionInput },
      });
  
      message.success('Car successfully bought!');
  
      listAuctions();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBuy(false);
      setAuctionActionsVisible(false);
    }
  };

  useEffect(() => {
    listAuctions();
  }, [listAuctions]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!auctionActionsVisible && auctions.length > 0) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          playSwitchSound();
          setSelectedAuction((prevAuction) => {
            const currentIndex = auctions.indexOf(prevAuction);
            let newIndex;
            if (e.key === "ArrowUp") {
              newIndex = currentIndex > 0 ? currentIndex - 1 : auctions.length - 1;
            } else {
              newIndex = currentIndex < auctions.length - 1 ? currentIndex + 1 : 0;
            }
            const newAuction = auctions[newIndex];
            
            if (auctionContainerRef.current) {
              const auctionElement = auctionContainerRef.current.children[newIndex];
              if (auctionElement) {
                auctionElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                });
              }
            }
            
            return newAuction;
          });
        } else if (e.key === "Enter") {
          setAuctionActionsVisible(true);
          playOpeningSound();
        }
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [auctions, auctionActionsVisible]);
  
  const handleItemClick = (clickedAuction) => {
    setSelectedAuction(clickedAuction);
    playOpeningSound();
    handleAuctionActionsShow();
  };

  return (
    <div className="auctionPage">
      <div style={{ flex: 1 }}>
        <div className="auction-items-container" ref={auctionContainerRef}>
          {auctions.map((auction) => window.innerWidth > 768 ? (
            (
              <AuctionPageItem
                key={auction.id}
                setSelectedAuction={setSelectedAuction}
                auction={auction}
                index={auctions.indexOf(auction)}
                increaseBid={increaseBid}
                isSelected={auction === selectedAuction}
                handleAuctionActionsShow={handleAuctionActionsShow}
                handleItemClick={handleItemClick}
              />
            )
          )
            : (
              (
                <AuctionMobilePageItem
                key={auction.id}
                setSelectedAuction={setSelectedAuction}
                auction={auction}
                index={auctions.indexOf(auction)}
                increaseBid={increaseBid}
                isSelected={auction === selectedAuction}
                handleAuctionActionsShow={handleAuctionActionsShow}
                handleItemClick={handleItemClick}
              />
              )
        )
        )}
        </div>
      </div>
      <SelectedAuctionDetails selectedAuction={selectedAuction} />
      <AuctionActionsModal
        visible={auctionActionsVisible}
        handleAuctionActionsCancel={() => {
          playClosingSound()
          handleAuctionActionsCancel()
        }}
        selectedAuction={selectedAuction}
        bid={increaseBid}
        loadingBid={loadingBid}
        buyCar={buyItem}
        loadingBuy={loadingBuy}
      />
      <CreditWarningModal isModalVisible={creditWarningModalvisible} setIsModalVisible={setCreditWarningModalvisible} />
    </div>
  );
}