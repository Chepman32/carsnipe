import React, { useCallback, useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import AuctionPage from "./pages/AuctionPage/AuctionPage";
import CustomHeader from "./components/CustomHeader/CustomHeader";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import { generateClient } from "aws-amplify/api";
import { listUsers } from "./graphql/queries";
import { createUser } from "./graphql/mutations";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CarsStore from "./pages/CarPages/CarsStore";
import MyCars from "./pages/CarPages/MyCars";
import { Spin } from "antd"; // Import Spin for loading
import { getCurrentUser } from "aws-amplify/auth";
import AuctionsHub from "./pages/AuctionPage/AuctionHub";
import MyBids from "./pages/AuctionPage/MyBids";
import MyAuctions from "./pages/AuctionPage/MyAuctions";
import SuccessfulPayment from "./components/SuccessfulPayment";
import PaymentError from "./components/PaymentError";
import Store from "./pages/Store/Store";
import ProfileEditPage from "./pages/Store/ProfileEditPage/ProfileEditPage";
import { selectAvatar } from "./functions";
import { Hub } from "aws-amplify/utils";

const client = generateClient();
Amplify.configure(awsExports);

export default function App() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [money, setMoney] = useState();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [email, setEmail] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const createNewPlayer = useCallback(
    async (username) => {
      try {
        setCreatingUser(true);
        const data = {
          nickname: username,
          email,
          money: 50000,
          bidded: [],
          avatar: "avatar1",
          bio: "",
        };
        if (isNewUser) {
          const createdPlayer = await client.graphql({
            query: createUser,
            variables: { input: data },
          });
          setPlayerInfo(createdPlayer?.data?.createUser);
          console.log("Created new player:", createdPlayer);
        }
      } catch (error) {
        console.error("Error creating new player:", error);
      } finally {
        setCreatingUser(false);
        setLoading(false);
      }
    },
    [email, isNewUser]
  );

  const listener = async (data) => {
    await createNewPlayer(data?.payload?.data?.nickname);
    !playerInfo && !loading && window.location.reload();
  }

  Hub.listen("auth", listener);

  const currentAuthenticatedUser = useCallback(async () => {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      console.log("username", signInDetails.loginId)
      setEmail(signInDetails?.loginId);
      const playersData = await client.graphql({
        query: listUsers,
      });
      const playersList = playersData?.data?.listUsers.items;
      const user = playersList.find((u) => u?.email === signInDetails?.loginId);
      const isNewUser = !playersList.some((pl) => pl?.email === email);
      setIsNewUser(isNewUser);
      if (!user) {
        createNewPlayer(signInDetails?.loginId);
      } else {
        setPlayerInfo(user);
        console.log("user:", user)
        setMoney(user?.money);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching current authenticated user:", err);
      setLoading(false);
    }
  }, [createNewPlayer, email]);

  useEffect(() => {
    currentAuthenticatedUser();
    document.title = "Virtual cars";
  }, [currentAuthenticatedUser, playerInfo]);

  if (loading || creatingUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Authenticator>
        {({ signOut, user }) => (
          <>
            {playerInfo && (
              <main>
                <CustomHeader
                  money={money}
                  username={playerInfo.nickname}
                  email={email}
                  nickname={playerInfo.nickname}
                  avatar={selectAvatar(playerInfo.avatar)}
                />
                <Routes>
                <Route
                    path="/profileEditPage"
                    element={
                      <ProfileEditPage
                        playerInfo={playerInfo}
                        currentAuthenticatedUser={currentAuthenticatedUser}
                        signOut={signOut}
                      />
                    }
                  />
                  <Route
                    path="/carsStore"
                    element={
                      <CarsStore
                        playerInfo={playerInfo}
                        money={money}
                        setMoney={setMoney}
                      />
                    }
                  />
                  <Route
                    path="/auctions"
                    element={
                      <AuctionPage
                        playerInfo={playerInfo}
                        money={money}
                        setMoney={setMoney}
                      />
                    }
                  />
                  <Route
                    path="/myCars"
                    element={
                      <MyCars
                        playerInfo={playerInfo}
                        money={money}
                        setMoney={setMoney}
                      />
                    }
                  />
                  <Route path="/auctionsHub" element={<AuctionsHub />} />
                  <Route
                    path="/myBids"
                    element={
                      <MyBids
                        playerInfo={playerInfo}
                        money={money}
                        setMoney={setMoney}
                      />
                    }
                  />
                  <Route
                    path="/myAuctions"
                    element={
                      <MyAuctions
                        playerInfo={playerInfo}
                        money={money}
                        setMoney={setMoney}
                      />
                    }
                  />
                  <Route
                    path="/successfulPayment"
                    element={<SuccessfulPayment playerInfo={playerInfo} />}
                  />
                  <Route path="/paymentError" element={<PaymentError />} />
                  <Route
                    path="/store"
                    element={<Store email={playerInfo.email} />}
                  />
                </Routes>
              </main>
            )}
          </>
        )}
      </Authenticator>
    </BrowserRouter>
  );
}