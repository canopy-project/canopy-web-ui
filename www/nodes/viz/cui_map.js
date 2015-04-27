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
    var markersData = [];
    var paths = [];
    var self = this;

    this.jumpTo = function(lat, lng) {
        map.panTo(new google.maps.LatLng(lat, lng));
    }

    this.addMarker = function(lat, lng, title, infoContent) {
        var markerData = {
            lat: lat, 
            lng: lng, 
            title: title, 
            infoContent: infoContent
        };

        markersData.push(markerData);

        this.markDirty("marker");
    }

    this.clearMarkersAndPaths = function() {
        markers = [];
        paths = [];
        this.markDirty("marker");
    }

    this.addPath = function(coords) {
        var path = new google.maps.Polyline({
            path: coords,
            geodesic: true,
            strokeColor: "#3060b0",
            strokeOpacity: 0.8,
            strokeWeight: 2,
        });
        paths.push(path);

        return this;
    }

    this.onConstruct = function() {
        $canvas = $("<div class=cui_map_canvas></div>");
        return $canvas;
    }

    this.onRefresh = function($me, dirty, live) {
        if (params.showPlaceholder) {
            $canvas.css("background", "#808080");
            return true;
        }

        if (dirty("marker") && map && live) {
            for (var i = 0; i < markersData.length; i++) {
                var markerLatLng = new google.maps.LatLng(markersData[i].lat, markersData[i].lng);

                if (markersData[i].infoContent) {
                    markersData[i].infoWindow = new google.maps.InfoWindow({
                        content: markersData[i].infoContent,
                    });
                }

                if (map) {
                    var marker = new google.maps.Marker({
                        position: markerLatLng,
                        map: map,
                        title: markersData[i].title,
                    });

                    google.maps.event.addListener(marker, 'click', function(idx) {
                        return function() {
                            if (markersData[idx].infoWindow) {
                                markersData[idx].infoWindow.open(map, marker);
                            }
                        }
                    }(i));

                    if (markersData[i].infoWindow) {
                        markersData[i].infoWindow.open(map, marker);
                    }
                }
            }

            for (var i = 0; i < paths.length; i++) {
                paths[i].setMap(map);
            }
            this.clearDirty("marker");
        }

        return false; // false = manually clear dirty flags.
    }

    this.onSetupCallbacks = function() {
        setTimeout(function() {
            if (!map && !params.showPlaceholder) {
                map = new google.maps.Map($canvas[0], {
                    center: { lat: 37.769154, lng: -122.430367},
                    zoom: 12,
                    streetViewControl: false
                });
            }
            self.markDirty("marker").refresh();
        }, 1);
    }

    this.onTeardownCallbacks = function() {
        /*map = null;
        $canvas.html("");*/
    }
}
