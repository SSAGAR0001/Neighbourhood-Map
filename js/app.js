var map;
var largeInfowindow;
// Create a new blank array for all the listing markers.
var markers = [];

 var highlightedIcon;
 var defaultIcon;

function errorThere () {
    view_model.isErrorThere( true );
    view_model.errorMessage("Can't Load The Map");
}

var locations = [{
        title: 'Jakhoo Temple',
        location: {
            lat: 31.1012356,
            lng: 77.1838773
        }
    },
    {
        title: 'Christ Church',
        location: {
            lat: 31.104327,
            lng: 77.175908
        }
    },
    {
        title: 'Tara Devi Temple',
        location: {
            lat: 31.085916,
            lng: 77.140002
        }
    },
    {
        title: 'Sankat Mochan Temple',
        location: {
            lat: 31.085336,
            lng: 77.142533
        }
    },
    {
        title: 'Kamna devi temple',
        location: {
            lat: 31.0962124,
            lng: 77.1341762
        }
    },
    {
        title: 'Kali Bari Temple',
        location: {
            lat: 31.1059884,
            lng: 77.166805
        }
    }
];

function initMap() {
    // Create a styles array to use with the map.
    var styles = [{
        featureType: 'water',
        stylers: [{
            color: '#19a0d8'
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [{
                color: '#FFFFFF'
            },
            {
                weight: 6
            }
        ]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#e85113'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
                color: '#efe9e4'
            },
            {
                lightness: -40
            }
        ]
    }, {
        featureType: 'transit.station',
        stylers: [{
                weight: 9
            },
            {
                hue: '#e85113'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [{
            visibility: 'off'
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
            lightness: 100
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            lightness: -100
        }]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
                visibility: 'on'
            },
            {
                color: '#f0e4d3'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
                color: '#efe9e4'
            },
            {
                lightness: -25
            }
        ]
    }];
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 31.104097,
            lng: 77.171745
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });
    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.

    largeInfowindow = new google.maps.InfoWindow();
    // Style the markers a bit. This will be our listing marker icon.
    defaultIcon = makeMarkerIcon('E74C3C');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    highlightedIcon = makeMarkerIcon('EC7063');
    ThirdOne = makeMarkerIcon('E59866');
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i,
            map:map
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click',populateInfoWindowBefore, makeItBounce);

        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', setTheIcon);
        marker.addListener('mouseout', defaultTheIcon);
    }
    //document.getElementById('show-listings').addEventListener('click', showListings);
    //document.getElementById('hide-listings').addEventListener('click', hideListings);
    view_model.init();
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function ThirdIcon() {
    this.setIcon(ThirdOne);
}
function setTheIcon()
{
    this.setIcon(highlightedIcon);
}

function defaultTheIcon()
{
    this.setIcon(defaultIcon);
}


function populateInfoWindowBefore() {
    populateInfoWindow( this , largeInfowindow );    
}

function populateInfoWindow(marker, infowindow) {
    makeItBounce(marker);
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.

        infowindow.marker = marker;
        var data = get_flickr(marker);
        //console.log(data);
        infowindow.setContent(data);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}
// This function will loop through the markers array and display them all.

function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}
// This function will loop through the listings and hide them all.

function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}
// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).

function highlight_marker(data) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].title == data) {
            makeItBounce( markers[ i ] );
            populateInfoWindow(markers[i], largeInfowindow);
            break;
        }
    }
}

function makeItBounce( marker ) {
    marker.setAnimation( google.maps.Animation.BOUNCE );
    setTimeout( function(){
        marker.setAnimation(null);
    },5000);
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

function get_flickr(marker) {
    var lat = marker.position.lat();
    var lng = marker.position.lng();
    var flickrUrl = ' https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e98f2c0ac159245584671338a9857397&lat='+lat+'&lon='+lng+'&radius=0.5&format=json&nojsoncallback=1';
    var images = '';
    $.ajax({
        url: flickrUrl,
        data: 'lat=' + marker.position.lat() + '&lon=' + marker.position.lng(),
    }).done(function(response) {
        //console.log(response);
        var myPhotos = response.photos.photo;
        images = '<h2>Nearby Images</h2>';
        for (var i = 0; i < 5; i++) {
            images += '<img src = "' + 'https://farm' + myPhotos[i].farm + '.staticflickr.com/' + myPhotos[i].server + '/' + myPhotos[i].id + '_' + myPhotos[i].secret + '.jpg"><br>';
        }

        largeInfowindow.setContent(images);
    }).fail(function(response, status, error) {
        images += "Canit load images some error there";
        largeInfowindow.setContent(images);
    });

}

function showMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(true);
    }
}

function hideMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(false);
    }
}
var view_model = {


    listing: ko.observableArray([]),
    // Live search inspired by "http://opensoul.org/2011/06/23/live-search-with-knockoutjs/"


    isErrorThere : ko.observable( false ),
    errorMessage : ko.observable(''),

    query: ko.observable(''),

    init: function() {
        //console.log( locations );
        for (var i in locations) {
            view_model.listing.push(locations[i].title);
        }
    },
    search: function(key) {
        view_model.listing.removeAll();
        for (var i in markers) {
            if (markers[i].title.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                view_model.listing.push(markers[i].title);
                markers[i].setVisible(true);
            } else {
                markers[i].setVisible(false);
            }
        }
    }
};
view_model.query.subscribe(view_model.search);
ko.applyBindings(view_model);