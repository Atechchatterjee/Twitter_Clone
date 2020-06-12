import React, { FC, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

interface Props {
  callback: Function;
}

const LoginForm: FC<Props> = ({ callback }) => {
  const [username, changeUsername] = useState<string>("");
  const [password, changePassword] = useState<string>("");

  function submitUserData(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    axios
      .post("/auth/postLoginData", {
        username,
        password,
      })
      .then((res) => {
        console.log(res.data.loggedIn);
        if (res.data.loggedIn) {
          window.location.assign("/profile");
          callback(res.data.loggedIn);
        } else {
          var errorMsg: any = document.querySelector(".loginError");
          if (errorMsg !== null) {
            errorMsg.innerHTML = "username or password is wrong";
          }
        }
      })
      .catch((err) => {
        if (err) throw err;
      });
  }

  return (
    <form className="login-form">
      <div className="login-form-body">
        <span className="errorMsg loginError"></span>
        <div className="md-form ">
          <input
            type="text"
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              changeUsername(event.target.value)
            }
            id="form1"
            className="form-control input-form"
            placeholder="username"
          />
        </div>
        <div className="md-form">
          <input
            type="password"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              changePassword(event.target.value)
            }
            id="form1"
            className="form-control input-form"
            placeholder="password"
          />
        </div>
      </div>
      <button onClick={submitUserData} className="btn btn-primary login-submit">
        Submit
      </button>
    </form>
  );
};

const Login: FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="danger" id="login-btn" onClick={handleShow}>
        Login
      </Button>
      {""}
      <Modal show={show} onHide={handleClose} className="loginModal">
        <button className="btn modal-close" onClick={handleClose}>
          &times;
        </button>

        <Modal.Body className="loginModal-body">
          <h2>Log In</h2>
          <LoginForm
            callback={(loggedIn: boolean) => {
              loggedIn ? handleClose() : handleShow();
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;
