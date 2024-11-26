const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Diary = require('../models/diary.js')

router.get('/', async (req, res) =>{
    const allDiaries = await Diary.find({});
    res.render('../views/diaries/index.ejs', { diaries: allDiaries});
});



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


router.get('/:diaryId', async (req, res) => {
    try {
      const diary = await Diary.findOne({ 
        _id: req.params.diaryId, 
        user: req.session.user._id,
      });
  
      if (!diary) {
        return res.status(404).send('Diary not found');
      }
  
      res.render('diaries/show.ejs', { diary });
    } catch (error) {
      console.error(error);
      res.status(500).send('There was an error retrieving the diary');
    }
  });

  router.get('/:diaryId/edit', async (req, res) => {
    try {
        const diary = await Diary.findOne({
            _id: req.params.diaryId, 
            user: req.session.user._id, 
        });

        if (!diary) {
            return res.status(404).send("Diary not found"); 
        }

        res.render('diaries/edit.ejs', { diary }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving the diary for editing");
    }
});


router.put('/:diaryId', async (req, res) => { 
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


router.delete('/:diaryId', async (req, res) => {  
    try {
        
        const diary = await Diary.findOne({
            _id: req.params.diaryId,
            user: req.session.user._id,
        });

        if (!diary) {
            return res.status(404).send("Diary not found"); 
        }

        
        await Diary.findByIdAndDelete(req.params.diaryId);

        
        res.redirect('/diaries');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting the diary");
    }
});




module.exports = router;
