const bcrypt = require('bcrypt');
require('dotenv').config();

const adminModel = require('../models/admin');
const crypto = require('crypto');
const sendEmail = require('./../utils/email');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const forgotPassword = async (req, res, next) => {
  const user = await adminModel.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    req.flash('error', 'Nuk u gjet përdorues me këtë email!');
    return res.redirect('/auth/login');
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
  )}/auth/resetPassword/${resetToken}`;
  const message = `Përshëndetje. Ju keni kërkuar të ndryshoni fjalëkalimin. Kliko në link për t'a ndryshuar: ${resetUrl} . Linku ka vlefshmëri 10 minuta!`;
  try {
    await sendEmail({
      from: 'admin@gmail.com',
      to: user.email,
      subject: 'Kërkesë për ndryshim fjalëkalimi',
      html: message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    req.flash('error', 'Dërgimi i email dështoi!');
  }

  req.flash('success', 'Email u dërgua!');
  return res.redirect('/auth/login');
};

const resetPasswordView = async (req, res, next) => {
  const token = req.params.token;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await adminModel.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        [Op.gt]: Date.now(),
      },
    },
  });
  if (!user) {
    req.flash('error', 'Kërkesa nuk është valide, ose ka skaduar!');
    return res.redirect('/auth/login');
  }
  res.render('reset', { token });
};

const resetPassword = async (req, res, next) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await adminModel.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        [Op.gt]: Date.now(),
      },
    },
  });
  if (!user) {
    req.flash('error', 'Kërkesa nuk është valide, ose ka skaduar!');
  }
  if (req.body.password != req.body.confirmPassword) {
    req.flash('error', 'Ju lutem konfirmojeni fjalëkalimin!');
    return res.render('reset', { token });
  }

  user.password = bcrypt.hashSync(req.body.password, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  req.flash('success', 'Fjalëkalimi u ndryshua');
  return res.redirect('/auth/login');
};

const updateView = async (req, res, next) => {
  res.render('change-password');
};

const updatePassword = async (req, res, next) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });

  let { actual_password, new_password, confirm_password } = req.body;
  if (!actual_password || !new_password || !confirm_password) {
    req.flash('error', 'Të gjitha fushat duhet të plotësohen');
  }
  const user = await adminModel.findOne({
    where: {
      id: admin.id,
    },
  });
  if (!bcrypt.compareSync(actual_password, user.password)) {
    req.flash('error', 'Fjalëkalimi aktual nuk është i saktë');
    return res.redirect('/auth/updatepassword');
  }
  if (new_password != confirm_password) {
    req.flash('error', 'Fjalëkalimi nuk përshtatet');
    return res.redirect('/auth/updatepassword');
  }
  user.password = bcrypt.hashSync(req.body.new_password, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  req.flash('success', 'Fjalëkalimi u ndryshua');
  res.redirect('/auth/login');
};

module.exports = {
  forgotPassword,
  updateView,
  updatePassword,
  resetPasswordView,
  resetPassword,
};

// Fjalëkalimi nuk përshtatet
