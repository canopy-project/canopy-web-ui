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
 *  CSS:
 *
 *      <your outer class> .cui_map_canvas -- Set this to where the map should go
 *
 *  METHODS:
 *
 *      .jumpTo
 */
function CuiMap(params) {
    cuiInitNode(this);

    var map;
    var $canvas;

    this.jumpTo = function(lat, lng) {
        map.panTo(new google.maps.LatLng(lat, lng));
    }

    this.onConstruct = function() {
        $canvas = $("<div class=cui_map_canvas></div>");
        return $canvas;
    }

    this.onLive = function() {
        return cuiCompose(content);
    }

    this.onRefresh = function() {
        map = new google.maps.Map($canvas[0], {
            center: { lat: 37.708333, lng: -122.280278},
            zoom: 10,
            streetViewControl: false
        });
    }
}
