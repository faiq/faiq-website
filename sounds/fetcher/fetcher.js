var mongoose = require('mongoose') 
  , refresh = require('./refresh')
  , Promise = require('bluebird')
  , request = Promise.promisifyAll(require('request'))
  , User = mongoose.model('User')

module.exports = function (cb) { 
    var promise = Promise.resolve(User.findOne({spotifyID: '1211231121'}).exec())

    promise.then(function (user) {
      return refresh(user) //check to see if this needs to be refreshed return a promise that resolves to the updated user
    })
    .then(function (user) { 
      //this part should make the API calls to the spotify API
      var opts = {
        uri: 'https://api.spotify.com/v1/me/tracks',
        headers: {
          'Authorization': 'Bearer ' + user.spotifyToken
        }
      }
      //def returns a promise not sure if this is what god wants me doing though
      return new Promise(function(resolve, reject) {
        request.getAsync(opts).get(1).then(function(body) {
            resolve(body)
          }).catch(function (reason) { 
            reject(reason)
          })
      })
    })
    .then(function (results) { 
      results = JSON.parse(results)
      var imgs = Array.prototype.map.call(results.items, function (item) { 
        var imgArr = item.track.album.images
        return imgArr[imgArr.length - 2].url
      })
      imgs = new Promise(function(resolve, reject) {
        resolve(imgs)
      })
      imgs.nodeify(cb)
    })
    .catch(function (reason) {
     console.log(typeof reason)
     var dummy = new Promise(function (resolve, reject) { 
      reject(reason)
     })
    return dummy.nodeify(cb)
    })
}
