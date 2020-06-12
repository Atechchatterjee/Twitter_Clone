import express, { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
  } else {
    res.send(new Error("not authenticated"));
  }
};
