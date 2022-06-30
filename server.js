const express = require('express');
const connectDB = require('./config/db');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500,
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
//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data Sanitization against XSS
app.use(xss());
//Prevent HTTP params polution
app.use(cors());
app.options('*', cors());
app.use(compression());
app.use(limiter);

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

app.all('*', (req, res, next) => {
  res.render('error', { statusCode: 404, message: 'Not Found' });
});
app.use((err, req, res, next) => {
  res.render('error', { statusCode: '', message: '' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

let userOnline = {};
io.on('connection', function (socket) {
  socket.on('disconnect', () => {
    if (socket.userId) {
      if (userOnline.hasOwnProperty(socket.userId)) {
        delete userOnline[socket.userId];
      }
    }
  });

  socket.on('user-online', function (data) {
    socket.userId = data;
    userOnline[data] = socket;
  });
  socket.on('user-like', (id, name, index, isYourPost) => {
    if (userOnline.hasOwnProperty(id.trim())) {
      if (isYourPost === 1) {
        userOnline[id.trim()].broadcast.emit(
          'notification-like',
          name,
          index,
          1,
          0
        );
      } else if (isYourPost === 0) {
        userOnline[id.trim()].emit('notification-like', name, index, 1, 1, 0);
        socket.broadcast.emit('notification-like', name, index, 1, 0);
      }
    }
  });
  socket.on('user-unlike', (id, name, index, isYourPost) => {
    if (userOnline.hasOwnProperty(id.trim())) {
      if (isYourPost === 1) {
        userOnline[id.trim()].broadcast.emit(
          'notification-like',
          name,
          index,
          0,
          0
        );
      } else if (isYourPost === 0) {
        userOnline[id.trim()].emit('notification-like', name, index, 0, 0, 0);
        socket.broadcast.emit('notification-like', name, index, 0, 0);
      }
    }
  });
  socket.on('user-comment', (id, name, index, isYourPost) => {
    if (userOnline.hasOwnProperty(id.trim())) {
      if (isYourPost === 1) {
        userOnline[id.trim()].broadcast.emit(
          'notification-comment',
          name,
          index,
          0
        );
      } else if (isYourPost === 0) {
        userOnline[id.trim()].emit('notification-comment', name, index, 1, 0);
        socket.broadcast.emit('notification-comment', name, index, 0, 1);
      }
    }
  });
});
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// process.on('unhandledRejection', (err) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err.name, err.message);

//   process.exit(1);
// });

process.on('SIGTERM', () => {
  console.log('🤟 SIGTERM RECEIVED. Shutting down grecefully');
  console.log('🔥 Process terminated!');
});
