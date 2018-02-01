//gets the keys from .env
require("dotenv").config();

//sets the exported objexts from keys.js into a varaible
const keys = require("./keys.js");
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");

//set each key set to a varaible
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
const fs = require("fs");
const request = require("request");

//Display the last 20 tweets to the user.
const myTweets = () => {
	client.get('statuses/home_timeline.json?count=20', (error, tweets, response) => {
		if (error) {
			console.log(error);
		}
		
		console.log("**** Now displaying your last 20 tweets *******");
		console.log('------------------');
		tweets.forEach((item) => {
			console.log(item.created_at);
			console.log(item.text);
			console.log('------------------');
		});
	});
};

const spotifySearch = () => {
	spotify.search({type: 'track', query: "The Sign Ace of Base", limit: "1"}, (error, data) => {
		if (error) {
			console.log(error);
		}

		console.log("**** Music Information ****")
		console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
		console.log("Track: " + data.tracks.items[0].name);
		console.log("Album: " + data.tracks.items[0].album.name);
		console.log("Preview: " + data.tracks.items[0].preview_url);
	});
};