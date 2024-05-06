const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const mutasiControllers = require('./mutasi-controller');
const mutasisValidator = require('./mutasis-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/mutasi', route);

  // Get list of mutasi
  route.get('/', authenticationMiddleware, mutasiControllers.getmutasis);

  // Create mutasis
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(mutasisValidator.createmutasis),
    mutasisControllers.createmutasis
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, mutasisControllers.getmutasi);

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(usersValidator.updateUser),
    mutasiControllers.mutasiUser
  );

  // Delete user
  route.delete(
    '/:id',
    authenticationMiddleware,
    mutasiControllers.deletemutasi
  );

  // Change password
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(mutasisValidator.changePassword),
    mutasiControllers.changePassword
  );
};
