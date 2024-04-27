
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const salleRoutes = require('./routes/salleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const bodyParser = require('body-parser');
const { isLoggedIn } = require('./middlewares/authMiddleware');
const cookieParser = require('cookie-parser');




const app  = express();
connectDB() ; 
app.use(express.json());


app.set('view engine', 'ejs');
app.get('/', (req,res)=>{
    res.render('home');
});


app.get('/dashboard', isLoggedIn , (req,res) =>{
    res.render('dashboard');
});




app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())




app.use('/api/users', userRoutes);
app.use('/api/salles', salleRoutes);
app.use('/api/reservations', reservationRoutes);


app.use(cookieParser());
//cookies
app.get('/set-cookies', (req,res)=>{
    res.cookie('newUser', false);
    res.cookie('isEmployee', true, {maxAge: 1000*60*60*24, httpOnly: true});
    res.send('you got the cookies!');
});


app.get('/read-cookies', (req,res)=>{
    const cookies = req.cookies;
    console.log(cookies.newUser);
    res.json(cookies)
  
});


app.listen(3001,()=>{
    console.log('Server is running on port 3001');
});