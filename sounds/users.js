
module.exports = function (mongoose) { 
  var userSchema = mongoose.Schema({
      spotifyID: String,
      spotifyToken: String, 
      spotifyRefreshToken: String, 
      spotifyExpirationDate: Number,
  })
  , User = mongoose.model('user', userSchema)
  return User
} 
