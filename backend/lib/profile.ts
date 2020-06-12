import express, { Request, Response } from "express";
import models from "../models/index";
import bodyParser from "body-parser";

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

export default router;
