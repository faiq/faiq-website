var express = require("express")
  , http = require("http")
  , passport = require("passport")
  , SpotifyStrategy = require("passport-spotify").Strategy
  , keys = require('./keys')
  , db = require('./users')
  , User = db.model('User')
  , bodyParser = require('body-parser')
  , getAlbums = require('./fetcher/fetcher')
  , path = require('path')
  , router = express()
  , SPOTIFY_CLIENT_ID = keys.sID
  , SPOTIFY_CLIENT_SECRET = keys.sSec 

router.use(bodyParser.json())       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})) 

router.use(passport.initialize())

passport.use(new SpotifyStrategy({
    clientID: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/spotify/callback",
    scope:['playlist-read-private','user-library-read']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      User.findOne({spotifyID: profile.id}, function (err, user) {
        if (err) return done(err)
        else if (user) return done(null, user)
        else {
          var newUser = new User()
          newUser.spotifyToken = accessToken
          newUser.spotifyRefreshToken = refreshToken
          newUser.spotifyID = profile.id
          newUser.spotifyExpirationDate = Math.floor((new Date().getTime())/1000 + 3600)
          newUser.save(function(err) {
            if (err) throw err
            return done(null, newUser)
          })
        }
      })
    })
  })
)

router.get('/auth/spotify', passport.authenticate('spotify', { session: false }))
router.get('/auth/spotify/callback', passport.authenticate('spotify', {session: false, failureRedirect: '/fail',  successRedirect : '/suxess' }))
router.get('/fail', function (req, res) { 
  res.send('FAILURE')  
})
router.get('/', function (req, res) { 
  res.sendFile(path.resolve(__dirname, 'index.html'))
})
router.get('/suxess', function (req, res) { 
  res.send('able to save keys from spotfiy')
})
router.get('/albums', function (req, res) { 
  getAlbums().then(function (albums) { 
    res.send(albums)
  })
  .catch(function (reason) {
    console.log(reason)
  })
})

http.createServer(router).listen('3000', '127.0.0.1')
