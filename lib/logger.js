/*
 * @Author: toan.nguyen
 * @Date:   2016-04-18 14:48:53
* @Last modified by:   nhutdev
* @Last modified time: 2016-10-29T22:54:45+07:00
 */

'use strict';
var config = require('config'),
  bunyan = require('bunyan'),
  bformat = require('bunyan-format'),
  formatOut = bformat({
    outputMode: 'short'
  });

var defaultLevel = 'info',
  logCfg = config.has('logger') ? config.get('logger') : {};



if (logCfg.level) {
  defaultLevel = logCfg.level;
} else if (config.has('default.debug') ? config.get('default.debug') : false) {
  defaultLevel = 'debug';
}



var streams = logCfg.streams || [];

streams.push({
  stream: formatOut,
  level: defaultLevel

});

var logger = bunyan.createLogger({
  name: logCfg.name,
  streams: streams
});

console.log('Log Level', defaultLevel);

module.exports = logger;
