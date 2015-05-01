/*
 * Copyright 2015 Canopy Services, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * CuiMap shows a google map.
 *
 *  PARAMS:
 *
 *      .showPlaceholder -- Set to true to display a static placeholder 
 *
 *  CSS:
 *
 *      <your outer class> .cui_map_canvas -- Set this to where the map should go
 *
 *  METHODS:
 *
 *      .jumpTo(lat, lng)
 *      .addMarker(lat, lng, title, infoContent) -> Returns marker
 */
function CuiMap(params) {
    cuiInitNode(this);

    var map;
    var mapCreated = false;
    var $canvas;
    var markers = {};
    var paths = [];
    var self = this;

    var cachedMarkers = {};
    var cachedPaths = {};

    this.jumpTo = function(lat, lng) {
        map.panTo(new google.maps.LatLng(lat, lng));
    }

    this.clearAllMarkers = function() {
        markers = {};
        return this;
    }

    this.setMarker = function(id, lat, lng, title, infoContent) {
        markers[id] = {
            id: id, 
            lat: lat, 
            lng: lng, 
            title: title, 
        };
        if (infoContent) {
            markers[id].infoWindow = new google.maps.InfoWindow({
                content: infoContent,
            });
        }
        return this;
    }

    this.removeMarker = function(id) {
        markers[id] = undefined;
    }

    this.setPath = function(id, coords) {
        if (markers[id]) {
            coords.push(new google.maps.LatLng(markers[id].lat, markers[id].lng));
        }
        var path = new google.maps.Polyline({
            path: coords,
            geodesic: true,
            strokeColor: "#3060c0",
            strokeOpacity: 0.8,
            strokeWeight: 2,
        });

        paths[id] = path;
        return this;
    }

    this.removePath = function(id) {
        paths[id] = undefined;
        return this;
    }

    this.onConstruct = function() {
        $canvas = $("<div class=cui_map_canvas></div>");
        return $canvas;
    }

    // Returns google marker
    function addGoogleMarker(map, lat, lng, title, infoWindow) {
        var latLng = new google.maps.LatLng(lat, lng);

        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: title,
        });

        google.maps.event.addListener(marker, 'click', function() {
            if (infoWindow) {
                infoWindow.open(map, marker);
            }
        });

        return marker;
    }

    function updateGoogleMarker(googleMarker, lat, lng, title) {
        var latLng = new google.maps.LatLng(lat, lng);
        googleMarker.setPosition(latLng);
        googleMarker.setTitle(title);
    }

    this.onRefresh = function($me, dirty, live) {
        if (!live) {
            return;
        }

        if (!map && !params.showPlaceholder) {
            map = new google.maps.Map($canvas[0], {
                center: { lat: 37.769154, lng: -122.430367},
                zoom: 12,
                streetViewControl: false
            });
        }

        if (params.showPlaceholder) {
            $canvas.css("background", "#808080");
            return;
        }

        // Update markers
        cuiObjectDiff(cachedMarkers, markers,
            // For each marker that was added:
            function(addedKey, added) {
                var googleMarker = addGoogleMarker(
                    map, 
                    added.lat, 
                    added.lng, 
                    added.title,
                    added.infoWindow
                );
                cachedMarkers[addedKey] = added;
                cachedMarkers[addedKey].googleMarker = googleMarker;
            },

            // For each marker that was modified:
            function(key, orig, now) {
                updateGoogleMarker(
                    orig.googleMarker,
                    now.lat,
                    now.lng,
                    now.title
                );
                orig.lat = now.lat;
                orig.lng = now.lng;
                orig.title = now.title;
            },

            // For each marker that was removed:
            function(removedKey, removed) {
                removeGoogleMarker(removed.googleMarker);
                cachedMarkers[removedKey] = undefined;
            }
        );

        // Update paths
        cuiObjectDiff(cachedPaths, paths,
            // For each path that was added:
            function(addedKey, addedGooglePath) {
                addedGooglePath.setMap(map);
                cachedPaths[addedKey] = addedGooglePath;
            },

            // For each path that was modified:
            function(key, orig, now) {
                // It is a new google Polyline object.
                orig.setMap(null);
                now.setMap(map);
                cachedPaths[key] = now;
            },

            // For each path that was removed:
            function(removedKey, removedGooglePath) {
                removedGooglePath.setMap(null);
                cachedMarkers[removedKey] = undefined;
            }
        );
    }
}
