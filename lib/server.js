/*
 * @Author: toan.nguyen
 * @Date:   2016-09-08 11:38:43
* @Last modified by:   nhutdev
* @Last modified time: 2016-10-29T22:54:49+07:00
 */

'use strict';

const Hoek = require('hoek');
const thrift = require('thrift');
const Path = require('path');
const BPromise = require('bluebird');
const fs = BPromise.promisifyAll(require('fs'));
const helpers = require('node-helpers');
const logger = require('./logger');

class DataAccessServer {

  /**
   * Initialize thrift services
   *
   * @param  {Object} thriftService Thrift service
   *
   * @return {BPromise}
   */
  init(thriftService) {
    return this.buildServices().then(services => {
      this.services = services;
      this._thriftService = thrift.createServer(thriftService, this.services);

      return BPromise.resolve(this);
    });
  }

  /**
   * Builds data access services
   *
   * @return {Object} Data access services
   */
  buildServices() {

    let services = {};

    return new BPromise((resolve) => {

      let serviceDir = 'services',
        servicePath = Path.join(process.cwd(), serviceDir);

      fs.readdirAsync(servicePath).then((files) => {
        files.forEach((element) => {
          let requiredPath = Path.join(process.cwd(), serviceDir, element),
            service = new(require(requiredPath))();

          Hoek.assert(service.model, 'Model of service `' + service.constructor.name + '` has not been implemented');
          Hoek.assert(service.adapter, 'Adapter of service `' + service.constructor.name + '` has not been implemented');

          if (!service.adapter.log) {
            service.adapter.log = logger.child({
              namespace: service.adapter.logNamespace,
              adapter: service.adapter.constructor.name
            });

          }

          if (service.model.defaultServiceActions || service.model.serviceActions) {
            let modelServices = service.model.defaultServiceActions || [];

            if (service.model.serviceActions) {
              modelServices = modelServices.concat(service.model.serviceActions);
            }

            modelServices.forEach(action => {
              let thriftActionName = helpers.DataAccess.getServiceName(service.model, action);

              // Hoek.assert(service[action], 'Method `' + action + '` for `' + thriftActionName + '` service has not been implemented');

              if (service[action]) {
                services[thriftActionName] = service[action].bind(service);
              }
            });
          }
        });
      });

      return resolve(services);
    }).catch(e => {
      throw e;
    });
  }

  /**
   * Runs server with host, port
   *
   * @param  {String} host Server host
   * @param  {String} port Server port
   */
  run(options) {
    Hoek.assert(options.host, 'Empty host, cannot start server');
    Hoek.assert(options.port, 'Empty port, cannot start server');
    console.log('Server running at: http://' + options.host + ':' + options.port);
    console.log('Server environment:', process.env.NODE_ENV || 'Development');

    this._thriftService.listen(options.port, options.host);
  }
}

module.exports = DataAccessServer;
