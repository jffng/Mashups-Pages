//make an input box with name of venue--finished
//retrieve venue's id number from Band's in Town--finished
//use venue Id to search for Events--finished 
//Find today's date--finished

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

var venueIdList = [];
var venueEventList = [];
var filteredDateEvent = []; 
var venueEventListArtists = [];
var artistNameArray = [];  
var today = Date.create().format(Date.ISO8601_DATE);

console.log(today);


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
				//console.log(data);	
					
			for (var i = 0; i < data.length; i++) {
			      getVenueEvents(data[i].id);
				}
			
			venueIdList = []; 
			
			}
		});
}

function getVenueEvents(venueIdArray){ 
    
	var	bandsInTownEventURL = "http://api.bandsintown.com/venues/" + venueIdArray +"/events.json?app_id=theyGood&callback=displayEvents"; 

		$.ajax({
			url: bandsInTownEventURL,
			dataType: "jsonp",

			error: function(data){
				console.log("oops");
				console.log(data);
			},	

			success: function (data) {	
			    console.log("success");
			    //console.log(data);	
				for (var i = 0; i < data.length; i++) {
					  venueEventList.push(data[i]); 
				 }; 
				 
				 filterDate(); 
				 getArtistNames();
				 artistNameArray = removeDuplicates(artistNameArray);
			 }
			
		});
}



function filterDate() {
	for (var i = 0; i < venueEventList.length; i++) {
		
		var eventTruncDate = venueEventList[i].datetime.truncate(10, 'right', '' );
		
		if (eventTruncDate === today){
			 filteredDateEvent.push(venueEventList[i]);
			}
	};
}


function getArtistNames(){

	for (var i = 0; i < filteredDateEvent.length; i++) {
		for (var j = 0; j < filteredDateEvent[i].artists.length; j++) {
			artistNameArray.push(filteredDateEvent[i].artists[j].name);
			//console.log(filteredDateEvent[i].artists[j].name);
			};	
		};	
}
	
function removeDuplicates(_array) {
		return _.uniq(_array);				
	}	


$(document).ready(function(){

	$('#update').click(function() {
		
		//maybe check for blank input box
		var inputBoxText = $('#searchBox').val();
		getBandsInTownVenueId(inputBoxText);
		
		
	});
});

	
