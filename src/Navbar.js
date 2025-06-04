import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaRegCalendarCheck, FaUser } from 'react-icons/fa';
import { GiClothes, GiHanger } from 'react-icons/gi';
import { MdFavorite } from 'react-icons/md';
import styled from 'styled-components';

const SidebarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100px;
  background: #f5f5f5;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
`;

const HomeButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 0;
  text-decoration: none;
`;

const NavLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
  width: 100%;
  text-align: center;
`;

const NavItem = styled.li`
  margin-bottom: 20px;
`;

const NavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #333;
  padding: 15px 0;
  text-decoration: none;
  font-weight: 500;
  width: 100%;
`;

const Icon = styled.span`
  color: ${(props) => props.color || '#555'};
  font-size: 32px;
`;

const Text = styled.span`
  margin-top: 6px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
`;

const AccountSection = styled.div`
  margin-top: auto;
  padding: 20px;
  text-align: center;
`;

const ProfileIcon = styled(FaUser)`
  font-size: 50px;
  color: #000;
  border-radius: 50%;
`;

const Navbar = () => {
  return (
    <SidebarContainer>
      <HomeButton to="/dash">
        <Icon color="#808080">
          <FaHome />
        </Icon>
      </HomeButton>

      <NavLinks>
        <NavItem>
          <NavLink to="/view-items">
            <Icon color="#FF4500">
              <GiHanger />
            </Icon>
            <Text>Wardrobe</Text>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/outfits">
            <Icon color="#8A2BE2">
              <GiClothes />
            </Icon>
            <Text>Outfits</Text>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/calender">
            <Icon color="#ffa500">
              <FaRegCalendarCheck />
            </Icon>
            <Text>Calendar</Text>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/favourite">
            <Icon color="#E91E63">
              <MdFavorite />
            </Icon>
            <Text>Favorites</Text>
          </NavLink>
        </NavItem>
      </NavLinks>
      {/* <AccountSection>
        <NavLink to="/account">
          <ProfileIcon />
          <Text>Account</Text>
        </NavLink>
      </AccountSection> */}
    </SidebarContainer>
  );
};

export default Navbar;
