import express, { Request, Response } from "express";
import models from "../models/index";
import bodyParser from "body-parser";
import { uuid } from "uuidv4";
import multer from "multer";
import { Model } from "sequelize/types";
import fs from "fs";
import path from "path";

const storeUUID = async (uniqueId: string, username: any) => {
  console.log("inserting unique id = " + uniqueId);
  await models.Users.update(
    { profilePicture: uniqueId },
    { where: { username: username } }
  ).then((res: Array<any>) => {
    console.log("number of rows affected " + res);
    return new Promise((resolve, reject) => {
      if (res.length > 0) {
        resolve();
      } else {
        reject(new Error("failed to update the profile picture"));
      }
    }).catch((err) => {
      if (err) throw err;
    });
  });
};

const deleteUUID = async (username: Express.User | undefined) => {
  if (username !== undefined) {
    await models.Users.update(
      { profilePicture: null },
      {
        where: {
          username: username,
        },
      }
    );
  }
};

const getUser = async (username: Express.User | undefined) => {
  return new Promise(async (resolve, reject) => {
    if (username !== undefined) {
      await models.Users.findOne({
        where: {
          username: username,
        },
      })
        .then((data) => {
          resolve(data?.toJSON());
        })
        .catch((err) => reject(err));
    } else {
      reject();
    }
  });
};

const getProfilePicture = async (
  username: Express.User | undefined
): Promise<Model> => {
  return new Promise((resolve, reject) => {
    console.log("getProfilePicture => username: " + username);
    if (username !== undefined) {
      models.Users.findAll({
        where: {
          username: username,
        },
      }).then((profilePicture) => {
        if (profilePicture.length !== 0) {
          resolve(profilePicture[0]);
        } else {
          reject();
        }
      });
    } else {
      reject();
    }
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req: Request, file, cb) => {
    if (req.user) {
      // deleting the profile picture if any
      deleteUUID(req.user);
      // getting the uuid
      getUser(req.user)
        .then((user: any) => {
          const uid = user.profilePicture;
          if (uid !== null) {
            console.log(uid);
            // deleting the file from the uploads folder
            const relPath = `${path.join(__dirname, "../")}uploads/${uid}.jpg`;
            console.log("relPath = " + relPath);
            fs.unlink(relPath, (err) => {
              if (err) throw err;
            });
          }
        })
        .catch((err) => console.log("no user"));
      // generating a random uuid and storing it in the database
      const uniqueId = uuid();
      storeUUID(uniqueId, req.user)
        .then(() => {
          cb(null, uniqueId + ".jpg");
        })
        .catch((err) => {
          if (err) throw err;
        });
    }
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/getData", (req: Request, res: Response) => {
  console.log("profile req.user = " + req.user);
  const user = req.user ? req.user : "";
  models.Users.findAll({
    where: {
      username: user,
    },
  }).then((userData) => {
    const { username, displayName, description }: any = userData[0].toJSON();
    console.log();
    if (userData.length !== 0) {
      res.send({ username, displayName, description });
    }
  });
});

router.post(
  "/uploadProfilePicture",
  upload.single("file_attachment"),
  (req: Request, res: Response) => {
    console.log(req.file);
    getProfilePicture(req.user).then((data: Model) => {
      res.send({
        username: req.user,
        recieved: true,
        userData: data.toJSON(),
      });
    });
  }
);

router.get("/getProfilePicture", (req, res) => {
  getUser(req.user).then((user: any) => {
    const uid = user.profilePicture;
    res.send(uid);
  });
});

export default router;
