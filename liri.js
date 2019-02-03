// Listed below are all the dependencies
require("dotenv").config();

var spotifyApi = require("node-spotify-api");
var moment = require("moment");
var axios = require("axios");
var keys = require("./keys");
var fs = require("fs");

// This function will search for the entered Movie
var renderMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var urlOmdbApi =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  axios.get(urlOmdbApi).then(
    function(response) {
      var jsonData = response.data;

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      
    }
  );
};

var renderBands = function(artist) {
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios.get(queryURL).then(
    function(response) {
      var jsonData = response.data;

      if (!jsonData.length) {
        console.log("Sorry, no results found for " + artist);
        return;
      }

      console.log("You are in luck. Here are the upcoming concerts for " + artist + ":");

      for (var i = 0; i < jsonData.length; i++) {
        var show = jsonData[i];

          console.log(
          show.venue.city +
            "," +
            (show.venue.region || show.venue.country) +
            " at " +
            show.venue.name +
            " " +
            moment(show.datetime).format("MM/DD/YYYY")
        );
      }
    }
  );
};

var spotify = new spotifyApi(keys.spotify);

// This function will search for the entered artist's name
var renderNameArtists = function(artist) {
  return artist.name;
};

// This function will search for the entered song on Spotify
var renderSongFromSpotify = function(songName) {
  if (songName === undefined) {
    songName = "The Sign";
  }

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(renderNameArtists));
        console.log("song name: " + songs[i].name);
        console.log("preview link of the song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};

// This function will run a command based on the data entered in the text file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

// This function will determine which command has been executed
var pick = function(caseData, functionData) {
  switch (caseData) {
    case "movie-this":
    renderMovie(functionData);
    break;
  case "concert-this":
    renderBands(functionData);
    break;
  case "spotify-this-song":
    renderSongFromSpotify(functionData);
    break;  
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("Sorry, LIRI does not understand this");
  }
};

// This function will take in the command line arguments and will then execute the associated function
var runCmndLineArgs = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

// This is the main process
runCmndLineArgs(process.argv[2], process.argv.slice(3).join(" "));
