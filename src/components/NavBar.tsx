import React, { FC } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Nav } from "react-bootstrap";

const NavBar: FC = () => {
  return (
    <Navbar expand="lg" className="Navbar">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Brand className="white">
        <img
          alt="Twitter Logo"
          src={require("../Assets/twitterLogo.jpeg")}
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{" "}
        Twitter
      </Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className="white">Home</Nav.Link>
          <Nav.Link className="white">Link</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
