import React, { FC, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "../Assets/Style.scss";

const RegistrationForm: FC = () => {
  const [username, changeUsername] = useState<string>("");
  const [password, changePassword] = useState<string>("");
  const [email, changeEmail] = useState<string>("");
  const [displayName, changeDisplayName] = useState<string>("");
  const [description, changeDescription] = useState<string>("");

  function submitUserData(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    axios
      .post("/auth/postRegistrationData", {
        username,
        password,
        email,
        displayName,
        description,
      })
      .then((res) => console.log(res))
      .catch((err) => {
        if (err) throw err;
      });
  }

  return (
    <form className="registration-form">
      <div className="registration-form-body">
        <div className="md-form">
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
            type="text"
            value={email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              changeEmail(event.target.value)
            }
            id="form1"
            className="form-control input-form"
            placeholder="email"
          />
        </div>
        <div className="md-form">
          <textarea
            value={description}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              changeDescription(event.target.value)
            }
            id="form1"
            className="form-control input-form"
            placeholder="description"
          />
        </div>
        <div className="md-form">
          <input
            type="text"
            value={displayName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              changeDisplayName(event.target.value)
            }
            id="form1"
            className="form-control input-form"
            placeholder="display name"
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
      <button
        onClick={submitUserData}
        className="btn btn-primary registration-submit"
      >
        Submit
      </button>
    </form>
  );
};

const RegistrationModal: FC = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button variant="info" id="registration-btn" onClick={handleShow}>
        Sign Up
      </Button>
      <Modal show={show} onHide={handleClose} className="registrationModal">
        <button className="btn modal-close" onClick={handleClose}>
          &times;
        </button>
        <Modal.Body className="registrationModal-body">
          <h2>Sign Up</h2>
          <RegistrationForm />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RegistrationModal;
