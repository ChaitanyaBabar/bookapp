var acl;
var mongoose;

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
              resources: ['/users/v1/:userId'],
              permissions: ['get', 'post', 'patch', 'delete'],
            }
          ]
      }]);

    },

    getAcl: function() {
        return acl;
    }
};

