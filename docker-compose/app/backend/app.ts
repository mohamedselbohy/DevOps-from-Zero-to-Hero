import express from "express";
import bodyParser from "body-parser";
import Dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "./models/user";
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL || "");

mongoose.connection.on("connected", () => {
  console.log("mongodb connection established successfully");
});
mongoose.connection.on("error", () => {
  console.log("mongodb connection Failed");
});

Dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (_: any, res: any) => {
  res.send("Hello World!");
});

app.post("/api/auth/login", async (req: any, res: any) => {
  const user = await User.findByCredentials(req.body.email, req.body.password);
  if (!user) {
    res.status(400).send("unable to login");
  }
  const token = await user?.generateAuthToken();
  res.send({ user, token });
});

app.post("/api/auth/signup", (req: any, res: any) => {
  console.log(req.body);
  const user = new User(req.body);
  if (!user) {
    res.status(400).send();
  }
  user
    .save()
    .then(() => {
      res.send(user);
    })
    .catch(() => {
      res.status(400).send;
    });
});


app.get("/api/users", async (req: any, res: any) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_KEY || "mysecret") as JwtPayload;
      const user = await User.findOne({ _id: decodedToken._id || "" });
      if (user) {
        const users = await User.find();
        res.send(users);
        return;
      }
    }
  }
  res.status(401).send("Unauthorized");
});
app.use(cors());

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
