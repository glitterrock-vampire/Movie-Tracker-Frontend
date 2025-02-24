import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

// Styled Components
const NavBarContainer = styled.nav`
  background-color: #0D1B2A; /* Dark background */
  padding: 1rem 1.5rem;
  border-bottom: 2px solid #00BFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoContainer = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const LogoText = styled.span`
  color: #00E05A; /* Green Color */
  font-size: 24px;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  line-height: 1.1;
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const StyledButton = styled.button`
  background-color: #00BFFF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;

  &:hover {
    background-color: #008CBA;
  }
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #00BFFF;
  }
`;

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <NavBarContainer>
      {/* Logo Section */}
      <LogoContainer to={isLoggedIn ? "/home" : "/"}>
        <LogoText>The</LogoText>
        <LogoText>Movie</LogoText>
        <LogoText>Tracker</LogoText>
      </LogoContainer>

      {/* Navigation Links */}
      <NavRight>
        {isLoggedIn ? (
          <>
            {/* <StyledLink to="/search">Search</StyledLink> */}
            <StyledLink to="/profile">Profile</StyledLink>
            <StyledButton onClick={handleLogout}>Logout</StyledButton>
          </>
        ) : (
          <>
            <StyledLink to="/login">Login</StyledLink>
            <StyledLink to="/register">Register</StyledLink>
          </>
        )}
      </NavRight>
    </NavBarContainer>
  );
}

export default Navbar;
