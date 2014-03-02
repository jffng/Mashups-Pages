//make an input box with name of venue--finished
//retrieve venue's id number from Band's in Town--finished
//use venue Id to search for Events--finished 
//Find today's date--finished

//TO DO:

//1. Match artist name exactly in Spotify or remove from list

//check out SOLD OUT problem

//change Api request to get all upcoming events in a 3 mile radius
//add the ability to just hit enter after putting in venue name

// 1. Search Artists in Spotify with
// http://ws.spotify.com/search/1/artist.json?q=Mayer Hawthorne 
// the search returns a spotify:artist id

// 2. Lookup Artist with Album Detail, using artist id
// http://ws.spotify.com/lookup/1/.json?uri=spotify:artist:4d53BMrRlQkrQMz5d59f2O&extras=albumdetail
// Parse through resulting JSON to pull first the album.href 

// 3. Lookup Album with Track Detail, using Spotify album id
// http://ws.spotify.com/lookup/1/.json?uri=spotify:album:5X1fUUzoNxvZbmIypGB0Yw&extras=trackdetail
// Choose 2 random tracks using "track-number", and take spotify:track hrefs, concatenate to a "Playlist" string making sure a space is in between tracks

// 4. Embed the random tracks using this code: 
// <iframe src="https://embed.spotify.com/?uri=spotify:track:2zEP1yGJkjKUlseT8d4GiP" width="250" height="80" frameborder="0" allowtransparency="true"></iframe>

//spotify:user:aaronarntz:playlist:3w4eVv4ULYCkNyDjwYkVh7 
//make playlist from artist events

//Implement the JamBase, SoundCloud, and Bandcamp options, perhaps other databases as well

//look at a different way to find events

	var venueIdList = [];
	var venueEventList = [];
	var filteredDateEvent = []; 
	var venueEventListArtists = [];
	var artistNameArray = [];  
	var spotifyArtistObjects = []; 
	var spotifyArtistHREFs = []; 
	var spotifyAlbumObjects =[]; 
	var randomAlbums = []; 
	var ajaxCounter = 0;
	var today = Date.create().format(Date.ISO8601_DATE);

	console.log(today);



function initializeArrays(){

	venueIdList = [];
	venueEventList = [];
	filteredDateEvent = []; 
	venueEventListArtists = [];
	artistNameArray = [];  
	spotifyArtistObjects = []; 
	spotifyArtistHREFs = []; 
	spotifyAlbumObjects =[]; 
	randomAlbums = []; 
	ajaxCounter= 0; 
	today = Date.create().format(Date.ISO8601_DATE);
	console.log(today);
	console.log("arrays initialized");
}

function clearCSS(){

	$(".artist").remove();
	$("iframe").remove();

}



function getBandsInTownVenueId(searchTerm) {
	var bandsInTownURL = "http://api.bandsintown.com/venues/search.json?query="; 
	var venueSearchTerm = searchTerm;
	var bandsInTownKey = "&location=use_geoip&app_id=theyGood&callback=displayVenues";

	$.ajax({
			url: bandsInTownURL + venueSearchTerm + bandsInTownKey,			
			type: 'GET',
			dataType: "jsonp",

			error: function(data){
				console.log("oops");
				console.log(data);
			},	

			success: function (data) {
				console.log("Venue ID success");
				//console.log(data);

				for (var i = 0; i < data.length; i++) {
					getBandsInTownVenueEvents(data[i].id);
					}		
			}
		});	
}



function getBandsInTownVenueEvents(venueIdArray){ 
    
	var	bandsInTownEventURL = "http://api.bandsintown.com/venues/" + venueIdArray +"/events.json?app_id=theyGood&callback=displayEvents"; 

		$.ajax({
			url: bandsInTownEventURL,
			dataType: "jsonp",

			error: function(data){
				console.log("oops");
				console.log(data);
			},	

			success: function (data) {	
				console.log("Venue Events success");
				//console.log(data);	
				
				for (var i = 0; i < data.length; i++) {
					venueEventList.push(data[i]); 
					}
				 
				filterDate(); 
				getArtistNames();
			}	
		});		 
}


