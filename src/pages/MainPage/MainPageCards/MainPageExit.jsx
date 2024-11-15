import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';

const MainPageExit = ({ focused, handleMouseEnter }) => {
  return (
    <Link
      to="/profileEditPage"
      className={`tile ${focused ? 'focused' : ''}`}
      onMouseEnter={() => handleMouseEnter('exitBtn')}
    >
      <Typography.Text className="mainpage__cardText_black">
        Exit
      </Typography.Text>
    </Link>
  );
};

export default MainPageExit;