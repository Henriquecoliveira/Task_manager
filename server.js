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
app.use("/api", userRoute);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
