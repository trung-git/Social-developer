const express = require('express');
const connectDB = require('./config/db');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

//Connect DB
connectDB();

//Set up
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// app.use(express.json({ limit: "10kb" }));
app.use(express.json({ extended: false }));
// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', path.join(__dirname, './views/layouts/layout'));
app.use(expressLayout);
// Define Routes
app.use('/', require('./routes/view'));
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profiles', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/post'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
