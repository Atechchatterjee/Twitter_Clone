import express, { Application } from "express";
import authRouter from "./lib/authentication";
import profileRouter from "./lib/profile";
import tweetRouter from "./lib/tweets";
import session from "express-session";
import passport from "passport";

const app: Application = express();

app.listen(5000, () => console.log("server started"));

app.use(
  session({
    secret:
      process.env.SESSION_SECRET === undefined
        ? ""
        : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// static routes
app.use("/uploads", express.static("uploads"));

app.use(passport.initialize());
app.use(passport.session());

// backend-routes
app.use("/profile", profileRouter);
app.use("/auth", authRouter);
app.use("/tweets", tweetRouter);
