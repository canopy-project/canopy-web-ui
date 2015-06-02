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
 * App dropdown part of top bar.
 *
 *  PARAMS:
 *      params.title
 *      params.apps
 *      params.cssClass - defaults to ""
 *
 *  METHODS:
 *
 *      setApps
 *
 */
function CuiAppDropdown(params) {
    cuiInitNode(this);
    
    var dropdown;
    var option;
    var apps = params.apps;
    var cachedApps;
    this.markDirty("apps");

    /* <apps> is list of objects:
     *
     *  [ {
     *      "name" : "My App"
     *      "href" : "//dev02.canopy.link/mgr/myapp",
     *  }, ...]
     */
    this.setApps = function(_apps) {
        apps = _apps;
        return this.markDirty("apps");
    }

    this.onConstruct = function() {
        option = new CuiOption({
            cssClass: "cui_app_dropdown",
            items: [],
            onSelect: function(idx, value) {
                window.location = value;
            }
        });

        dropdown = new CuiDropdown({
            cssClass: "cui_app_dropdown",
            buttonContent: params.title,
            popupContent: option,
        });

        return [
            "<div class='cui_app_dropdown " + params.cssClass + "'>",
                dropdown,
            "</div>"
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        if (dirty("apps")) {
            var items = [];
            if (apps) {
                for (var i = 0; i < apps.length; i++) {
                    items.push({
                        content: apps[i].name,
                        value: apps[i].href
                    });
                }
            }
            option.setItems(items);
            cachedApps = apps;
        }
        cuiRefresh([dropdown, option], live);
    }
}


