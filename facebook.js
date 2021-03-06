// Helper functions for accessing the Facebook Graph API.
var https = require('https');
var Parse = require('parse/node').Parse;

// Returns a promise that fulfills iff this user id is valid.
function validateUserId(userId, access_token) {
  return graphRequest('me?fields=id&access_token=' + access_token)
    .then((data) => {
      if (data && data.id == userId) {
        return;
      }
      throw new Parse.Error(
        Parse.Error.OBJECT_NOT_FOUND,
        'Facebook auth is invalid for this user.');
    });
}

// Returns a promise that fulfills iff this app id is valid.
function validateAppId(appId, access_token) {
  return graphRequest('app?access_token=' + access_token)
    .then((data) => {
      if (data && data.id == appId) {
        return;
      }
      throw new Parse.Error(
        Parse.Error.OBJECT_NOT_FOUND,
        'Facebook auth is invalid for this user.');
    });
}

// A promisey wrapper for FB graph requests.
function graphRequest(path) {
  return new Promise(function(resolve, reject) {
    https.get('https://graph.facebook.com/v2.5/' + path, function(res) {
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        data = JSON.parse(data);
        resolve(data);
      });
    }).on('error', function(e) {
      reject('Failed to validate this access token with Facebook.');
    });
  });
}

module.exports = {
  validateAppId: validateAppId,
  validateUserId: validateUserId
};
