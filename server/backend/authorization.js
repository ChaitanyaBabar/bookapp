/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information. 
 */



var acl;
var mongoose;
var customMiddleWare;

var contract = require('acl/lib/contract');


module.exports = {

    init: function() {

        acl  = require('acl');
        mongoose = require('mongoose');

        acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'));

        acl.addRoleParents('admin', 'user');

        acl.allow([{
          roles: ['user'],
          allows: [
              {
                  resources: ['/books/v1/single'],
                  permissions: ['post'],
              },
              {
                  resources: ['/books/v1/book/:bookId'],
                  permissions: ['get','patch', 'delete'],
              },
              {
                  resources: ['/books/v1/book/list'],
                  permissions: ['get'],
              },
              {
                resources: ['/books/v1/book/all/list'],
                permissions: ['get'],
              },
              {
                resources: ['/books/v1/interested/list'],
                permissions: ['get'],
              },
              {
                resources: ['/users/v1/buyers/list'],
                permissions: ['get'],
              },
              {
                resources: ['/product/v1/buy/initiate'],
                permissions: ['post'],
              },
              {
                resources: ['/product/v1/sell/initiate', '/product/v1/sold/complete'],
                permissions: ['patch'],
              },
              {
                resources: ['/users/v1/id'],
                permissions: ['get', 'post', 'patch', 'delete'],
              }
          ]
      },
      {
          roles: ['admin'],
          allows: [
            {
              resources: ['/books/v1/list'],
              permissions: ['get'],
            },
            {
              resources: ['/books/v1/user/:userID/book/list'],
              permissions: ['get'],
            },
            {
              resources: ['/books/v1/user/:userID/book/:bookID'],
              permissions: ['get', 'patch', 'delete'],
            },
            {
              resources: ['/users/v1/list'],
              permissions: ['get'],
            },
            {
              resources: ['/users/v1/user/:userId'],
              permissions: ['get', 'post', 'patch', 'delete'],
            },
            {
              resources: ['/users/v1/user/:userId/buyers/list'],
              permissions: ['get'],
            },
            {
              resources: ['/books/v1/book/:bookId/interested/list'],
              permissions: ['get'],
            },
          ]
      }]);


        acl.customMiddleWare = customMiddleWare;

    },

    getAcl: function() {
        return acl;
    }
};


customMiddleWare = function (numPathComponents, userId, actions) {
  contract(arguments)
  .params()
  .params('number')
  .params('number', 'string|number|function')
  .params('number', 'string|number|function', 'string|array')
  .end();

  var acl = this;

  function HttpError(errorCode, msg) {
      this.errorCode = errorCode;
      this.message = msg;
      this.name = this.constructor.name;

      Error.captureStackTrace(this, this.constructor);
      this.constructor.prototype.__proto__ = Error.prototype;
  }

  return function (req, res, next) {
      var _userId = userId,
      _actions = actions,
      resource,
      url;

      // call function to fetch userId
      if (typeof userId === 'function') {
          _userId = userId(req, res);
      }
      if (!userId) {
          if ((req.session) && (req.session.userId)) {
              _userId = req.session.userId;
          } else if ((req.user) && (req.user.id)) {
              _userId = req.user.id;
          } else {
              next(new HttpError(401, 'User not authenticated'));
              return;
          }
      }

      // Issue #80 - Additional check
      if (!_userId) {
          next(new HttpError(401, 'User not authenticated'));
          return;
      }

      // url = req.originalUrl.split('?')[0];

      /**
       * Updated the url from req.originalUrl.split('?')[0] to req.baseUrl + req.route.path
       * as it was not authorizing the url's with dymamic parameters correctly.
       * 
       * So instead of using req.originalUrl, we are using req.baseUrl + req.route.path
       */
      url = req.baseUrl + req.route.path;

      if (!numPathComponents) {
          resource = url;
      } else {
          resource = url.split('/').slice(0, numPathComponents + 1).join('/');
      }

      if (!_actions) {
          _actions = req.method.toLowerCase();
      }

      acl.logger ? acl.logger.debug('Requesting ' + _actions + ' on ' + resource + ' by user ' + _userId) : null;

      acl.isAllowed(_userId, resource, _actions, function (err, allowed) {
          if (err) {
              next(new Error('Error checking permissions to access resource'));
          } else if (allowed === false) {
              if (acl.logger) {
                  acl.logger.debug('Not allowed ' + _actions + ' on ' + resource + ' by user ' + _userId);
                  acl.allowedPermissions(_userId, resource, function (err, obj) {
                      acl.logger.debug('Allowed permissions: ' + util.inspect(obj));
                  });
              }
              next(new HttpError(403, 'Insufficient permissions to access resource'));
          } else {
              acl.logger ? acl.logger.debug('Allowed ' + _actions + ' on ' + resource + ' by user ' + _userId) : null;
              next();
          }
      });
  };
};


// Dummy unrealated change in authorization.js | main branch | batch 1
// Dummy unrealated change in authorization.js | main branch | batch 2
// Dummy unrealated change in server/backend/authorization.js | master branch | batch 3
// Dummy unrealated change in server/backend/authorization.js | master branch | batch 4
// Dummy unrealated change in server/backend/authorization.js | master branch | batch 5
// Dummy unrealated change in server/backend/authorization.js | master branch | batch 6

