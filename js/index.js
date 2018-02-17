var service, currentLocation, request, paginator, selectedstore;
var autocomplete;
var searchLat = 37.3382082;
var searchLon = -121.88632860000001;
var searchResults = [];
var searchLocationText = "";
var fullImageSize = {
	'maxWidth' : 1600,
	'maxHeight' : 1600
};
var thumbmageSize = {
	'maxWidth' : 400,
	'maxHeight' : 400
};
var autocompleteOptions = {
	types : ['(cities)'],
	componentRestrictions : {
		country : "in"
	}
};
function initialize() {
	$("#holder").html("");
	searchResults = [];
	paginator = undefined;
	currentLocation = new google.maps.LatLng(searchLat, searchLon);
	var request = {
		location : currentLocation,
		radius : 50000,
		keyword : "ivf clinic",
		types : ["establishment", 'doctor', 'hospital']
	};

	// Create only once.
	if (!service) {
		service = new google.maps.places.PlacesService(document.getElementById('map-canvas'));
	}

	service.nearbySearch(request, callback);
}

function callback(results, status, pagination) {
	console.log("RESULTS " + status);
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		paginator = pagination;
		var fullResults = searchResults.concat(results);
		searchResults = fullResults;
		console.log("RESULTS OK with aggregated size " + searchResults.length);
		renderResults(searchResults);
	} else {
		console.log("RESULTS NOT OK ");
	}
}

function renderResults(results) {

	if (!results || results.length < 1) {
		$('body').trigger('hide_more_button', true);
		return;
	}

	if (paginator && paginator.hasNextPage) {
		$('body').trigger('hide_more_button', false);
	} else {
		$('body').trigger('hide_more_button', true);
	}

	for (var i = 0; i < results.length; i++) {
		var photos = results[i].photos;
		if (photos) {
			var istr = photos[0].getUrl(thumbmageSize);
			results[i].image = istr;
		} else {
			//var rimage = 'http://lorempixel.com/300/250/fashion/' + Math.abs(i % 10);
			var rimage = getImage();
			results[i].image = rimage;
		}
	}

	if (!results || results.length < 1) {
		$("#search_message").html("No Stores found<br><small>" + "in the city" + "</small>");
	}

	var template = $('#search-places-list').html();
	var html = Mustache.to_html(template, {
		rows : results
	});
	$("#holder").html(html);
	$("#search_message").html("Search results<br><small>" + searchLocationText + "</small>");
}

function geolocate() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			searchLon = position.coords.longitude;
			searchLat = position.coords.latitude;
			var circle = new google.maps.Circle({
				center : geolocation,
				radius : position.coords.accuracy
			});
			autocomplete.setBounds(circle.getBounds());
		});
	}
}

function updateStellars() {
	$.stellar({
		horizontalScrolling : false,
		responsive : true
	});
	$.stellar('refresh');
}

function EmbedlyService() {
	var alreadyLoaded = [];
	alreadyLoaded["foo"] = 'bar';

	return {

		extract : function(_site, _callback) {
			// Prepend http if it is missing
			if (!/^https?:\/\//i.test(_site)) {
				_site = 'http://' + _site;
				//console.log(_site);
			}
			var key = "'" + _site + "'";

			var existingData = alreadyLoaded[key];
			if (existingData) {
				_callback(existingData);
				console.log("Returning from cache...");
				return;
			}

			var site = "http://api.embed.ly/1/extract?key=2a7cebb5241c49ada925e0a3f21b2fb7&format=json&maxwidth=800&url=" + encodeURIComponent(_site);
			$.getJSON(site, function(data) {
				var responseData = {
					title : data.title,
					desc : data.description,
					images : data.images,
					url : _site,
					payload : data,
					site : _site
				};
				alreadyLoaded[key] = responseData;
				_callback(responseData);
			});
		}
	};
};

// EVENT LISTENERS
$('body').bind('hide_more_button', function(e, data) {
	var data = data || e.data;
	if (data) {
		$("#more").hide();
	} else {
		$("#more").show();
	}
});

$('body').bind('show_store_details', function(e, data) {
	var data = data || e.data;
	var request = {
		placeId : data
	};
	if (service) {
		service.getDetails(request, renderStoreDetails);
	} else {
		service = new google.maps.places.PlacesService(document.getElementById('map-canvas'));
		service.getDetails(request, renderStoreDetails);
	}
});

$('body').bind('show_search_screen', function(e, data) {
	var data = data || e.data;
	$('#fullscreenElement').addClass('open');
});

var picIndex = -1;
var imagesArray = [];
for (var i = 1; i < 17; i++) {
	imagesArray.push("img/santaanpics/pic" + i + ".jpg");
}
function getImage() {
	picIndex++;
	if (picIndex >= imagesArray.length) {
		picIndex = 0;
	};
	return imagesArray[picIndex];
}

