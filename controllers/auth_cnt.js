const bcrypt = require('bcrypt');
const { promisify } = require('util');
const JWT = require('jsonwebtoken');
require('dotenv').config();

const adminModel = require('../models/admin');
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
  const message = `Keni harruar fjalëkalimin? Kliko për t'a ndryshuar: ${resetUrl}`;
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
  return res.redirect('/');

  // res.status(200).json({
  //   status: 'success',
  //   message: 'Token sent to email! (Valid for 10 min)',
  // });
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
