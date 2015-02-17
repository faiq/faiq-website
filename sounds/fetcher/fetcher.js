var mongoose = require('mongoose') 
  , refresh = require('./refresh')
  , Promise = require('bluebird')
  , User = null

mongoose.connection.on('error', function (err) {
  process.exit(1) 
  console.error(err)
})

mongoose.connect('mongodb://localhost/artists')

mongoose.connection.on('open', function (err) {

  User = require('../users')(mongoose)
  var promise = User.findOne({spotifyID: '1211231121'}).exec()
  
  promise.then(refresh(User))
  .then(function () { 
    
  })
  .reject(function (reason) {
    console.log(reason)
  })
    
    /*function (err, user) { 
    if (err) return //shouldn't really error
    else { 
      refresh(user)
    }
  })*/
})
