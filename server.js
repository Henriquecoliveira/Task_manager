require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

//middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json());

//routes
const userRoute = require("./src/router/user.js");
app.use("/api/user", userRoute);

const groupRoute = require("./src/router/group.js");
app.use("/api/group", groupRoute);

const memberRoute = require("./src/router/member.js");
app.use("/api/member", memberRoute);

const taskRoute = require("./src/router/task.js");
app.use("/api/task", taskRoute);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
