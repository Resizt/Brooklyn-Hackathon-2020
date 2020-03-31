const drop_in_center_indexes = Object.freeze({
	"Name": 8,
	"Borough": 9,
	"Address": 10,
	"Hours": 11,
	"Zip": 12,
	"Lat": 13,
	"Lng": 14,
	"Phone": -1
});
const facilities_indexes = Object.freeze({
	"Name": 11,
	"Borough": 17,
	"Address": 12,
	"Hours": -1,
	"Zip": 13,
	"Lat": -1,
	"Lng": -1,
	"Point": 8,
	"Phone": 14
});
const after_school_indexes = Object.freeze({
	"Name": 10,
	"Borough": 11,
	"Address": 16,
	"Hours": -1,
	"Zip": 17,
	"Lat": 18,
	"Lng": 19,
	"Point": -1,
	"Phone": 13
});
const prevention_indexes = Object.freeze({
	"Name": 8,
	"Borough": 13,
	"Address": 10,
	"Hours": -1,
	"Zip": 12,
	"Lat": 14,
	"Lng": 15,
	"Point": -1,
	"Phone": 11
});

function generateContentString(i, idxs, json) {
	//init content string
	let cs = "<div>";
	if (idxs.Name != -1) {
		cs += '<p>' + json['data'][i][idxs.Name] + '</p>';
	}
	if (idxs.Address != -1) {
		cs += '<div>' + json['data'][i][idxs.Address] + '</div>';
	}
	if (idxs.Borough != -1) {
		cs += '<div>' + json['data'][i][idxs.Borough];
	}
	cs += ' NY ';
	if (idxs.Zip != -1) {
		cs += parseInt(json['data'][i][idxs.Zip]);
	}
	cs += '</div>';
	if (idxs.Hours != -1) {
		cs += '</br><div>' + parseHoursOpen(json['data'][i][idxs.Hours]) + '</div>';
	}
	if (idxs.Phone != -1) {
		cs += '</br><div>' + json['data'][i][idxs.Phone] + '</div>';
	}
	return cs;
}

function parseHoursOpen(hours) {
	if (hours == "") {
		return "";
	}
	let splitStr = hours.split('.');
	let output = "";
	for (let i = 0; i < splitStr.length; i++) {
		if (splitStr[i] == " This program remain open 24 hours during winter months") {
			output += "</br>";
		}
		output += splitStr[i];
	}
	return output;
}

function parsePosition(pos) {
	let splitStr = pos.split(" ");
	let splitLng = splitStr[1].split("(");
	let splitLat = splitStr[2].split(")");
	return {
		Lng: parseFloat(splitLng[1]),
		Lat: parseFloat(splitLat[0])
	};
}
//require('dotenv').config();
function initMap() {
	let center = {
		lat: 40.738,
		lng: -74.006
	};
	generateMap("homeless_drop_in_center.json", drop_in_center_indexes, center);
}

function updateMap(type) {
	if (type == 'drop-in') {
		generateMap('homeless_drop_in_center.json', drop_in_center_indexes, {
			lat: 40.738,
			lng: -74.006
		});
	} else if (type == 'facilities') {
		generateMap('homeless_facilities.json', facilities_indexes, {
			lat: 40.738,
			lng: -74.006
		});
	} else if (type == 'afterschool') {
		generateMap('homeless_after_school_programs.json', after_school_indexes, {
			lat: 40.738,
			lng: -74.006
		});
	} else if (type == 'prevention') {
		generateMap('homeless_prevention_offices.json', prevention_indexes, {
			lat: 40.738,
			lng: -74.006
		});
	}
}

function generateMap(json_path, idxs, center) {
	//Center map based on location of markers
	let map = new google.maps.Map(
		document.getElementById('map'), {
			zoom: 11,
			center: center
		});
	map.setOptions({
		styles: [{
			featureType: 'poi.business',
			stylers: [{
				visibility: 'off'
			}]
		}]
	});
	$.getJSON(json_path, function (json) {
		console.log('JSON Loaded');
		console.log(json);
		let i;
		if (json_path == 'homeless_after_school_programs.json') {
			i = 10;
		} else {
			i = 0;
		}
		for (let j; i < json['data'].length; i++) {
			let lat;
			let lng;
			// If LAtitude and Longitude data is available
			if (idxs.Lat != -1 && idxs.Lng != -1) {
				lat = parseFloat(json['data'][i][idxs.Lat]);
				lng = parseFloat(json['data'][i][idxs.Lng]);
				// If position data is available (both latitude and longitude)
			} else {
				let position = parsePosition(json['data'][i][idxs.Point]);
				lat = position.Lat;
				lng = position.Lng;
			}
			let marker = new google.maps.Marker({
				position: {
					lng: lng,
					lat: lat
				},
				animation: google.maps.Animation.DROP,
				map: map
			});
			let hours_open;
			if (idxs.Hours != -1) {
				hours_open = json['data'][i][idxs.Hours];
			} else {
				hours_open = "";
			}

			let contentString = generateContentString(i, idxs, json);
			let infoWindow = new google.maps.InfoWindow({
				content: contentString
			});
			marker.addListener('click', function () {
				infoWindow.open(map, marker);
			});
		}
	});
}

let apiScript = document.getElementById("apiScript");
apiScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCXLGmC6DNjJvSjlc5BjgpVTbx8YaI-z2w&callback=initMap";