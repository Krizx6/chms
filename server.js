
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const nocache = require('nocache');
const flash = require('connect-flash');

require('./config/passport')(passport);
require('dotenv').config();

//database connection
const UserName = process.env.User;
const dbpass = encodeURIComponent(process.env.password)
mongoose.connect(`mongodb+srv://${UserName}:${dbpass}@chms.oy1jqn9.mongodb.net/chms`)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


const app = express();

//Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(express.json());
//app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl:`mongodb+srv://${UserName}:${dbpass}@chms.oy1jqn9.mongodb.net/chms`,
    collectionName: "sessions"
  }),
  cookie: { maxAge: 1000 * 60 * 60}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(nocache());

// Routes
app.use('/', require('./routes/homeRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/assets', require('./routes/assetRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.post("/donation", (req, res)=>{
  res.redirect("/assets");
 return console.log( req.body);

});

app.use('/', (req,res, next)=>{
  res.status(404).send(
    '<br>'+ '<h1>404 page not found</h1>'
  );
});


app.listen(3000, () => console.log('Server running on port 3000'));