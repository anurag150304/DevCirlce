import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import connectToDB from "./database/config.js";
import userRoute from "./routes/user.route.js";
import projectRoute from "./routes/project.route.js";
import genieRoute from "./routes/genie.route.js";

const App = express();
await connectToDB();

App.use(cors());
App.use(morgan("dev"));
App.use(cookieParser());
App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.use("/users", userRoute);
App.use("/projects", projectRoute);
App.use("/genie", genieRoute);

App.get("/", (req, res) => res.send("Welcome to the DevCircle environment"));

export default App;