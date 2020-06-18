import React, { FC, useEffect, useState, useRef } from "react";
import {
  Button,
  Spinner,
  Popover,
  OverlayTrigger,
  Card,
  Fade,
} from "react-bootstrap";
import NavBar from "./NavBar";
import axios from "axios";
import "../Assets/Style.scss";
import dotenv from "dotenv";
import Follow from "./Follows";
import Cookies from "universal-cookie";
import bcrypt from "bcryptjs";
import imageCompression from "browser-image-compression";

const cookie = new Cookies();

dotenv.config();

interface ProfileData {
  username: string;
  displayName: string;
  description: string;
}

interface ProfileProps {
  urlProps: string;
}

function compressImage(file: File): Promise<File | Blob> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 400,
  };
  return imageCompression(file, options);
}

const Profile: FC<ProfileProps> = ({ urlProps }) => {
  const [isLoaded, changeIsLoaded] = useState<boolean>(false);
  const [profileLoaded, changeProfileLoaded] = useState<boolean>(false);
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
  const requestedUser = useRef<string>(urlProps);
  const sameUser = useRef<boolean>();

  const popover = (
    <Popover id="popover-basic">
      <Popover.Content>
        Try to give appropriate image of type *.jpg
      </Popover.Content>
    </Popover>
  );

  useEffect(() => {
    (async () => {
      if (mounted.current <= 1) {
        sameUser.current = checkUser();

        // getting profile data of the current user
        await axios
          .post("/profile/getData", { username: requestedUser.current })
          .then((res) => {
            setProfileData(res.data);
            changeIsLoaded(true);
          });

        // getting profile picture
        await getProfilePicture()
          .then(() => {
            changeProfileLoaded(true);
          })
          .catch((err) => {
            if (err) {
              changeProfileLoaded(false);
            }
          });

        // getting current user's tweets
        await axios
          .post("/tweets/getUserTweets", {
            username: requestedUser.current,
          })
          .then((tweets) => {
            console.log(tweets.data);
            setAllUserTweets(tweets.data);
          });

        mounted.current++;
      }
    })();
  });

  // NOTE: checking if the requested profile page is of the same user
  function checkUser(): boolean {
    // getting the current hashed user
    const currentUser = cookie.get("user");
    if (currentUser) {
      return bcrypt.compareSync(urlProps, currentUser);
    } else {
      return false;
    }
  }

  // getting the uuid for the profile picture (profile picture stored as uuid in the file server)
  async function getProfilePicture(): Promise<null> {
    return new Promise((resolve, reject) => {
      axios
        .post("/profile/getProfilePicture", { username: requestedUser.current })
        .then((res) => {
          setHashedUser(res.data);
          resolve();
        })
        .catch((err) => {
          if (err) reject();
        });
    });
  }

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

  // compressess the image and then uploads to the server
  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event) {
      const uploadedImages = event.target.files;
      if (uploadedImages !== null) {
        console.log(uploadedImages[0]);
        const data = new FormData();
        (async (): Promise<Blob | File> => {
          const compressedPic: Blob | File = await compressImage(
            uploadedImages[0]
          );
          return new Promise((resolve, reject) => {
            resolve(compressedPic);
          });
        })().then((compressedPic: Blob | File) => {
          data.append("file_attachment", compressedPic);
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
        });
      }
    }
  }

  function RenderUploadBtn() {
    return (
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
    );
  }

  function RenderProfilePicture() {
    return sameUser.current ? <RenderUploadBtn /> : <></>;
  }

  function LoadProfileBody(): any {
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
          onMouseOver={(
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
          ) => {
            setUploadBtnDisplay("1");
            setFade(true);
          }}
          onMouseLeave={(
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
          ) => {
            setUploadBtnDisplay("0");
            setFade(false);
          }}
          style={{
            backgroundImage: `url('http://localhost:5000/uploads/${hasedUser}.jpg')`,
          }}
        >
          {profileLoaded ? (
            <RenderProfilePicture />
          ) : (
            <Spinner animation="grow" className="profile-spinner" />
          )}
        </div>
        <span className="profileInfo">
          <h3 id="profileDisplayName">{profileData?.displayName}</h3>
          <p id="profileUsername">@{profileData?.username}</p>
          <p id="profileDescription">{profileData?.description}</p>
        </span>
        <Fade in={open}>
          <div
            id="example-fade-text"
            className={open ? "display" : "noDisplay"}
          >
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
  }

  return isLoaded ? (
    <LoadProfileBody />
  ) : (
    <div className="spinner-center">
      <Spinner animation="border" role="status"></Spinner>
    </div>
  );
};

export default Profile;
