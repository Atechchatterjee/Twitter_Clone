import React, { FC, useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import NavBar from "./NavBar";
import axios from "axios";
import "../Assets/Style.scss";
import bcrypt from "bcryptjs";

interface ProfileData {
  username: string;
  displayName: string;
  description: string;
}

const Profile: FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>();
  const [hasedUser, setHashedUser] = useState<string>("");
  const [uploadBtnDisplay, setUploadBtnDisplay] = useState<string>("");
  const mounted = useRef(0);
  const uploadPicture = useRef<HTMLInputElement | null>(null);
  const [fade, setFade] = useState<boolean>(false);

  function getProfilePicture() {
    axios.get("/profile/getProfilePicture").then((res) => {
      setHashedUser(res.data);
    });
  }

  useEffect(() => {
    if (mounted.current <= 1) {
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

  return (
    <div className="Profile">
      <input
        ref={uploadPicture}
        type="file"
        className="uploadProfilePicture"
        onChange={handleUpload}
      />
      <NavBar />
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
      </div>
      <span className="profileInfo">
        <h3 id="profileDisplayName">{profileData?.displayName}</h3>
        <p id="profileUsername">@{profileData?.username}</p>
        <p id="profileDescription">{profileData?.description}</p>
      </span>
    </div>
  );
};

export default Profile;
