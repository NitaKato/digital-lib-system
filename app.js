const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sequelize = require('./config/db');

require('dotenv').config();

const flash = require('express-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');

const superAdminRouter = require('./routes/superAdmin');
const schoolRouter = require('./routes/school');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const categoryRouter = require('./routes/category');
const bookRouter = require('./routes/book');
const userRouter = require('./routes/user');
const issueBookRouter = require('./routes/issuebook');
const returnBookRouter = require('./routes/returnbook');
const loginRouter = require('./routes/login');
const errorRouter = require('./routes/error');

const app = express();

// import models
const modSchool = require('./models/school');
const modAdmin = require('./models/admin');
const modBook = require('./models/book');
const modCategory = require('./models/category');
const modDaySetting = require('./models/daysetting');
const modIssueBook = require('./models/issuebook');
const modOption = require('./models/option');
const modUser = require('./models/user');
const IssueBook = require('./models/issuebook');

const { isLoggedIn, isSuperAdmin, isAdmin } = require('./middleware/auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    name: 'my_session',
    secret: 'my_secret',
    resave: false,
  })
);
app.use(flash());
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adding assets for admin routes
app.use('/:any', express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.use('/admin/:any', express.static(path.join(__dirname, 'public')));
app.use('/admin/books/:any', express.static(path.join(__dirname, 'public')));
app.use(
  '/admin/categories/:any',
  express.static(path.join(__dirname, 'public'))
);
app.use('/admin/users/:any', express.static(path.join(__dirname, 'public')));
app.use('/superadmin', express.static(path.join(__dirname, 'public')));
app.use('/superadmin/:any', express.static(path.join(__dirname, 'public')));

app.use(
  '/superadmin/schools/:any',
  express.static(path.join(__dirname, 'public'))
);
app.use(
  '/superadmin/edit-admin/:any',
  express.static(path.join(__dirname, 'public'))
);
// USE ROUTES
// auth
app.use('/auth', loginRouter);
// superadmini
app.use('/superadmin/schools', isLoggedIn, isSuperAdmin, schoolRouter);
app.use('/superadmin', isLoggedIn, isSuperAdmin, superAdminRouter);

//admini
// app.use('/', indexRouter);
app.get('/error', errorRouter);
app.use('/admin/categories', isLoggedIn, isAdmin, categoryRouter);
app.use('/admin/books', isLoggedIn, isAdmin, bookRouter);
app.use('/admin/users', isLoggedIn, isAdmin, userRouter);
app.use('/admin/issues', isLoggedIn, isAdmin, issueBookRouter);
app.use('/admin/returns', isLoggedIn, isAdmin, returnBookRouter);
app.use('/admin', isLoggedIn, isAdmin, adminRouter);
app.get('/books', usersRouter);
app.get('/', usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

sequelize.sync();

module.exports = app;
