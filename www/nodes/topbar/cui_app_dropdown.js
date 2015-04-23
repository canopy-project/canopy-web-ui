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
 *      params.items
 *      params.cssClass - defaults to ""
 *
 */
function CuiAppDropdown(params) {
    cuiInitNode(this);
    
    var dropdown;
    var option;

    this.onConstruct = function() {
        option = new CuiOption({
            cssClass: "cui_app_dropdown",
            items: [{
                content: "Device Manager",
                value: "device_manager",
            }, {
                content: "CanopyCS",
                value: "canopy_cs",
            }]
        });

        dropdown = new CuiDropdown({
            cssClass: "cui_app_dropdown",
            buttonContent: "Device Manager <div style='float: right'>&#x25bc;</div>",
            popupContent: option,
        });

        return [
            "<div class='cui_app_dropdown " + params.cssClass + "'>",
                dropdown,
            "</div>"
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        cuiRefresh([dropdown], live);
    }
}


