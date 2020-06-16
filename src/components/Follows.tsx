import React, { FC, useState } from "react";

const Follow: FC = () => {
  const [followed, setFollowed] = useState<boolean>(false);
  return (
    <>
      <span
        className="FollowText"
        onClick={() => {
          if (!followed) {
            setFollowed(true);
          } else {
            setFollowed(false);
          }
        }}
      >
        {followed ? "followed" : "follow"}
      </span>
    </>
  );
};

export default Follow;
