const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const router = express.Router();

const signedIn = require("./middleware/signed-in.js");
const userView = require("./middleware/user-view.js");
const authController = require("./controllers/auth.js");
const diariesController = require("./controllers/diaries.js");

const User = require("./models/user");
const Diary = require("./models/diary.js");

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static("public"));
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth");
  }
  next();
};

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(userView);
app.use("/auth", authController);
app.use(signedIn);
app.use("/diaries", diariesController);

app.get("/", requireAuth, async (req, res) => {
  // console.log('req.session.user: ', req.session.user); // Check the session data to ensure user is valid

  // res.render("../views/diaries/home.ejs", {
  //   user: req.session.user,
  // });
  try {
    const userWithDiaries = await User.findById(req.session.user._id).populate(
      "diaries"
    );
    console.log('userWithDiaries: ', userWithDiaries)
    res.render("../views/diaries/home.ejs", {
      diaries: userWithDiaries.diaries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching diaries");
  }
});

app.listen(port, () => {
  console.log(`The express app is ready on port http://localhost:${port}`);
});
