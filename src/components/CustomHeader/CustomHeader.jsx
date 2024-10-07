import React, { useState } from 'react';
import { Button, Menu, Typography, Drawer, Space, Image } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import './styles.css';
import { playSwitchSound } from '../../functions';
import plus_symbol from "../../assets/icons/plus_ymbol.png";

const { Text } = Typography;

const CustomHeader = ({ nickname, email, avatar, money, signOut }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  
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
            style={{ display: 'none' }}  // Initially hidden; will be made visible on small screens
          />

          <section style={{ display: 'flex', justifyContent: 'flex-start', alignItems: "center" }} className='customHeader__menu'>
            <Menu.Item key="carsStore" style={{ backgroundColor: 'transparent' }} className='customHeader__menuItem'>
              <Link to="/carsStore">Cars Store</Link>
            </Menu.Item>
            <Menu.Item key="myCars" style={{ backgroundColor: 'transparent' }} className='customHeader__menuItem'>
              <Link to="/myCars">My Cars</Link>
            </Menu.Item>
            <Menu.Item key="auctionsHub" style={{ backgroundColor: 'transparent' }} className='customHeader__menuItem'>
              <Link to="/auctionsHub">Auctions</Link>
            </Menu.Item>
          </section>

          <section style={{ display: 'flex', alignItems: 'center' }}>
            <Link 
              to="store" 
              className={`storeLink ${isHovered ? 'scale-up' : 'scale-down'}`}
              onMouseEnter={() => setIsHovered(true)} 
              onMouseLeave={() => setIsHovered(false)}
            >
              <img src={plus_symbol} alt="plus_symbol" className="storeIcon" />
              <Text style={{ marginRight: 15 }} type="warning">{`$${money}`}</Text>
            </Link>
            <Link to="/profileEditPage" className="customHeader__avatar">
              <Text
                style={{ marginRight: "5vw", color: "#fff", cursor: "pointer" }}
              >
                {nickname}
              </Text>
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
      <div className="headerPlaceholder"></div> {/* Added to offset the content */}
    </>
  );
};

export default CustomHeader;