var mongoose = require('mongoose')
var userSchema = new mongoose.Schema({
      spotifyID: String,
      spotifyToken: String, 
      spotifyRefreshToken: String, 
      spotifyExpirationDate: Number,
  })
mongoose.model('User', userSchema)
module.exports = mongoose.connect('mongodb://localhost/artists')
