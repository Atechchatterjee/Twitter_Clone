import express, { Request, Response, response } from "express";
import models from "../models/index";
import bodyParser from "body-parser";

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(urlencodedParser);
router.use(bodyParser.json());

router.post(
  "/postTweets",
  urlencodedParser,
  async (req: Request, res: Response) => {
    const { tweet, toUser } = req.body;
    console.log(req.body);
    await models.Tweets.create({
      fromUser: req.user,
      toUser: toUser,
      tweet: tweet,
      likes: 0,
    })
      .then((respons) => {
        console.log("response =>> " + response);
        res.send("tweets recieved");
      })
      .catch((err) => {
        if (err) throw err;
      });
  }
);

router.post(
  "/getUserTweets",
  urlencodedParser,
  async (req: Request, res: Response) => {
    const requestedUser = req.body.username;
    // if (req.user) {
    models.Tweets.findAll({
      where: {
        fromUser: requestedUser,
      },
    }).then((allTweets) => {
      res.send(allTweets);
    });
  }
  // }
);

export default router;
