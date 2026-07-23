require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const limiter = require("./src/middleware/requisition-limiter.js");

//middlewares
app.use(limiter.global);
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

const taskStepRoute = require("./src/router/task_step.js");
app.use("/api/task_step", taskStepRoute);

const authRoute = require("./src/router/auth.js");
app.use("/auth/refresh", authRoute);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
