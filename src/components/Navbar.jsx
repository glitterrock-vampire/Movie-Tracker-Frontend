import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const NavBarContainer = styled.nav`
  background-color: #fff;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled(Link)`
  font-weight: bold;
  font-size: 1.2rem;
`;

const NavRight = styled.div`
  display: flex;
  gap: 1rem;
`;

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <NavBarContainer>
      {/* <Title to="/">FilmKu</Title> */}
      {/* <NavRight>
        {isLoggedIn ? (
          <>
            <Link to="/profile">Profile</Link>
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "none" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </NavRight> */}
    </NavBarContainer>
  );
}

export default Navbar;
