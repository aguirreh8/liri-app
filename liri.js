//Defines .env as enviroment variables
//This way, keys.js can take key information from .env, and export that information for use here.
require("dotenv").config();

//Set modules into a varaibles
const keys = require("./keys.js"); //created javascript file.
const Twitter = require("twitter"); //installed module from npm (Twitter API)
const Spotify = require("node-spotify-api"); //installed module from npm (Spotify API)
const fs = require("fs"); //default package found in package.json
const request = require("request"); //installed module from npm (Request)

//set each key set to a varaible
const spotify = new Spotify(keys.spotify); //grabs Spotify keys from keys.js
const client = new Twitter(keys.twitter); // grags Twitter keys from twitter.js

//grabs inputs from user
let input = process.argv[2];
let query = process.argv[3];

//Display the last 20 tweets to the user.
const myTweets = () => {
	//Using Twitter API, get information from user homepage. Logging in using keys from keys.js, which are stored on .env file.
	client.get('statuses/user_timeline.json?count=20', (error, tweets, response) => {
		if (error) {
			console.log(error);
		}
		
		//Displays last 20 tweets from from logged user. Uses twitter package module
		console.log("**** Now displaying your last 20 tweets *******");
		console.log('------------------');
		tweets.forEach((item) => {
			const result = 
				`${item.created_at} 
				\n${item.text}
				\n---------------`;
			console.log(result);
			logToFile(result);
		});
	});
};

//Display information of the song that the user entered. Using Spotify API. Takes 1 parameter (song).
const spotifySearch = song => {
	//If user did not input, display default info 
	if (!song) {
		spotify.search({type: 'track', query: "The Sign Ace of Base", limit: "1"}, (error, data) => {
			if (error) {
				console.log(error);
			}

			console.log("**** Music Information ****")
			const result = 
				`Artist: ${data.tracks.items[0].album.artists[0].name} 
				\nTrack: ${data.tracks.items[0].name} 
				\nAlbum: ${data.tracks.items[0].album.name} 
				\nPreview: ${data.tracks.items[0].preview_url} 
				\n----------------`;
			console.log(result);
			logToFile(result);
		});
		return; 
	}

	//Run a search on Spotify API to find best match of query. Uses node-spotify-api package module
	spotify.search({type: 'track', query: song, limit: "1"}, (error, data) => {
		if (error) {
			console.log(error);
		}

		console.log("**** Music Information ****")
		const result = 
			`Artist: ${data.tracks.items[0].album.artists[0].name} 
			\nTrack: ${data.tracks.items[0].name} 
			\nAlbum: ${data.tracks.items[0].album.name} 
			\nPreview: ${data.tracks.items[0].preview_url}
			\n---------------`;
		console.log(result);
		logToFile(result);
	}); 

};

//Display information of the movie title that the user entered. Using OMDB API. Takes 1 parameter (movie)
const movieRequest = movie => {
	//If user did not input, display default info
	if (!movie) {
		request("http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy", (error, response, body) => {
			const movie = JSON.parse(body);
			console.log("**** Movie Information ****")
			const result =
				`Title: ${movie.Title} 
				\nYear: ${movie.Year} 
				\nIMDB Rating: ${movie.Ratings[0].Value} 
				\nRotten Tomatos Rating: ${movie.Ratings[1].Value} 
				\nCountry of Production: ${movie.Country} 
				\nLanguages: ${movie.Language} 
				\nPlot: ${movie.Plot} 
				\nActors: ${movie.Actors} 
				\n---------------`;
			console.log(result.trim());
			logToFile(result);
		});
		return;
	}

	//Run a search on OMDB API to find best match of query. Uses 'request' package module
	request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", (error, response, body) => {
		const movie = JSON.parse(body);
		console.log("**** Movie Information ****")
		const result = 
			`Title: ${movie.Title} 
			\nYear: ${movie.Year} 
			\nIMDB Rating: ${movie.Ratings[0].Value} 
			\nRotten Tomatos Rating: ${movie.Ratings[1].Value} 
			\nCountry of Production: ${movie.Country} 
			\nLanguages: ${movie.Language} 
			\nPlot: ${movie.Plot} 
			\nActors: ${movie.Actors} 
			\n---------------`;
		console.log(result.trim());
		logToFile(result);
	});

};

//Reads random.txt and executes one of the functions that it specifies. Must be a valid function name. Uses fs "file system" module.
const readFile = () => {
	fs.readFile("random.txt", "utf8", (error, data) => {
		if (error) {
			console.log(error);
		}

		//splits the text at any commas and inserts each part of the array into variables
		const textArr = data.split(",");
		input = textArr[0].trim();
		query = textArr[1].trim();

		//search if the text in file are valid. Run a function if true.
		switch (input) {
			case "my-tweets":
				myTweets();
				break;
			case "spotify-this-song":
				spotifySearch(query);
				break;
			case "movie-this":
				movieRequest(query);
				break;
			default:
				console.log("This file has no valid requests. Aborting.....");
		}

	});
}

const logToFile = result => {
	fs.appendFile("log.txt", result, (error) => {
		if (error) {
			console.log(error);
		}			
	})
};

//Reads the user's input from the terminal and run a function if valid.
switch (input) {
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		spotifySearch(query);
		break;
	case "movie-this":
		movieRequest(query);
		break;
	case "do-what-it-says":
		readFile();
		break
	default:
		console.log("Not a valid request. Please type 'my-tweets', 'spotify-this-song', 'movie-this' or 'do-what-it-says'.");
}