function filterDate(){
	
	console.log(venueEventList);
	
	for (var i = 0; i < venueEventList.length; i++) {
		
		var eventTruncDate = venueEventList[i].datetime.truncate(10, 'right', '' );
		
		if (eventTruncDate === today){
			filteredDateEvent.push(venueEventList[i]);
			console.log("There is a show today!");
			}
	}
}


function getArtistNames(){

	for (var i = 0; i < filteredDateEvent.length; i++) {
		for (var j = 0; j < filteredDateEvent[i].artists.length; j++) {
			artistNameArray.push(filteredDateEvent[i].artists[j].name);
			}	
		}	
		artistNameArray = removeDuplicates(artistNameArray);
		console.log(artistNameArray);
		
}
	

function getSpotifyArtistIDs(artistArray) {
	//console.log(artistArray); 
	
	for (var i = 0; i < artistArray.length; i++) {
		requestSpotifyIDs(artistArray[i]);
		$('#artistNames').append('<p class="artist">' + artistArray[i] + '</p'); 
	}
}

function requestSpotifyIDs (artistName) {
	
	var spotifyArtistSearchURL = "http://ws.spotify.com/search/1/artist.json?q=" + artistName;

	$.ajax({
			url: spotifyArtistSearchURL,
			dataType: "json",

			error: function(data){
				console.log("oops");
				console.log(data);
			},	

			success: function (data) {	
				console.log("success");
				console.log(data);	 
				
				for (var i = 0; i < data.artists.length; i++) {
				    if (data.artists[i].name === artistName){
						spotifyArtistHREFs.push(data.artists[i].href);
				    }
				}	
		  	spotifyArtistHREFs = removeDuplicates(spotifyArtistHREFs);
		  	console.log(spotifyArtistHREFs);	
			}
		});
}

function getSpotifyAlbums(hrefs){

	for (var i = 0; i < hrefs.length; i++) {
		requestSpotifyAlbums(hrefs[i]);
	}
}

function requestSpotifyAlbums(hrefs) {
	
	var spotifyAlbumSearchURL = "http://ws.spotify.com/lookup/1/.json?uri=" + hrefs + "&extras=albumdetail";

	$.ajax({
			url: spotifyAlbumSearchURL,
			dataType: "json",

			error: function(data){
				console.log("oops");
				console.log(data);
			},	

			success: function (data) {	
				// console.log(data);
				console.log("success");
				spotifyAlbumObjects.push(data);
				console.log(spotifyAlbumObjects);	
		}
	});
}

function getRandomAlbum(spotifyAlbums){

		for (var i = 0; i < spotifyAlbums.length; i++) {
			var randomSize = spotifyAlbums[i].artist.albums.length;
			var randIndex = Math.floor(Math.random()*randomSize);
			console.log(randIndex);
			randomAlbums[i] = spotifyAlbums[i].artist.albums[randIndex].album.href;
			}

		randomAlbums = removeDuplicates(randomAlbums);
		console.log(randomAlbums);
		putPlaylistsOnPage(randomAlbums); 
		
}

function putPlaylistsOnPage(spotifyRandomAlbums){

	for (var i = 0; i < spotifyRandomAlbums.length; i++) {
		
		var tempString = '<iframe src="https://embed.spotify.com/?uri=' + spotifyRandomAlbums[i] + '" class=spotifyFrames" frameborder="0" allowtransparency="true"></iframe>';
		console.log(tempString);

		$('#playlistBox').append(tempString);
	}
}


function removeDuplicates(_array) {
		return _.uniq(_array);				
	}	

$(document).ready(function(){

	$('#searchBox').keypress(function(e){
		// e.preventDefault();
		if(e.keyCode == 13){ 
			initializeArrays();
			clearCSS();
			var inputBoxText = $('#searchBox').val();
			getBandsInTownVenueId(inputBoxText);		
		}
	});
});


$(document).ajaxStop(function(){
	console.log("ajax finished " + ajaxCounter); 
	
	if (ajaxCounter == 0){
		getSpotifyArtistIDs(artistNameArray);
	}

	else if (ajaxCounter == 1){
		getSpotifyAlbums(spotifyArtistHREFs);
	}

	else if (ajaxCounter == 2){
		getRandomAlbum(spotifyAlbumObjects);
	}

	ajaxCounter++;
});




	
