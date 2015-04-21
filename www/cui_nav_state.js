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
 * CuiNavState is a utility for managing the browser's URL query string and
 * history.
 *
 * The global variable cuiNavState can be used to access and modify the query
 * string.
 *
 * Use cuiNavState.get(key) to obtain a value from the query string.
 *
 * Use cuiNavState.set(key, value) to add or modify a value in the query
 * string, updating the browser history.
 *
 * Use cuiNavState.replace(key, value) to add or modify a value in the query
 * string, without updating the browser history.
 */
function CuiNavState() {
    var queryString;
    var queryObj;

    function encodeQueryString(obj) {
        var out = [];
        for(var key in obj) {
            if (obj.hasOwnProperty(key)) {
                out.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
            }
        }
        return out.join("&");
    }

    function decodeQueryString(qs) {
        var out = {};
        if (qs == "") {
            return out;
        }
        var parts = qs.split('&');
        for (var i = 0; i < parts.length; i++) {
            var kv = parts[i].split('=');
            out[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
        }
        return out;
    }

    this.set = function(name, value) {
        if (queryObj[name] !== value) {
            queryObj[name] = value;
            queryString = encodeQueryString(queryObj);
            history.pushState({}, "CANOPY", "?" + queryString);
        }
    }

    this.replace = function(name, value) {
        if (queryObj[name] !== value) {
            queryObj[name] = value;
            queryString = encodeQueryString(queryObj);
            history.replaceState({}, "CANOPY", "?" + queryString);
        }
    }

    this.get = function(name) {
        return queryObj[name];
    }

    this.readActualQueryString = function() {
        queryString = location.search.slice(1) ? location.search.slice(1) : "";
        queryObj = decodeQueryString(queryString);
    }

    this.readActualQueryString();
}

window.onpopstate = function(event) {
    console.log(event);

    // TODO: This causes infinite refresh on Safari & Chrome.
    //location.reload();
};

cuiNavState = new CuiNavState();
