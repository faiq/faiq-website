//this module he
var refresh = require('spotify-refresh')
  , keys = require('../keys')
  , Promise = require('bluebird') 
  , SPOTIFY_CLIENT_ID = keys.sID
  , SPOTIFY_CLIENT_SECRET = keys.sSec 
 
// a method that wraps a promise around the save object
var save = function(user) {
  return new Promise(function(resolve, reject) {
    user.save(function(err, resource) {
      if (err) return reject(err)
      resolve(user)
    })
  })
}

module.exports = function (user) { 
    var refreshToken = user.spotifyRefreshToken
      , refreshTime = user.spotifyExpirationDate
      , now = Math.floor((new Date).getTime() / 1000)
    if (now > refreshTime) { 
      refresh(refreshToken, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, function (err, res, body) {
        return new Promise (function (fulfill, refect) {
          if (err || res.statusCode != 200) {
            reject(Error('something went wrong with refreshing tokens'))
          } else {
            body = JSON.parse(body) 
            user.spotifyToken = body['access_token']
            user.spotifyExpirationDate = Math.floor(new Date().getTime()/1000) + 3600
            return save(user)
          }
        })
      })
    }
    else {
      return user 
    }
}
