import React, { useState } from 'react';
import { Button, Menu, Typography, Drawer, Space, Image } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import './styles.css';
import { playSwitchSound } from '../../functions';
import plus_symbol from "../../assets/icons/plus_ymbol.png";
import { MenuItems } from './MenuItems';

const { Text } = Typography;

const CustomHeader = ({ nickname, email, avatar, money }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation()
  console.log("location:", location.pathname)
  
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <>
      <Menu
        theme="dark"
        mode="horizontal"
        style={{
          width: "100%",
          lineHeight: '64px',
          display: 'flex',
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: 'flex',
            justifyContent: "space-between",
            alignItems: "center"
          }}
          className='customHeader'
        >
          <Button
            className="burgerMenuButton"
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            style={{ display: 'none' }}
          />

<MenuItems/>
          <section style={{ display: 'flex', alignItems: 'center' }}>
            <Link 
              to="store" 
              className={`storeLink ${isHovered ? 'scale-up' : 'scale-down'}`}
              onMouseEnter={() => setIsHovered(true)} 
              onMouseLeave={() => setIsHovered(false)}
              style={{ background: 'transparent', borderLeft: location.pathname === "/store" && '1px solid red', borderRight: location.pathname === "/store" && '1px solid red' }}
            >
              <img src={plus_symbol} alt="plus_symbol" className="storeIcon" />
              <Text style={{ marginRight: 15 }} type="warning">{`$${money}`}</Text>
            </Link>
            <Link to="/profileEditPage" className="customHeader__avatar" style={{ background: 'transparent', borderLeft: location.pathname === "/profileEditPage" || location.pathname === "/achievements" && '1px solid red', borderRight: location.pathname === "/profileEditPage" && '1px solid red' }} >
              <Typography.Text style={{ marginRight: 15, color: "#fff", fontSize: "1.4rem", fontWeight: "bold" }}>{nickname}</Typography.Text>
              <img src={avatar} alt="avatar" />
            </Link>
          </section>
        </div>

        <Drawer
          title={"Menu"}
          placement="left"
          onClose={toggleDrawer}
          open={drawerVisible}
          width={"60vw"}
        >
          <div className="header__drawer">
            <Link to="/carsStore" className="header__drawer__item" onClick={() => setDrawerVisible(false)}>
              <Text strong>Cars Store</Text>
            </Link>
            <Link to="/myCars" className="header__drawer__item" onClick={() => setDrawerVisible(false)}>
              <Text strong>My Cars</Text>
            </Link>
            <Link to="/auctionsHub" className="header__drawer__item" onClick={() => setDrawerVisible(false)}>
              <Text strong>Auctions</Text>
            </Link>
            <Link to="store" className="header__drawer__item store" onClick={() => setDrawerVisible(false)}>
                <img src={plus_symbol} alt="plus_ymbol" className="storeIcon" />
                <Text strong>{`$${money}`}</Text>
              </Link>
              <Link to="/profileEditPage" >
              <div className="drawer__avatar">
              <Text
                className="header__drawer__nickname"
              >
                {nickname}
                </Text>
                <img src={avatar} alt="avatar" />
              </div>
            </Link>
         </div>
        </Drawer>
      </Menu>
      <div className="headerPlaceholder"></div>
    </>
  );
};

export default CustomHeader;