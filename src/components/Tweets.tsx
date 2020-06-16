import React, { FC, useState, useEffect, useRef } from "react";
import { Nav, Modal, FormControl, Button, Card } from "react-bootstrap";
import axios from "axios";

interface Props {
  callback: Function;
}

const Tweets: FC<Props> = ({ callback }) => {
  const [show, setShow] = useState<boolean>(false);
  const [tweet, setTweet] = useState<string>("");
  const tweetArea = useRef<HTMLTextAreaElement | null>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const mounted = useRef(0);

  function submitTweets() {
    axios
      .post("/tweets/postTweets", {
        tweet: tweet,
        dateTime: new Date().toISOString().slice(0, 19).replace("T", " "),
        toUser: null,
      })
      .then((res) => {
        console.log(res.data);
        handleClose();
        if (tweetArea.current) {
          tweetArea.current.innerHTML = "";
        }
        callback();
      });
  }

  return (
    <>
      <Nav.Link
        className="white"
        onClick={() => {
          handleShow();
        }}
      >
        Tweet
      </Nav.Link>
      <Modal show={show} onHide={handleClose} className="">
        <Modal.Body className="tweetModalBody">
          <button
            className="btn modal-close tweetModal-close"
            onClick={handleClose}
          >
            &times;
          </button>
          <h4 id="tweetHeader">Tweet</h4>
          <FormControl
            ref={tweetArea}
            as="textarea"
            value={tweet}
            className="tweet-input"
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (event.target.value.length <= 280) {
                setTweet(event.target.value);
              }
            }}
          />
          <Button
            variant="outline-info"
            className="tweetPost"
            onClick={submitTweets}
          >
            Tweet
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Tweets;
