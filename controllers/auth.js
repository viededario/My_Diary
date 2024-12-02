const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user.js");

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.post("/sign-up", async (req, res) => {
  try {
    const userAlreadyExist = await User.findOne({
      username: req.body.username,
    });
    if (userAlreadyExist) {
      return res.send("Username already exists.");
    }

    if (req.body.username.length < 5) {
      return res.send("Username must be at least 5 characters long.");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
    if (!passwordRegex.test(req.body.password)) {
      return res.send(
        "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character."
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password do not match");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    req.body.password = hashedPassword;

    await User.create(req.body);

    res.redirect("/auth/sign-in");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send("Login failed. Please try again.");
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.send("Login failed. Please try again.");
    }

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
    };

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
