var refresh = require('spotify-refresh')
  , keys = require('../keys')
  , Promise = require('bluebird') 
  , SPOTIFY_CLIENT_ID = keys.sID
  , SPOTIFY_CLIENT_SECRET = keys.sSec 

module.exports = function (user) { 
    var refreshToken = user.spotifyRefreshToken
      , refreshTime = user.spotifyExpirationDate
      , now = Math.floor(Date.now() / 1000)
    if (now > refreshTime) { 
      refresh(refreshToken,SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, function (err, res, body) {
        console.log('yo')
        return new Promise (function (fulfill, refect) {
          reject(Error('this is an error')) 
        })
      })
    }
    else console.log('not refreshing')
}
