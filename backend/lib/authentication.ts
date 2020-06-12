import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import models from "../models/index";
import dotenv from "dotenv";
import passport from "passport";
import authenticationMiddleware from "./auth-middleware";

dotenv.config();

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(urlencodedParser);
router.use(bodyParser.json());

interface registrationModel {
  username: string;
  password: string;
  displayName: string;
  description: string;
  email: string;
}

interface loginModel {
  username: string;
  password: string;
}

const hasDuplicateUsername = (username: string, callback: Function): void => {
  models.Users.findAll({
    where: {
      username: username,
    },
  }).then((user) => {
    callback(user.length !== 0);
  });
};

// checks if the username and the password exist in the database
const userExists = (data: loginModel, callback: Function): void => {
  const { username, password } = data;
  models.Users.findAll({
    where: {
      username: username,
      password: password,
    },
  })
    .then((results) => {
      callback(results.length !== 0);
    })
    .catch((err) => {
      if (err) throw err;
    });
};

router.get("/isAuthenticated", (req: Request, res: Response) => {
  res.send({ isAuthenticated: req.user ? true : false });
});

router.post(
  "/postRegistrationData",
  urlencodedParser,
  (req: Request, res: Response) => {
    const {
      username,
      password,
      displayName,
      description,
      email,
    }: registrationModel = req.body;

    (async () => {
      // checking if the user exits
      hasDuplicateUsername(username, async (exists: Boolean) => {
        console.log("User exits => " + exists);
        if (!exists) {
          // adding a newUser
          await models.Users.create({
            username: username,
            password: password,
            displayName: displayName,
            description: description,
            email: email,
          });
          res.send({ alreadyExits: false });
        } else {
          res.send({ alreadyExits: true });
        }
      });
    })().catch((err) => {
      if (err) throw err;
    });
  }
);

router.post(
  "/postLoginData",
  urlencodedParser,
  (req: Request, res: Response) => {
    const { username, password }: loginModel = req.body;
    userExists(req.body, (exists: Boolean) => {
      if (exists) {
        req.login(username, (err) => {
          if (err) throw err;
          res.send({ loggedIn: true });
        });
      } else {
        res.send({ loggedIn: false });
      }
    });
  }
);

// Serializing the user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserializing the user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default router;
