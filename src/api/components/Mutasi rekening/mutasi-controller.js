const mutasiService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { sortBy } = require('lodash');

/**
 * Handle get list of mutasi request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function getmutasis(req, res, next) {
  try {
    const products = await productService.getmutasis();
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get mutasi detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getmutasi(request, response, next) {
  try {
    const mutasi = await mutasiService.getmutasi(request.params.id);

    if (!mutasi) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown mutasi');
    }

    return response.status(200).json(mutasi);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createmutasi(request, response, next) {
  try {
    const type = request.body.type;
    const Dari_acount = request.body.Dari_acount;
    const To_acount = request.body.To_acount;
    const amount = request.body.amount;
    const description = request.body.description;

    if (Dari_acount !== To_acount) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    const amountRegistered = await mutasisService.amountRegistered(amount);
    if (amountRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'amount is already registered'
      );
    }

    const success = await mutasiService.createmutasi(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create mutasi'
      );
    }

    return response.status(200).json(mutasi);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update mutasi request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updatemutasi(request, response, next) {
  try {
    const { id } = request.params.id;
    const mutasi = await mutasiService.updatemutasi(id, req.body);

    if (!mutasi) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update mutasi'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete mutasi request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deletemutasi(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deletemutasi(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete mutasi'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getmutasis,
  getmutasi,
  createmutasi,
  updatemutasi,
  deletemutasi,
};
