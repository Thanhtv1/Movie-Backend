const port = 8000;
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const moongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const bodyParser = require("body-parser");

const app = express();
dotenv.config();

moongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connected to mongodb");
});

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("hello app");
});

app.listen(process.env.PORT, () => {
  console.log(`sever is running at ${process.env.PORT} `);
});
