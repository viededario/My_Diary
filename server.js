const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const router = express.Router();



const signedIn = require('./middleware/signed-in.js');
const userView = require('./middleware/user-view.js');
const authController = require('./controllers/auth.js');
const diariesController = require('./controllers/diaries.js');

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static('public'));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


app.use(userView)
app.use('/auth', authController);
app.use(signedIn)
app.use('/diaries', diariesController);

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.listen(port, () => {
  console.log(`The express app is ready on port http://localhost:${port}`);
});
