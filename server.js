const express = require('express');
const connectDB = require('./config/db');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 150,
  message: 'Too many from this IP, please try again after an hour',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
//Connect DB
connectDB();

//Set up

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          'https://cdnjs.cloudflare.com/ajax/libs/axios/1.0.0-alpha.1/axios.min.js',
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdnjs.cloudflare.com/ajax/libs/axios/1.0.0-alpha.1/axios.min.js',
        ],
        styleSrc: ["'self'", 'use.fontawesome.com', 'fonts.googleapis.com'],
        fontSrc: [
          "'self'",
          'fonts.googleapis.com',
          'use.fontawesome.com',
          'fonts.gstatic.com',
        ],
        imgSrc: ["'self'", "'unsafe-inline'", '*.gravatar.com'],
      },
    },
  })
);
app.use('/api', limiter);
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
// app.use(function (req, res, next) {
//   res.setHeader(
//     'Content-Security-Policy-Report-Only',
//     "default-src 'self' https://unpkg.com/axios/dist/axios.min.js; script-src 'self' https://unpkg.com/axios/dist/axios.min.js; img-src * 'self' data: https:; style-src 'self' https://fonts.googleapis.com/ https://use.fontawesome.com/releases/v5.8.1/css/all.css; font-src 'self' https://fonts.gstatic.com https://use.fontawesome.com; frame-src 'self'"
//   );
//   next();
// });
app.use('/', require('./routes/view'));
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profiles', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/post'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
