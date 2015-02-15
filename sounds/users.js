
module.exports = function (mongoose) { 
  var userSchema = mongoose.Schema({
      scToken: String,
      scRefreshToken: String,
      scExpirationDate: Number,
      spotifyToken: String, 
      spotifyRefreshToken: String, 
      spotifyExpirationDate: Number,
  })
  , User = mongoose.model('user', userSchema)
  return User
} 
