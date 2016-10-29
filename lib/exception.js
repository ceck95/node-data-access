/*
 * @Author: toan.nguyen
 * @Date:   2016-04-21 17:55:36
* @Last modified by:   nhutdev
* @Last modified time: 2016-10-29T22:54:47+07:00
 */

'use strict';

const dtaxiCommon = require('dtaxi-common-api');
const helpers = require('node-helpers');

var exHelpers = new helpers.Exception(dtaxiCommon.ttypes.exception);

module.exports = exHelpers;
