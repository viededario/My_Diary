const express = require('express');
const router = express.Router();

const Diary = require('../models/diary.js')

router.get('/', async (req, res) =>{
    const diaries = await Diary.find({ user: req.session.user._id });
    console.log(diaries);
    res.render('../views/diaries/index.ejs', { diaries });
});

router.get('/diaries', async (req, res) => {
    const allDiaries = await Diary.find({ user: req.session.user._id });
    res.render('../views/diaries/index.ejs', { allDiaries});
})

router.get('/new', (req, res) => {
    res.render('../views/diaries/new.ejs')
})

router.post('/', async (req, res) => {
    const diaryData = {
        ...req.body,
        user: req.session.user._id,
    };
console.log(diaryData);

const diary = new Diary(diaryData);
await diary.save();

res.redirect('/diaries')

});




module.exports = router;
