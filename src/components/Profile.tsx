import React, { FC, useEffect, useState } from "react";
import axios from "axios";

const Profile: FC = () => {
  useEffect(() => {
    axios.get("/profile/getData").then((res) => {
      console.log("profile data = ");
      console.log(res.data);
    });
  });

  return (
    <div>
      <h1>Name: Anish</h1>
    </div>
  );
};

export default Profile;
