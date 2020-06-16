import React, { FC, useEffect, useState, useRef } from "react";
import {
  Button,
  Spinner,
  Popover,
  OverlayTrigger,
  Card,
  Fade,
  FormCheck,
} from "react-bootstrap";
import NavBar from "./NavBar";
import axios from "axios";
import "../Assets/Style.scss";
import dotenv from "dotenv";
import Follow from "./Follows";

dotenv.config();

interface ProfileData {
  username: string;
  displayName: string;
  description: string;
}

interface ProfileProps {
  urlProps?: string;
}

const Profile: FC<ProfileProps> = ({ urlProps }) => {
  const [profileData, setProfileData] = useState<ProfileData>();
  const [hasedUser, setHashedUser] = useState<string>("");
  const [uploadBtnDisplay, setUploadBtnDisplay] = useState<string>("");
  const mounted = useRef(0);
  const [allUserTweets, setAllUserTweets] = useState<Array<any>>([]);
  const uploadPicture = useRef<HTMLInputElement | null>(null);
  const [fade, setFade] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [updateAllUserTweet, setUpdateAllUserTweet] = useState<boolean>(false);
  const [searchedProfiles, updateSearchedProfiles] = useState<Array<any>>([]);
  const [showSearchedProfile, changeShowSearchedProfile] = useState<boolean>(
    false
  );

  function getProfilePicture() {
    axios.get("/profile/getProfilePicture").then((res) => {
      setHashedUser(res.data);
    });
  }

  useEffect(() => {
    if (mounted.current <= 1) {
      // getting current user's tweets
      axios.get("/tweets/getUserTweets").then((tweets) => {
        console.log(tweets.data);
        setAllUserTweets(tweets.data);
      });

      axios.get("/profile/getData").then((res) => {
        setProfileData(res.data);
        console.log(res.data.username);
      });
      getProfilePicture();

      mounted.current++;
    }
    console.log(profileData);
  });

  function handleUploadPicture() {
    if (uploadPicture.current !== null) {
      uploadPicture.current.click();
    }
  }

  function searchUserWithDisplayName(name: string) {
    axios
      .post("/profile/getProfileWithDisplayName", { name })
      .then((res: any) => {
        console.log(res.data);
        updateSearchedProfiles(res.data);
      });
  }

  // uploads image and sends it to the backend server
  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event !== null) {
      const uploadedImages = event.target.files;
      if (uploadedImages !== null) {
        console.log(uploadedImages[0]);
        const data = new FormData();
        data.append("file_attachment", uploadedImages[0]);
        axios
          .post("/profile/uploadProfilePicture", data)
          .then((res) => {
            console.log(res);
            if (res.data.recieved) {
              console.log(res.data.userData);
              console.log(res.data.userData.profilePicture);
              setHashedUser(res.data.userData.profilePicture);
            }
          })
          .catch((err) => {
            if (err) throw err;
          });
      }
    }
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Content>
        Try to give appropriate image of type *.jpg
      </Popover.Content>
    </Popover>
  );

  return (
    <div className="Profile">
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-fade-text"
        aria-expanded={open}
        variant="outline-success"
        className="toggleShowTweets"
      >
        Your Tweets
      </Button>
      <input
        ref={uploadPicture}
        type="file"
        className="uploadProfilePicture"
        onChange={handleUpload}
      />
      <NavBar
        callback={(searchInput: string | null | undefined) => {
          // after user has tweeted, update the tweets
          mounted.current = 0;
          setUpdateAllUserTweet(true);
          if (searchInput) {
            searchUserWithDisplayName(searchInput);
            changeShowSearchedProfile(true);
          } else if (searchInput === null) {
            changeShowSearchedProfile(false);
          }
        }}
      />
      <div
        className="searchedProfileWrpapper"
        style={{ display: showSearchedProfile ? "block" : "none" }}
      >
        {searchedProfiles.map((eachProfile: any, index: number) => {
          return (
            <Card>
              <Card.Body>
                <h4>{eachProfile.displayName}</h4>
                <span>@{eachProfile.username}</span>
                <br />
                {eachProfile.description}
                <Follow />
              </Card.Body>
            </Card>
          );
        })}
      </div>
      <div
        className="profilePictureDiv"
        onMouseOver={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          setUploadBtnDisplay("1");
          setFade(true);
        }}
        onMouseLeave={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          setUploadBtnDisplay("0");
          setFade(false);
        }}
        style={{
          backgroundImage: `url('http://localhost:5000/uploads/${hasedUser}.jpg')`,
        }}
      >
        <OverlayTrigger trigger="hover" placement="left" overlay={popover}>
          <Button
            variant="outline-secondary"
            className={fade ? "uploadSymbol fade" : "uploadSymbol"}
            onClick={handleUploadPicture}
            style={{
              opacity: `${uploadBtnDisplay}`,
              animation: "fadeInFromNone 1s ease-out",
            }}
          >
            <span>
              <i className="fa fa-upload" />
            </span>
          </Button>
        </OverlayTrigger>
      </div>
      <span className="profileInfo">
        <h3 id="profileDisplayName">{profileData?.displayName}</h3>
        <p id="profileUsername">@{profileData?.username}</p>
        <p id="profileDescription">{profileData?.description}</p>
      </span>
      <Fade in={open}>
        <div id="example-fade-text">
          <div className="allUserTweets">
            {allUserTweets.map((obj: any, key: any) => {
              return (
                <Card className="tweetCard">
                  <Card.Body> {obj.tweet} </Card.Body>
                  <span>{obj.createdAt}</span>
                </Card>
              );
            })}
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default Profile;
