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
const getRecommandations = async (spotifyApi,genre) => {
    return spotifyApi.clientCredentialsGrant().then(
        async function(data) {
          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
          // console.log('aaaaaaa',spotifyApi.getAccessToken())
          return spotifyApi.searchTracks(`genre:${genre}`).then(
            function(data) {
              // console.log(data.body.tracks.items)
              // console.log(genre, data.body)
              return data.body.tracks.items
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
