let SpotifyWebApi = require('spotify-web-api-node')
const dotenv = require('dotenv')
dotenv.config()
const initSpotify = () => {
    let spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
      });
    return spotifyApi
}
const getRecommandations = (spotifyApi) => {
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
      
          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
          console.log('aaaaaaa',spotifyApi.getAccessToken())
          spotifyApi.searchTracks('genre:Pop').then(
            function(data) {
              console.log(data.body.tracks.items)
            },
            function(err) {
              console.log('something went wrong')
            }
          )
        },
        function(err) {
          console.log('Something went wrong when retrieving an access token', err);
        }
      );
}

exports.initSpotify = initSpotify
exports.getRecommandations = getRecommandations
