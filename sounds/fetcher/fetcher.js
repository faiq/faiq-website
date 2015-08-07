var mongoose = require('mongoose') 
  , refresh = require('./refresh')
  , Promise = require('bluebird')
  , request = Promise.promisifyAll(require('request'))
  , User = mongoose.model('User')

module.exports = function () { 
    var promise = Promise.resolve(User.findOne({spotifyID: '1211231121'}).exec())
    console.log(promise)
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
      return request.getAsync(opts).get(1)
    })
    .then(function (results) { 
      results = JSON.parse(results)
      var imgs = Array.prototype.map.call(results.items, function (item) { 
        var imgArr = item.track.album.images
        return imgArr[imgArr.length - 2].url
      })
      console.log(typeof(imgs))
      imgs = new Promise(function(resolve, reject) {
        resolve(imgs)
      })
      console.log(typeof(imgs))
      return imgs
    })
    .catch(function (reason) {
      var rejected = new Promise(function (resolve, reject) { 
        reject(reason)
      })
      console.log(typeof(rejected))
      return rejected
    })
    return promise
}
