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
    var $canvas;
    var infoWindow;
    var marker;

    this.jumpTo = function(lat, lng) {
        map.panTo(new google.maps.LatLng(lat, lng));
    }

    this.addMarker = function(lat, lng, title, infoContent) {
        var myLatLng = new google.maps.LatLng(lat, lng);

        if (infoContent) {
            infoWindow = new google.maps.InfoWindow({
                content: infoContent,
                //pixelOffset: new google.maps.Size(100, 0)
            });
        }

        marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: title,
            optimized: false
        });

        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(map, marker);
        });

        return marker;
    }

    this.onConstruct = function() {
        $canvas = $("<div class=cui_map_canvas></div>");
        console.log("Constructing map");
        return $canvas;
    }

    this.onLive = function() {
        console.log("OnLive Map");
    }

    this.onRefresh = function() {
        console.log("Map refresh");
        if (params.showPlaceholder) {
            $canvas.css("background", "#808080");
            return;
        }
        if (!map) {
            console.log("Creating map");
            map = new google.maps.Map($canvas[0], {
                center: { lat: 37.769154, lng: -122.430367},
                zoom: 12,
                streetViewControl: false
            });
        }
        if (infoWindow) {
            infoWindow.open(map, marker);
        }
    }
}
