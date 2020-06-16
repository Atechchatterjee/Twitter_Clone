import React, { FC, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import Tweets from "./Tweets";

interface Props {
  callback: Function;
}

const NavBar: FC<Props> = ({ callback }) => {
  const searchInput = useRef<HTMLInputElement | null>(null);
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
          <Tweets
            callback={() => {
              //? callback from tweets to profile
              callback();
            }}
          />
        </Nav>
      </Navbar.Collapse>
      <Form inline>
        <FormControl
          ref={searchInput}
          type="text"
          placeholder="Search"
          className="mr-sm-2 searchInput"
          onBlur={() => callback(null)}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.keyCode === 13) {
              document.getElementById("searchProfile")?.click();
              event.preventDefault();
            }
          }}
          onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
            if (event.target.value !== "") {
              document.getElementById("searchProfile")?.click();
            }
          }}
        />
        <Button
          id="searchProfile"
          variant="secondary"
          onClick={() => {
            searchInput.current?.focus();
            callback(searchInput.current?.value);
          }}
        >
          Search
        </Button>
      </Form>
    </Navbar>
  );
};

export default NavBar;
