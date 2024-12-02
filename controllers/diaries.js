const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Diary = require("../models/diary.js");

const moment = require("moment");

const createdOn = new Date();
const formattedDate = createdOn.toLocaleDateString("en-US");

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth");
  }
  next();
};

router.get("/", requireAuth, async (req, res) => {
  try {
    const userWithDiaries = await User.findById(req.session.user._id).populate(
      "diaries"
    );
    console.log('userWithDiaries: ', userWithDiaries)
    res.render("../views/diaries/index.ejs", {
      diaries: userWithDiaries.diaries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching diaries");
  }
});

router.get("/new", requireAuth, (req, res) => {
  const createdOn = new Date();
  res.render("../views/diaries/new.ejs", { moment, createdOn });
});

router.post("/", requireAuth, async (req, res) => {
  const diaryData = {
    ...req.body,
    user: req.session.user._id,
    createdOn: new Date(),
  };

  try {
    const diary = new Diary(diaryData);
    await diary.save();

    await User.findByIdAndUpdate(req.session.user._id, {
      $push: { diaries: diary._id },
    });

    res.redirect("/diaries");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating diary");
  }
});

router.get("/:diaryId", requireAuth, async (req, res) => {
  try {
    const diary = await Diary.findOne({
      _id: req.params.diaryId,
      user: req.session.user._id,
    });

    if (!diary) {
      return res.status(404).send("Diary not found");
    }

    res.render("diaries/show.ejs", { diary });
    console.log(diary);
  } catch (error) {
    console.error(error);
    res.status(500).send("There was an error displaying the journal");
  }
});

router.get("/:diaryId/edit", requireAuth, async (req, res) => {
  try {
    const diary = await Diary.findOne({
      _id: req.params.diaryId,
      user: req.session.user._id,
    });

    if (!diary) {
      return res.status(404).send("Diary not found");
    }

    res.render("diaries/edit.ejs", { diary });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving the journal for editing");
  }
});

router.put("/:diaryId", requireAuth, async (req, res) => {
  try {
    const diary = await Diary.findOne({
      _id: req.params.diaryId,
      user: req.session.user._id,
    });

    if (!diary) {
      return res.status(404).send("Diary not found");
    }

    await Diary.findByIdAndUpdate(req.params.diaryId, req.body);

    res.redirect(`/diaries/${req.params.diaryId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating the diary");
  }
});

router.delete("/:diaryId", requireAuth, async (req, res) => {
  try {
    const diary = await Diary.findOne({
      _id: req.params.diaryId,
      user: req.session.user._id,
    });

    if (!diary) {
      return res.status(404).send("Diary not found");
    }

    await Diary.findByIdAndDelete(req.params.diaryId);

    res.redirect("/diaries");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting the diary");
  }
});

module.exports = router;
