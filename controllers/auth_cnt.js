const bcrypt = require('bcrypt');
const { promisify } = require('util');
const JWT = require('jsonwebtoken');
require('dotenv').config();

const adminModel = require('../models/admin');
// const AppError = require('./../utils/appError');
const crypto = require('crypto');
const sendEmail = require('./../utils/email');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const createSendToken = (user, status, res) => {
  const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET);
  res.status(status).json({
    status: 'success',
    token,
    user,
  });
};

exports.register = async (req, res, next) => {
  let password = req.body.password;

  const hashPassword = bcrypt.hashSync(password, 12);
  let user = await adminModel.create({ ...req.body, password: hashPassword });
  user.password = undefined;
  createSendToken(user, 201, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Please provide email and password!');
  }
  const user = await adminModel.findOne({
    where: {
      email: email,
    },
  });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    req.flash('error', 'Invalid login details');
  }

  createSendToken(user, 200, res);
};

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    req.flash('error', 'You are not logged in! Please log in to get access.');
  }
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
  const currentUser = await adminModel.findOne({
    where: {
      id: decoded.id,
    },
  });
  if (!currentUser) {
    req.flash('error', 'The user belonging this token does no longer exist.');
  }
  req.user = currentUser;
  next();
};

exports.restrictTo = ({ admin }) => {
  return (req, res, next) => {
    if (!admin.isSuperAdmin) {
      // return req.flash(
      //   'error',
      //   'You do not have permission to perform this acion'
      // );
      res.send('You do not have permission to perform this action');
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  const user = await adminModel.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    req.flash('error', 'There is no user with email adress.');
  }
  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/resetPassword/${resetToken}`;
  const message = `Forgot password? Reset your password in url: ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token',
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    req.flash('error', 'There was an error sending the email');
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email! (Valid for 10 min)',
  });
};

exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await adminModel.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        [Op.gt]: Date.now(),
      },
    },
  });
  if (!user) {
    req.flash('error', 'Token is invalid or has expired');
  }

  user.password = bcrypt.hashSync(req.body.password, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
};

exports.updatePassword = async (req, res, next) => {
  let { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    req.flash('error', 'Please provide old password and new password!');
  }

  const user = await adminModel.findOne({
    where: {
      id: req.user.id,
    },
  });
  if (!bcrypt.compareSync(oldPassword, user.password)) {
    req.flash('error', "Old password it's not correct!");
  }
  createSendToken(user, 200, res);
};
